import { error, fail, type ActionFailure, type RequestEvent } from '@sveltejs/kit';
import {
    z,
    ZodType,
    type ZodRawShape,
    type ZodTypeAny,
    type SafeParseReturnType,
    ZodObject,
    type typeToFlattenedError,
    type SafeParseSuccess,
} from 'zod';

const getSearchParams = (data: URLSearchParams | RequestEvent) => {
    const searchParams = data instanceof URLSearchParams ? data : data.url.searchParams;

    const params: Record<string, string | string[]> = {};

    for (const [key, value] of searchParams) {
        const current = params[key];
        if (current && Array.isArray(current)) {
            current.push(value);
        } else {
            params[key] = current ? [current, value] : value;
        }
    }

    return params;
};

const getFormData = async (data: FormData | RequestEvent) => {
    const formData = data instanceof FormData ? data : await data.request.formData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return getSearchParams(new URLSearchParams(formData as any));
};

type RouteParams = Partial<Record<string, string>>;

type Schema = ZodTypeAny | ZodRawShape;

type ParsedData<T extends Schema> = T extends ZodTypeAny
    ? z.output<T>
    : T extends ZodRawShape
    ? z.output<ZodObject<T>>
    : never;

type SchemaInput<T extends Schema> = T extends ZodTypeAny
    ? z.infer<T>
    : T extends ZodRawShape
    ? ZodObject<T>
    : never;

export type SafeParseFailure<T extends Schema> = {
    success: false;
    errors: typeToFlattenedError<SchemaInput<T>>['fieldErrors'];
    response: ActionFailure<{ errors: typeToFlattenedError<SchemaInput<T>>['fieldErrors'] }>;
};

type SafeParseData<T extends Schema> = SafeParseSuccess<ParsedData<T>> | SafeParseFailure<T>;

export function getSchema<T extends Schema>(schema: T) {
    return schema instanceof ZodType ? schema : (z.object(schema) as ZodTypeAny);
}

export function parseSafe<T extends Schema>(data: unknown, schema: T): SafeParseData<T> {
    const result = getSchema(schema).safeParse(data) as SafeParseReturnType<
        SchemaInput<T>,
        ParsedData<T>
    >;

    if (!result.success) {
        return {
            success: false,
            errors: result.error.flatten().fieldErrors,
            response: fail(400, {
                errors: result.error.flatten().fieldErrors,
            }),
        } as SafeParseFailure<T>;
    }

    return result as SafeParseSuccess<ParsedData<T>>;
}

export function parse<T extends Schema>(data: unknown, schema: T) {
    const result = getSchema(schema).safeParse(data);
    if (!result.success) {
        throw error(400, {
            message: 'Parsing Failed',
            errors: result.error.flatten().fieldErrors,
        });
    }
    return result.data;
}

export function parseSearchParamsSafe<T extends Schema>(
    data: URLSearchParams | RequestEvent,
    schema: T,
): SafeParseData<T> {
    const params = getSearchParams(data);
    return parseSafe(params, schema);
}

export function parseSearchParams<T extends Schema>(
    data: URLSearchParams | RequestEvent,
    schema: T,
): ParsedData<T> {
    const params = getSearchParams(data);
    return parse(params, schema);
}

export async function parseFormDataSafe<T extends Schema>(
    data: FormData | RequestEvent,
    schema: T,
): Promise<SafeParseData<T>> {
    const formData = await getFormData(data);
    return parseSafe(formData, schema);
}

export async function parseFormData<T extends Schema>(
    data: FormData | RequestEvent,
    schema: T,
): Promise<ParsedData<T>> {
    const formData = await getFormData(data);
    return parse(formData, schema);
}

export function isRequestEvent(data: RouteParams | RequestEvent): data is RequestEvent {
    return (data as RequestEvent).params instanceof Object;
}

export function parseRouteParamsSafe<T extends Schema>(
    data: RouteParams | RequestEvent,
    schema: T,
): SafeParseData<T> {
    const routeParams = isRequestEvent(data) ? data.params : data;
    return parseSafe(routeParams, schema);
}

export function parseRouteParams<T extends Schema>(
    data: RouteParams | RequestEvent,
    schema: T,
): ParsedData<T> {
    const routeParams = isRequestEvent(data) ? data.params : data;
    return parse(routeParams, schema);
}

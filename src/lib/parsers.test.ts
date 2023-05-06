import type { RequestEvent } from '@sveltejs/kit';
import { describe, it, expect } from 'vitest';
import { z, type SafeParseError } from 'zod';
import { mock, mockDeep } from 'vitest-mock-extended';

import {
    parseFormData,
    parseFormDataSafe,
    parseRouteParams,
    parseRouteParamsSafe,
    parseSearchParams,
    parseSearchParamsSafe,
} from '$lib/parsers.js';

describe('parseSearchParamsSafe', () => {
    it('parses search params using an object', () => {
        const schema = { a: z.number({ coerce: true }), b: z.string() };
        const searchParams = new URLSearchParams('?a=1&b=test');

        expect(parseSearchParamsSafe(searchParams, schema)).toEqual({
            data: {
                a: 1,
                b: 'test',
            },
            success: true,
        });
    });

    it('parses search params using a schema', () => {
        const schema = z.object({ a: z.number({ coerce: true }), b: z.string() });
        const searchParams = new URLSearchParams('?a=1&b=test');

        expect(parseSearchParamsSafe(searchParams, schema)).toEqual({
            data: {
                a: 1,
                b: 'test',
            },
            success: true,
        });
    });

    it('returns error for invalid search params using an object', () => {
        const schema = { a: z.number({ coerce: true }), b: z.string() };
        const searchParams = new URLSearchParams('?a=test&b=test');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = parseSearchParamsSafe(searchParams, schema) as SafeParseError<any>;
        expect(result.success).toBe(false);
        expect(result.error.issues.length).toBe(1);
        expect(result.error.issues[0].path[0]).toBe('a');
    });

    it('returns error for invalid search params using a schema', () => {
        const schema = z.object({ a: z.number({ coerce: true }), b: z.string() });
        const searchParams = new URLSearchParams('?a=test&b=test');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = parseSearchParamsSafe(searchParams, schema) as SafeParseError<any>;
        expect(result.success).toBe(false);
        expect(result.error.issues.length).toBe(1);
        expect(result.error.issues[0].path[0]).toBe('a');
    });

    it('parses RequestEvent using an object', () => {
        const schema = { a: z.number({ coerce: true }), b: z.string() };
        const requestEvent = mock<RequestEvent>();
        requestEvent.url = new URL('http://example.com/?a=1&b=test');

        expect(parseSearchParamsSafe(requestEvent, schema)).toEqual({
            data: {
                a: 1,
                b: 'test',
            },
            success: true,
        });
    });

    it('parses RequestEvent using a schema', () => {
        const schema = z.object({ a: z.number({ coerce: true }), b: z.string() });
        const requestEvent = mock<RequestEvent>();
        requestEvent.url = new URL('http://example.com/?a=1&b=test');

        expect(parseSearchParamsSafe(requestEvent, schema)).toEqual({
            data: {
                a: 1,
                b: 'test',
            },
            success: true,
        });
    });

    it('returns error for invalid RequestEvent using an object', () => {
        const schema = { a: z.number({ coerce: true }), b: z.string() };
        const requestEvent = mock<RequestEvent>();
        requestEvent.url = new URL('http://example.com/?a=test&b=test');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = parseSearchParamsSafe(requestEvent, schema) as SafeParseError<any>;
        expect(result.success).toBe(false);
        expect(result.error.issues.length).toBe(1);
        expect(result.error.issues[0].path[0]).toBe('a');
    });

    it('returns error for invalid RequestEvent using a schema', () => {
        const schema = z.object({ a: z.number({ coerce: true }), b: z.string() });
        const requestEvent = mock<RequestEvent>();
        requestEvent.url = new URL('http://example.com/?a=test&b=test');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = parseSearchParamsSafe(requestEvent, schema) as SafeParseError<any>;
        expect(result.success).toBe(false);
        expect(result.error.issues.length).toBe(1);
        expect(result.error.issues[0].path[0]).toBe('a');
    });
});

describe('parseSearchParams', () => {
    it('parses search params using an object', () => {
        const schema = { a: z.number({ coerce: true }), b: z.string() };
        const searchParams = new URLSearchParams('?a=1&b=test');

        expect(parseSearchParams(searchParams, schema)).toEqual({
            a: 1,
            b: 'test',
        });
    });

    it('parses search params using a schema', () => {
        const schema = z.object({ a: z.number({ coerce: true }), b: z.string() });
        const searchParams = new URLSearchParams('?a=1&b=test');

        expect(parseSearchParams(searchParams, schema)).toEqual({
            a: 1,
            b: 'test',
        });
    });

    it('returns error for invalid search params using an object', () => {
        const schema = { a: z.number({ coerce: true }), b: z.string() };
        const searchParams = new URLSearchParams('?a=test&b=test');

        expect(() => parseSearchParams(searchParams, schema)).toThrow(
            expect.objectContaining({
                data: { errors: { a: ['Expected number, received nan'] } },
                status: 400,
            }),
        );
    });

    it('returns error for invalid search params using a schema', () => {
        const schema = z.object({ a: z.number({ coerce: true }), b: z.string() });
        const searchParams = new URLSearchParams('?a=test&b=test');

        expect(() => parseSearchParams(searchParams, schema)).toThrow(
            expect.objectContaining({
                data: { errors: { a: ['Expected number, received nan'] } },
                status: 400,
            }),
        );
    });

    it('parses RequestEvent using an object', () => {
        const schema = { a: z.number({ coerce: true }), b: z.string() };
        const requestEvent = mock<RequestEvent>();
        requestEvent.url = new URL('http://example.com/?a=1&b=test');

        expect(parseSearchParams(requestEvent, schema)).toEqual({
            a: 1,
            b: 'test',
        });
    });

    it('parses RequestEvent using a schema', () => {
        const schema = z.object({ a: z.number({ coerce: true }), b: z.string() });
        const requestEvent = mock<RequestEvent>();
        requestEvent.url = new URL('http://example.com/?a=1&b=test');

        expect(parseSearchParams(requestEvent, schema)).toEqual({
            a: 1,
            b: 'test',
        });
    });

    it('returns error for invalid RequestEvent using an object', () => {
        const schema = { a: z.number({ coerce: true }), b: z.string() };
        const requestEvent = mock<RequestEvent>();
        requestEvent.url = new URL('http://example.com/?a=test&b=test');

        expect(() => parseSearchParams(requestEvent, schema)).toThrow(
            expect.objectContaining({
                data: { errors: { a: ['Expected number, received nan'] } },
                status: 400,
            }),
        );
    });

    it('returns error for invalid RequestEvent using a schema', () => {
        const schema = z.object({ a: z.number({ coerce: true }), b: z.string() });
        const requestEvent = mock<RequestEvent>();
        requestEvent.url = new URL('http://example.com/?a=test&b=test');

        expect(() => parseSearchParams(requestEvent, schema)).toThrow(
            expect.objectContaining({
                data: { errors: { a: ['Expected number, received nan'] } },
                status: 400,
            }),
        );
    });
});

describe('parseFormDataSafe', () => {
    const validFormData = new FormData();
    validFormData.set('a', '1');
    validFormData.set('b', 'test');

    const invalidFormData = new FormData();
    invalidFormData.set('a', 'test');
    invalidFormData.set('b', 'test');

    it('parses form data using an object', async () => {
        const schema = { a: z.number({ coerce: true }), b: z.string() };
        const formData = validFormData;

        await expect(parseFormDataSafe(formData, schema)).resolves.toEqual({
            data: {
                a: 1,
                b: 'test',
            },
            success: true,
        });
    });

    it('parses form data using a schema', async () => {
        const schema = z.object({ a: z.number({ coerce: true }), b: z.string() });
        const formData = validFormData;

        await expect(parseFormDataSafe(formData, schema)).resolves.toEqual({
            data: {
                a: 1,
                b: 'test',
            },
            success: true,
        });
    });

    it('returns error for invalid form data using an object', async () => {
        const schema = { a: z.number({ coerce: true }), b: z.string() };
        const formData = invalidFormData;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = (await parseFormDataSafe(formData, schema)) as SafeParseError<any>;
        expect(result.success).toBe(false);
        expect(result.error.issues.length).toBe(1);
        expect(result.error.issues[0].path[0]).toBe('a');
    });

    it('returns error for invalid form data using a schema', async () => {
        const schema = z.object({ a: z.number({ coerce: true }), b: z.string() });
        const formData = invalidFormData;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = (await parseFormDataSafe(formData, schema)) as SafeParseError<any>;
        expect(result.success).toBe(false);
        expect(result.error.issues.length).toBe(1);
        expect(result.error.issues[0].path[0]).toBe('a');
    });

    it('parses RequestEvent using an object', async () => {
        const schema = { a: z.number({ coerce: true }), b: z.string() };
        const requestEvent = mockDeep<RequestEvent>();
        requestEvent.request.formData.mockResolvedValue(validFormData);

        await expect(parseFormDataSafe(requestEvent, schema)).resolves.toEqual({
            data: {
                a: 1,
                b: 'test',
            },
            success: true,
        });
    });

    it('parses RequestEvent using a schema', async () => {
        const schema = z.object({ a: z.number({ coerce: true }), b: z.string() });
        const requestEvent = mockDeep<RequestEvent>();
        requestEvent.request.formData.mockResolvedValue(validFormData);

        await expect(parseFormDataSafe(requestEvent, schema)).resolves.toEqual({
            data: {
                a: 1,
                b: 'test',
            },
            success: true,
        });
    });

    it('returns error for invalid RequestEvent using an object', async () => {
        const schema = { a: z.number({ coerce: true }), b: z.string() };
        const requestEvent = mockDeep<RequestEvent>();
        requestEvent.request.formData.mockResolvedValue(invalidFormData);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = (await parseFormDataSafe(requestEvent, schema)) as SafeParseError<any>;
        expect(result.success).toBe(false);
        expect(result.error.issues.length).toBe(1);
        expect(result.error.issues[0].path[0]).toBe('a');
    });

    it('returns error for invalid RequestEvent using a schema', async () => {
        const schema = z.object({ a: z.number({ coerce: true }), b: z.string() });
        const requestEvent = mockDeep<RequestEvent>();
        requestEvent.request.formData.mockResolvedValue(invalidFormData);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = (await parseFormDataSafe(requestEvent, schema)) as SafeParseError<any>;
        expect(result.success).toBe(false);
        expect(result.error.issues.length).toBe(1);
        expect(result.error.issues[0].path[0]).toBe('a');
    });
});

describe('parseFormData', () => {
    const validFormData = new FormData();
    validFormData.set('a', '1');
    validFormData.set('b', 'test');

    const invalidFormData = new FormData();
    invalidFormData.set('a', 'test');
    invalidFormData.set('b', 'test');

    it('parses form data using an object', async () => {
        const schema = { a: z.number({ coerce: true }), b: z.string() };
        const formData = validFormData;

        await expect(parseFormData(formData, schema)).resolves.toEqual({
            a: 1,
            b: 'test',
        });
    });

    it('parses form data using a schema', async () => {
        const schema = z.object({ a: z.number({ coerce: true }), b: z.string() });
        const formData = validFormData;

        await expect(parseFormData(formData, schema)).resolves.toEqual({
            a: 1,
            b: 'test',
        });
    });

    it('returns error for invalid form data using an object', async () => {
        const schema = { a: z.number({ coerce: true }), b: z.string() };
        const formData = invalidFormData;

        await expect(() => parseFormData(formData, schema)).rejects.toThrow(
            expect.objectContaining({
                data: { errors: { a: ['Expected number, received nan'] } },
                status: 400,
            }),
        );
    });

    it('returns error for invalid form data using a schema', async () => {
        const schema = z.object({ a: z.number({ coerce: true }), b: z.string() });
        const formData = invalidFormData;

        await expect(parseFormData(formData, schema)).rejects.toThrow(
            expect.objectContaining({
                data: { errors: { a: ['Expected number, received nan'] } },
                status: 400,
            }),
        );
    });

    it('parses RequestEvent using an object', async () => {
        const schema = { a: z.number({ coerce: true }), b: z.string() };
        const requestEvent = mockDeep<RequestEvent>();
        requestEvent.request.formData.mockResolvedValue(validFormData);

        await expect(parseFormData(requestEvent, schema)).resolves.toEqual({
            a: 1,
            b: 'test',
        });
    });

    it('parses RequestEvent using a schema', async () => {
        const schema = z.object({ a: z.number({ coerce: true }), b: z.string() });
        const requestEvent = mockDeep<RequestEvent>();
        requestEvent.request.formData.mockResolvedValue(validFormData);

        await expect(parseFormData(requestEvent, schema)).resolves.toEqual({
            a: 1,
            b: 'test',
        });
    });

    it('returns error for invalid RequestEvent using an object', async () => {
        const schema = { a: z.number({ coerce: true }), b: z.string() };
        const requestEvent = mockDeep<RequestEvent>();
        requestEvent.request.formData.mockResolvedValue(invalidFormData);

        await expect(parseFormData(requestEvent, schema)).rejects.toThrow(
            expect.objectContaining({
                data: { errors: { a: ['Expected number, received nan'] } },
                status: 400,
            }),
        );
    });

    it('returns error for invalid RequestEvent using a schema', async () => {
        const schema = z.object({ a: z.number({ coerce: true }), b: z.string() });
        const requestEvent = mockDeep<RequestEvent>();
        requestEvent.request.formData.mockResolvedValue(invalidFormData);

        await expect(parseFormData(requestEvent, schema)).rejects.toThrow(
            expect.objectContaining({
                data: { errors: { a: ['Expected number, received nan'] } },
                status: 400,
            }),
        );
    });
});

describe('parseRouteParamsSafe', () => {
    it('parses route params using an object', () => {
        const schema = { a: z.number({ coerce: true }), b: z.string() };
        const routeParams = { a: '1', b: 'test' };

        expect(parseRouteParamsSafe(routeParams, schema)).toEqual({
            data: {
                a: 1,
                b: 'test',
            },
            success: true,
        });
    });

    it('parses route params using a schema', () => {
        const schema = z.object({ a: z.number({ coerce: true }), b: z.string() });
        const routeParams = { a: '1', b: 'test' };

        expect(parseRouteParamsSafe(routeParams, schema)).toEqual({
            data: {
                a: 1,
                b: 'test',
            },
            success: true,
        });
    });

    it('returns error for invalid route params using an object', () => {
        const schema = { a: z.number({ coerce: true }), b: z.string() };
        const routeParams = { a: 'test', b: 'test' };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = parseRouteParamsSafe(routeParams, schema) as SafeParseError<any>;
        expect(result.success).toBe(false);
        expect(result.error.issues.length).toBe(1);
        expect(result.error.issues[0].path[0]).toBe('a');
    });

    it('returns error for invalid route params using a schema', () => {
        const schema = z.object({ a: z.number({ coerce: true }), b: z.string() });
        const routeParams = { a: 'test', b: 'test' };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = parseRouteParamsSafe(routeParams, schema) as SafeParseError<any>;
        expect(result.success).toBe(false);
        expect(result.error.issues.length).toBe(1);
        expect(result.error.issues[0].path[0]).toBe('a');
    });

    it('parses RequestEvent using an object', () => {
        const schema = { a: z.number({ coerce: true }), b: z.string() };
        const requestEvent = mock<RequestEvent>();
        requestEvent.params = { a: '1', b: 'test' };

        expect(parseRouteParamsSafe(requestEvent, schema)).toEqual({
            data: {
                a: 1,
                b: 'test',
            },
            success: true,
        });
    });

    it('parses RequestEvent using a schema', () => {
        const schema = z.object({ a: z.number({ coerce: true }), b: z.string() });
        const requestEvent = mock<RequestEvent>();
        requestEvent.params = { a: '1', b: 'test' };

        expect(parseRouteParamsSafe(requestEvent, schema)).toEqual({
            data: {
                a: 1,
                b: 'test',
            },
            success: true,
        });
    });

    it('returns error for invalid RequestEvent using an object', () => {
        const schema = { a: z.number({ coerce: true }), b: z.string() };
        const requestEvent = mock<RequestEvent>();
        requestEvent.params = { a: 'test', b: 'test' };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = parseRouteParamsSafe(requestEvent, schema) as SafeParseError<any>;
        expect(result.success).toBe(false);
        expect(result.error.issues.length).toBe(1);
        expect(result.error.issues[0].path[0]).toBe('a');
    });

    it('returns error for invalid RequestEvent using a schema', () => {
        const schema = z.object({ a: z.number({ coerce: true }), b: z.string() });
        const requestEvent = mock<RequestEvent>();
        requestEvent.params = { a: 'test', b: 'test' };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = parseRouteParamsSafe(requestEvent, schema) as SafeParseError<any>;
        expect(result.success).toBe(false);
        expect(result.error.issues.length).toBe(1);
        expect(result.error.issues[0].path[0]).toBe('a');
    });
});

describe('parseRouteParams', () => {
    it('parses route params using an object', () => {
        const schema = { a: z.number({ coerce: true }), b: z.string() };
        const routeParams = { a: '1', b: 'test' };

        expect(parseRouteParams(routeParams, schema)).toEqual({
            a: 1,
            b: 'test',
        });
    });

    it('parses route params using a schema', () => {
        const schema = z.object({ a: z.number({ coerce: true }), b: z.string() });
        const routeParams = { a: '1', b: 'test' };

        expect(parseRouteParams(routeParams, schema)).toEqual({
            a: 1,
            b: 'test',
        });
    });

    it('returns error for invalid route params using an object', () => {
        const schema = { a: z.number({ coerce: true }), b: z.string() };
        const routeParams = { a: 'test', b: 'test' };

        expect(() => parseRouteParams(routeParams, schema)).toThrow(
            expect.objectContaining({
                data: { errors: { a: ['Expected number, received nan'] } },
                status: 400,
            }),
        );
    });

    it('returns error for invalid route params using a schema', () => {
        const schema = z.object({ a: z.number({ coerce: true }), b: z.string() });
        const routeParams = { a: 'test', b: 'test' };

        expect(() => parseRouteParams(routeParams, schema)).toThrow(
            expect.objectContaining({
                data: { errors: { a: ['Expected number, received nan'] } },
                status: 400,
            }),
        );
    });

    it('parses RequestEvent using an object', () => {
        const schema = { a: z.number({ coerce: true }), b: z.string() };
        const requestEvent = mock<RequestEvent>();
        requestEvent.params = { a: '1', b: 'test' };

        expect(parseRouteParams(requestEvent, schema)).toEqual({
            a: 1,
            b: 'test',
        });
    });

    it('parses RequestEvent using a schema', () => {
        const schema = z.object({ a: z.number({ coerce: true }), b: z.string() });
        const requestEvent = mock<RequestEvent>();
        requestEvent.params = { a: '1', b: 'test' };

        expect(parseRouteParams(requestEvent, schema)).toEqual({
            a: 1,
            b: 'test',
        });
    });

    it('returns error for invalid RequestEvent using an object', () => {
        const schema = { a: z.number({ coerce: true }), b: z.string() };
        const requestEvent = mock<RequestEvent>();
        requestEvent.params = { a: 'test', b: 'test' };

        expect(() => parseRouteParams(requestEvent, schema)).toThrow(
            expect.objectContaining({
                data: { errors: { a: ['Expected number, received nan'] } },
                status: 400,
            }),
        );
    });

    it('returns error for invalid RequestEvent using a schema', () => {
        const schema = z.object({ a: z.number({ coerce: true }), b: z.string() });
        const requestEvent = mock<RequestEvent>();
        requestEvent.params = { a: 'test', b: 'test' };

        expect(() => parseRouteParams(requestEvent, schema)).toThrow(
            expect.objectContaining({
                data: { errors: { a: ['Expected number, received nan'] } },
                status: 400,
            }),
        );
    });
});

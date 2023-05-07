# Zodkit <!-- omit from toc -->

Zodkit is a collection of [Zod](https://github.com/colinhacks/zod) utilities for [SvelteKit](https://kit.svelte.dev/) actions, load functions, hooks and endpoints. It abstracts the complexity of parsing and validating `FormData`, `URLSearchParams` and `RouteParams` so they stay clean and are strongly typed. It is heavily based on [Zodix](https://github.com/rileytomasek/zodix/) by [Riley Tomasek](https://github.com/rileytomasek)

## Table of Contents <!-- omit from toc -->

- [Installing](#installing)
- [Usage](#usage)
- [Functions](#functions)
  - [`parseSearchParams`](#parsesearchparams)
  - [`parseSearchParamsSafe`](#parsesearchparamssafe)
  - [`parseFormData`](#parseformdata)
  - [`parseFormDataSafe`](#parseformdatasafe)
  - [`parseRouteParams`](#parserouteparams)
  - [`parseRouteParamsSafe`](#parserouteparamssafe)
- [Types](#types)
  - [`Schema`](#schema)
  - [`RouteParams`](#routeparams)

## Installing

Using npm:

```bash
$ npm install zodkit zod
```

Using yarn:

```bash
$ yarn add zodkit zod
```

Using pnpm:

```bash
$ pnpm add zodkit zod
```

## Usage

You can either import the `zk` object that contains all of the functions

```typescript
import { zk } from 'zodkit';
```

or import the functions seperately

```typescript
import {
    parseSearchParams,
    parseSearchParamsSafe,
    parseFormData,
    parseFormDataSafe,
    parseRouteParams,
    parseRouteParamsSafe,
} from 'zodkit';
```

## Functions

### `parseSearchParams`

`parseSearchParams(data: URLSearchParams | RequestEvent, schema: ` [`Schema`](#schema)`)`

Parses and validates `URLSearchParams`. If the parsing/validation fails a 400 error will be thrown with the errors from zod, otherwise the parsed data from the schema will be returned.

```typescript
import type { RequestHandler } from './$types.js';
import { zk } from 'zodkit';
import { z } from 'zod';

export const GET = ((event) => {
    const { myNumber } = zk.parseSearchParams(event, { myNumber: z.number({ coerce: true }) });
    return new Response(String(myNumber));
}) satisfies RequestHandler;
```

### `parseSearchParamsSafe`

`parseSearchParamsSafe(data: URLSearchParams | RequestEvent, schema: ` [`Schema`](#schema)`)`

Parses and validates `URLSearchParams` using [`.safeParse`](https://github.com/colinhacks/zod#safeparse). If the parsing/validation fails an object in the shape `{ success: false; error: ZodError; }` will be returned, otherwise an object in the shape `{ success: true; data: T; }` will be returned

```typescript
import { fail } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { zk } from 'zodkit';
import { z } from 'zod';

export const GET = ((event) => {
    const result = zk.parseSearchParamsSafe(event, { myNumber: z.number({ coerce: true }) });

    if (!result.success) {
        throw fail(400, {
            errors: result.error.flatten().fieldErrors,
        });
    }

    return new Response(String(result.data.myNumber));
}) satisfies RequestHandler;
```

### `parseFormData`

`parseFormData(data: FormData | RequestEvent, schema: ` [`Schema`](#schema)`)`

Parses and validates `FormData`. If the parsing/validation fails a 400 error will be thrown with the errors from zod, otherwise the parsed data from the schema will be returned.

```typescript
import type { RequestHandler } from './$types.js';
import { zk } from 'zodkit';
import { z } from 'zod';

export const POST = (async (event) => {
    const { myNumber } = await zk.parseFormData(event, { myNumber: z.number({ coerce: true }) });
    return new Response(String(myNumber));
}) satisfies RequestHandler;
```

### `parseFormDataSafe`

`async parseFormDataSafe(data: FormData | RequestEvent, schema: ` [`Schema`](#schema)`)`

Parses and validates `FormData` using [`.safeParse`](https://github.com/colinhacks/zod#safeparse). If the parsing/validation fails an object in the shape `{ success: false; error: ZodError; }` will be returned, otherwise an object in the shape `{ success: true; data: T; }` will be returned

```typescript
import { fail } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { zk } from 'zodkit';
import { z } from 'zod';

export const POST = (async (event) => {
    const result = await zk.parseFormDataSafe(event, { myNumber: z.number({ coerce: true }) });

    if (!result.success) {
        throw fail(400, {
            errors: result.error.flatten().fieldErrors,
        });
    }

    return new Response(String(result.data.myNumber));
}) satisfies RequestHandler;
```

### `parseRouteParams`

`parseRouteParams(data: ` [`RouteParams `](#routeparams) `| RequestEvent, schema: ` [`Schema`](#schema)`)`

Parses and validates [`RouteParams`](#routeparams) from `event.params`. If the parsing/validation fails a 400 error will be thrown with the errors from zod, otherwise the parsed data from the schema will be returned.

```typescript
import type { RequestHandler } from './$types.js';
import { zk } from 'zodkit';
import { z } from 'zod';

export const GET = ((event) => {
    const { myNumber } = zk.parseRouteParams(event, { myNumber: z.number({ coerce: true }) });
    return new Response(String(myNumber));
}) satisfies RequestHandler;
```

### `parseRouteParamsSafe`

`parseRouteParamsSafe(data: `[`RouteParams `](#routeparams)`| RequestEvent, schema: ` [`Schema`](#schema)`)`

Parses and validates [`RouteParams`](#routeparams) from `event.params` using [`.safeParse`](https://github.com/colinhacks/zod#safeparse). If the parsing/validation fails an object in the shape `{ success: false; error: ZodError; }` will be returned, otherwise an object in the shape `{ success: true; data: T; }` will be returned

```typescript
import { fail } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { zk } from 'zodkit';
import { z } from 'zod';

export const GET = ((event) => {
    const result = zk.parseRouteParamsSafe(event, { myNumber: z.number({ coerce: true }) });

    if (!result.success) {
        throw fail(400, {
            errors: result.error.flatten().fieldErrors,
        });
    }

    return new Response(String(result.data.myNumber));
}) satisfies RequestHandler;
```

## Types

### `Schema`

`Schema` is equal to `ZodTypeAny | ZodRawShape;` which allows us to pass in both a Zod schema:

```typescript
const schema: Schema = z.object({ a: z.number(), b: z.string() });
```

and regular objects

```typescript
const schema: Schema = { a: z.number(), b: z.string() };
```

### `RouteParams`

`RouteParams` is equal to `Partial<Record<string, string>>`. It is the same format that `RequestEvent.params` is.

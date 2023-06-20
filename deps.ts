// Copyright © 2023 Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

export { escapeStringRegexp } from "https://deno.land/x/escape_string_regexp@v0.0.1/mod.ts";

/** Primitive data type. */
export type Primitive = string | number | bigint | boolean | null | undefined;

/** Whether the {@link T} is `never` or not. */
export type IsNever<T> = [T] extends [never] ? true : false;

// Copyright © 2023 Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

export { escape } from "https://deno.land/std@0.192.0/regexp/mod.ts";

/** Primitive data type. */
export type Primitive = string | number | bigint | boolean | null | undefined;

/** Whether the {@link T} is `never` or not. */
export type IsNever<T> = [T] extends [never] ? true : false;

// Copyright © 2023 Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

export { escape } from "jsr:@std/regexp@^0.221.0/escape";

/** Primitive data type. */
export type Primitive = string | number | bigint | boolean | null | undefined;

/** Whether the {@link T} is `never` or not. */
export type IsNever<T> = [T] extends [never] ? true : false;

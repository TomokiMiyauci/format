// Copyright 2023-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

import { escapeStringRegexp, type IsNever, type Primitive } from "./deps.ts";

/** Placeholder API. */
export interface Placeholder {
  /** Prefix placeholder. */
  prefix: Primitive;

  /** Suffix placeholder. */
  suffix: Primitive;
}

/** Format options. */
export interface FormatOptions<T extends Placeholder = Placeholder> {
  /** List of {@link Placeholder}.
   * @default [{ prefix: "{", suffix: "}"}]
   */
  placeholders?: readonly T[];

  /** Serialize parameter.
   * @default String
   */
  stringify?: (param: unknown) => string;
}

/** Extract specifier(string that enclosed by {@link Placeholder}) from {@link T}. */
export type ExtractSpecifier<T extends string, U extends Placeholder> =
  U extends U
    ? T extends `${infer R}${U["prefix"]}${infer P}${U["suffix"]}${infer R}`
      ? P | ExtractSpecifier<R, U>
    : never
    : never;

/** Interpolate JavaScript value into format string.
 *
 * @example
 * ```ts
 * import { format } from "https://deno.land/x/format@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 *
 * assertEquals(format("{0} {name}!", { 0: "Hello", name: "Tom" }), "Hello Tom!");
 *
 * //@ts-expect-error it should provide params.0 and params.name
 * format("{0} {name}!", {});
 * ```
 */
export function format<
  const ParamKey extends string,
  const U extends Placeholder = {
    prefix: Delimiter.Prefix;
    suffix: Delimiter.Suffix;
  },
  const T extends string = string,
>(
  formatString: T,
  params: Readonly<
    Record<ParamKey & IfElse<ExtractSpecifier<T, U>, string>, unknown>
  >,
  options?: Readonly<FormatOptions<U>>,
) {
  const {
    stringify = String,
    placeholders = [{ prefix: Delimiter.Prefix, suffix: Delimiter.Suffix }],
  } = options ?? {};

  return Object
    .entries(params)
    .flatMap(entry2Replacements)
    .reduce(replaceReducer, formatString);

  /** Convert entry to list of {@link Replacement}. */
  function entry2Replacements(
    [key, value]: readonly [key: string, value: unknown],
  ): Replacement[] {
    const repr = stringify(value);

    return placeholders
      .map(stringifyPlaceholder)
      .map(escapeStringRegexp)
      .map(createGlobalRegexp)
      .map(pattern2Replacement);

    /** Serialize {@link Placeholder} into string. */
    function stringifyPlaceholder(
      { prefix, suffix }: Readonly<Placeholder>,
    ): string {
      return `${prefix}${key}${suffix}`;
    }

    /** Create {@link Replacement} from pattern. */
    function pattern2Replacement(pattern: Readonly<RegExp>): Replacement {
      return { pattern, alt: repr };
    }
  }
}

/** Default delimiter. */
const enum Delimiter {
  Prefix = "{",
  Suffix = "}",
}

/** Replacement API. */
interface Replacement {
  /** Replacement pattern. */
  pattern: RegExp | string;

  /** Alternative string. */
  alt: string;
}

/** Create regexp with global flag. */
export function createGlobalRegexp(pattern: string | RegExp): RegExp {
  return new RegExp(pattern, "g");
}

/** Reducer for replace with {@link Replacement} API. */
export function replaceReducer(
  acc: string,
  replacement: Replacement,
): string {
  return acc.replace(replacement.pattern, replacement.alt);
}

/** If {@link T} is `never`, {@link U} otherwise; {@link T}. */
type IfElse<T, U> = IsNever<T> extends true ? U : T;

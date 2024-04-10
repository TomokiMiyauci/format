// Copyright © 2023 Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

import { escape, type IsNever, type Primitive } from "./deps.ts";

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
 * import { format } from "@miyauci/format";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(format("{0} {name}!", { 0: "Hello", name: "Tom" }), "Hello Tom!");
 *
 * //@ts-expect-error it should provide params.0 and params.name
 * format("{0} {name}!", {});
 * ```
 */
export function format<
  const ParamKey extends string = never,
  const U extends Placeholder = {
    prefix: Delimiter.Prefix;
    suffix: Delimiter.Suffix;
  },
  const T extends string = string,
>(
  formatString: T,
  params: Readonly<
    Record<
      IsNever<ParamKey> extends true ? ExtractSpecifier<T, U> : ParamKey,
      unknown
    >
  >,
  options?: Readonly<FormatOptions<U>>,
): string {
  const {
    stringify = String,
    placeholders = [{ prefix: Delimiter.Prefix, suffix: Delimiter.Suffix }],
  } = options ?? {};

  const patterns = placeholders
    .map(_Placeholder.stringify)
    .map(_Placeholder.escape)
    .map(_Placeholder.represent)
    .map(createGlobalRegexp);

  /** Replacer for interpolate {@link params}. */
  function replacer(placeholder: string, specifier: string): string {
    if (specifier in params) {
      const param = (params as Record<typeof specifier, unknown>)[specifier];

      return stringify(param);
    }

    return placeholder;
  }

  /** Reducer for replace with {@link replacer}. */
  function replaceReducer(input: string, pattern: string | RegExp): string {
    return input.replace(pattern, replacer);
  }

  return patterns.reduce(replaceReducer, formatString);
}

/** Default delimiter. */
const enum Delimiter {
  Prefix = "{",
  Suffix = "}",
}

/** Create regexp with global flag. */
export function createGlobalRegexp(pattern: string | RegExp): RegExp {
  return new RegExp(pattern, "g");
}

class _Placeholder {
  /** Convert to {@link SPlaceholder}. */
  static stringify(placeholder: Placeholder): SPlaceholder {
    return {
      prefix: `${placeholder.prefix}`,
      suffix: `${placeholder.suffix}`,
    };
  }

  /** Return escaped {@link SPlaceholder}. */
  static escape(placeholder: SPlaceholder): SPlaceholder {
    return {
      prefix: escape(placeholder.prefix),
      suffix: escape(placeholder.suffix),
    };
  }

  /** Return pattern of placeholder. */
  static represent(placeholder: Placeholder): string {
    return `${placeholder.prefix}(.*?)${placeholder.suffix}`;
  }
}

type SPlaceholder = Record<keyof Placeholder, string>;

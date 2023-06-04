// Copyright 2023-latest Tomoki Miyauchi. All rights reserved. MIT license.

import {
  createGlobalRegexp,
  type ExtractSpecifier,
  format,
  replaceReducer,
} from "./format.ts";
import {
  assertEquals,
  assertType,
  describe,
  IsExact,
  it,
} from "./_dev_deps.ts";

describe("format", () => {
  it("should replace object literal style", () => {
    assertEquals(
      format("{0} {name}!", { 0: "Hello", name: "Tom" }),
      "Hello Tom!",
    );

    //@ts-expect-error it should provide params.0 and params.name
    format("{0} {name}!", {});
  });

  it("should replace array style", () => {
    assertEquals(
      format("{0} {1} {2}", [1, 2, 3]),
      "1 2 3",
    );

    //@ts-expect-error it should provide params
    format("{0} {1} {2}", []);
  });

  it("should change placeholder to percent style", () => {
    const result = format("Hello %s!!!", { "": "world" }, {
      placeholders: [{ prefix: "%", suffix: "s" }],
    });
    assertEquals(result, "Hello world!!!");
  });

  it("should change placeholder to template literal style", () => {
    const result = format("should be ${expected}, actual ${actual}", {
      expected: "string",
      actual: "number",
    }, { placeholders: [{ prefix: "${", suffix: "}" }] });
    assertEquals(result, "should be string, actual number");

    //@ts-expect-error it should be error
    format("should be ${expected}, actual ${actual}", {}, {
      placeholders: [{ prefix: "${", suffix: "}" }],
    });
  });

  it("should change multiple placeholder", () => {
    const result = format("a[bcd]e{fg}{{ij}}[[]]{{{}}}", {
      "bcd": "bcd",
      "[": "k",
      ij: "ij",
      "{": "a",
    }, {
      placeholders: [
        { prefix: "{{", suffix: "}}" },
        { prefix: "[", suffix: "]" },
      ],
    });
    assertEquals(result, "abcde{fg}ijk]a}");

    // @ts-expect-error it should be error if params is lack
    format("a[bcd]e{fg}{{ij}}[[]]{{{}}}", {}, {
      placeholders: [
        { prefix: "{{", suffix: "}}" },
        { prefix: "[", suffix: "]" },
      ],
    });
  });

  it("should change unclear placeholder", () => {
    const result = format("{fg}{{ij}}{{{}}}", {
      fg: "{fg}",
      ij: "ij",
      "{": "{",
      "{ij": "{ij",
      "{{": "{{",
    }, {
      placeholders: [
        { prefix: "{", suffix: "}" },
        { prefix: "{{", suffix: "}}" },
      ],
    });
    assertEquals(result, "{fg}{ij}{{}}");
  });

  it("should change serialization", () => {
    const result = format("{0}{1}{2}", ["1", 1, true], {
      stringify: (param) => {
        if (typeof param === "string") return `"${param}"`;

        return String(param);
      },
    });
    assertEquals(result, `"1"1true`);
  });
});

describe("ExtractSpecifier", () => {
  it("should return parsed types", () => {
    assertType<
      IsExact<ExtractSpecifier<"{a}", { prefix: "{"; suffix: "}" }>, "a">
    >(true);
    assertType<
      IsExact<ExtractSpecifier<"abc{a}123", { prefix: "{"; suffix: "}" }>, "a">
    >(true);
    assertType<
      IsExact<
        ExtractSpecifier<"{a}{b}{c}{0}{1}{2}", { prefix: "{"; suffix: "}" }>,
        "a" | "b" | "c" | "0" | "1" | "2"
      >
    >(true);

    assertType<
      IsExact<
        ExtractSpecifier<"{abc", { prefix: "{"; suffix: "" }>,
        "a"
      >
    >(true);

    assertType<
      IsExact<
        ExtractSpecifier<"ab%scc", { prefix: "%"; suffix: "" }>,
        "s"
      >
    >(true);

    assertType<
      IsExact<
        ExtractSpecifier<"abc}", { prefix: ""; suffix: "}" }>,
        "bc"
      >
    >(true);

    assertType<
      IsExact<
        ExtractSpecifier<
          "{0}[1]",
          { prefix: "{"; suffix: "}" } | { prefix: "["; suffix: "]" }
        >,
        "0" | "1"
      >
    >(true);

    assertType<
      IsExact<
        ExtractSpecifier<
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa{aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa}aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa{a}aaaaaaaaaa{b}aaaaaaaaaaaa",
          { prefix: "{"; suffix: "}" }
        >,
        | "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        | "a"
        | "b"
      >
    >(true);
  });

  it("should infer never", () => {
    assertType<
      IsExact<ExtractSpecifier<"a", { prefix: "{"; suffix: "}" }>, never>
    >(true);

    assertType<
      IsExact<ExtractSpecifier<"{a]", { prefix: "{"; suffix: "}" }>, never>
    >(true);
  });
});

describe("createGlobalRegexp", () => {
  it("should return regexp with global flag", () => {
    assertEquals(createGlobalRegexp(/a/), /a/g);
    assertEquals(createGlobalRegexp(/a/ig), /a/g);
  });
});

describe("replaceReducer", () => {
  it("should replaced value", () => {
    assertEquals(
      replaceReducer("abcde", { pattern: "bcd", alt: "bbccdd" }),
      "abbccdde",
    );
  });
});

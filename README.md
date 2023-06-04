# format

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno)](https://deno.land/x/format)
[![deno doc](https://doc.deno.land/badge.svg)](https://deno.land/x/format/mod.ts)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/TomokiMiyauci/format)](https://github.com/TomokiMiyauci/format/releases)
[![codecov](https://codecov.io/github/TomokiMiyauci/format/branch/main/graph/badge.svg)](https://codecov.io/gh/TomokiMiyauci/format)
[![GitHub](https://img.shields.io/github/license/TomokiMiyauci/format)](https://github.com/TomokiMiyauci/format/blob/main/LICENSE)

[![test](https://github.com/TomokiMiyauci/format/actions/workflows/test.yaml/badge.svg)](https://github.com/TomokiMiyauci/format/actions/workflows/test.yaml)
[![NPM](https://nodei.co/npm/@miyauci/format.png?mini=true)](https://nodei.co/npm/@miyauci/format/)

Formatting and printing string utilities.

## Features

- No parsing
- No runtime error
- Type safety
- Single responsibility
- Minimum

## Why

The purpose of this project is to provide minimum replacement formatting
function.

Existing formatting solutions offer multiple features.

The Deno community already has
[std/fmt::sprintf](https://deno.land/std/fmt/printf.ts?doc=&s=sprintf). There
are also various other 3rd party libraries.

These could accomplish a lot of work. On the other hand, they are somewhat
over-specified. You have to pay more cost than you need to. (cost here refers to
code size and execution speed).

We decompose formatting into replacement and serialization. Then, focus on
replacement.

## Usage

Type inference works well for template literal.

```ts
import { format } from "https://deno.land/x/format@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

assertEquals(format("{0} {name}!", { 0: "Hello", name: "Tom" }), "Hello Tom!");

//@ts-expect-error it should provide params.0 and params.name
format("{0} {name}!", {});
```

If the specifier is numeric only, you can specify an array as an parameters.

```ts
import { format } from "https://deno.land/x/format@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

assertEquals(format("{0} world!", ["Hello"]), "Hello world!");

//@ts-expect-error it should provide params.0
format("{0} world!", []);
```

### Placeholder

Placeholder is a pair of prefix and suffix.

| Name   | Default |
| ------ | ------- |
| prefix | `{`     |
| suffix | `}`     |

This can be changed.

Template literal style:

```ts
import { format } from "https://deno.land/x/format@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const result = format("should be ${expected}, actual ${actual}", {
  expected: "string",
  actual: "number",
}, { placeholders: [{ prefix: "${", suffix: "}" }] });
assertEquals(result, "should be string, actual number");

//@ts-expect-error it should be error
format("should be ${expected}, actual ${actual}", {}, {
  placeholders: [{ prefix: "${", suffix: "}" }],
});
```

Percent style:

```ts
import { format } from "https://deno.land/x/format@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const result = format("Hello %s!!!", { "": "world" }, {
  placeholders: [{ prefix: "%", suffix: "s" }],
});
assertEquals(result, "Hello world!!!");
```

Multiple placeholders:

```ts
import { format } from "https://deno.land/x/format@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const result = format("[0] {name}: {title}", {
  0: new Date("2038/1/1"),
  name: "",
  title: "",
}, {
  placeholders: [
    { prefix: "{", suffix: "}" },
    { prefix: "[", suffix: "]" },
  ],
});
assertEquals(result, "abcde{fg}ijk]a}");
```

The computational complexity of placeholder is O(n) compared to parameters. It
is recommended to reduce the number of placeholders as much as possible.

### Custom serialization

Argument serialization uses the `String` constructor by default.

To change this, specify the `stringify` option.

```ts
import { format } from "https://deno.land/x/format@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

const result = format("{0}{1}{2}", ["1", 1, true], {
  stringify: (param) => {
    if (typeof param === "string") return `"${param}"`;

    return String(param);
  },
});
assertEquals(result, `"1"1true`);
```

### Override type inference

In certain circumstances, template literal types cannot be provided. In such
cases, generics can be specified.

```ts
import { format } from "https://deno.land/x/format@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

declare const string: string;
//@ts-expect-error it should provide params.name and params.title
format<"name" | "title">(string, {});
```

## API

See [deno doc](https://deno.land/x/format/mod.ts) for all APIs.

## License

Copyright © 2023-present [Tomoki Miyauci](https://github.com/TomokiMiyauci).

Released under the [MIT](./LICENSE) license

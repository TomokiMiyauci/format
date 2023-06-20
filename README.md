# format

[![deno land](http://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno)](https://deno.land/x/format)
[![deno doc](https://doc.deno.land/badge.svg)](https://deno.land/x/format/mod.ts)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/TomokiMiyauci/format)](https://github.com/TomokiMiyauci/format/releases)
[![codecov](https://codecov.io/github/TomokiMiyauci/format/branch/main/graph/badge.svg)](https://codecov.io/gh/TomokiMiyauci/format)
[![GitHub](https://img.shields.io/github/license/TomokiMiyauci/format)](https://github.com/TomokiMiyauci/format/blob/main/LICENSE)

[![test](https://github.com/TomokiMiyauci/format/actions/workflows/test.yaml/badge.svg)](https://github.com/TomokiMiyauci/format/actions/workflows/test.yaml)
[![NPM](https://nodei.co/npm/@miyauci/format.png?mini=true)](https://nodei.co/npm/@miyauci/format/)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg)](https://github.com/RichardLitt/standard-readme)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

Formatting and printing string utilities.

## Table of Contents <!-- omit in toc -->

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
  - [Placeholder](#placeholder)
  - [Custom serialization](#custom-serialization)
  - [Override type inference](#override-type-inference)
  - [No throwing error](#no-throwing-error)
- [Performance](#performance)
  - [Bundle size](#bundle-size)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)

## Background

The purpose of this project is to provide minimum replacement formatting
solution.

Existing formatting solutions offer multiple features.

The Deno community already has
[std/fmt::sprintf](https://deno.land/std/fmt/printf.ts?doc=&s=sprintf). There
are also various other 3rd party libraries.

These could accomplish a lot of work. On the other hand, they are somewhat
over-specified. You have to pay more cost than you need to. (cost here refers to
code size and execution speed).

We decompose formatting into replacement and serialization. Then, focus on
replacement.

## Install

deno.land:

```ts
import * as mod from "https://deno.land/x/format@$VERSION/mod.ts";
```

npm:

```bash
npm i @miyauci/format
```

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

const result = format("[0] {description}", {
  0: new Date("2038/1/19 03:14:08"),
  description: "Time stopped",
}, {
  placeholders: [
    { prefix: "{", suffix: "}" },
    { prefix: "[", suffix: "]" },
  ],
});
assertEquals(result, "<Date::toString> Time stopped");
```

The computational complexity of placeholder is O(n) compared to parameters. It
is recommended to reduce the number of placeholders as much as possible.

### Custom serialization

Parameter serialization uses the `String` constructor by default.

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

### No throwing error

`format` does not throw an error. Even if a parameter is missing.

If type inference is working, there will never be a missing parameter.
Therefore, no parameter checking is done at runtime.

The following is valid.

```ts
import { format } from "https://deno.land/x/format@$VERSION/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

assertEquals(format<"0">("{0}{1}", ["false"]), "false{1}");
```

If you specify [generics](#override-type-inference), you must guarantee the
parameters.

This also allows you to escape placeholder.

## Performance

Performance indicators shall be the following items:

- bundle size

Note that these are all guidelines as they do not provide the same
functionality.

### Bundle size

| Name                        | Size                                                                                                                                                                                                                                     |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `format`                    | [![format:format](https://deno.bundlejs.com/?q=https://deno.land/x/format@1.0.0/mod.ts&treeshake=[{+format+}]&badge=)](https://bundlejs.com/?q=https%3A%2F%2Fdeno.land%2Fx%2Fformat@1.0.0%2Fmod.ts&treeshake=%5B%7B+format+%7D%5D)       |
| `std/fmt/print.ts::sprintf` | [![std/fmt/print.ts::sprintf](https://deno.bundlejs.com/?q=https://deno.land/std/fmt/printf.ts&treeshake=[{+sprintf+}]&badge=)](https://bundlejs.com/?q=https%3A%2F%2Fdeno.land%2Fstd%2Ffmt%2Fprintf.ts&treeshake=%5B%7B+sprintf+%7D%5D) |

## API

See [deno doc](https://deno.land/x/format/mod.ts) for all APIs.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

[MIT](LICENSE) © 2023 Tomoki Miyauchi

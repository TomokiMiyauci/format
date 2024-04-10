# Performance

Performance indicators shall be the follows:

Note that these are all guidelines as they do not provide the same
functionality.

## Benchmark

You can try the benchmark:

```bash
deno bench
```

Snapshot:

```bash
cpu: Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz
runtime: deno 1.42.1 (x86_64-apple-darwin)

file:///Users/tomoki/Projects/format/format_bench.ts
benchmark                     time (avg)        iter/s             (min … max)       p75       p99      p995
------------------------------------------------------------------------------ -----------------------------

group multiple parameter with long string
format@latest                  2.17 µs/iter     460,296.1     (2.04 µs … 3.13 µs) 2.16 µs 3.13 µs 3.13 µs
std@0.221.0/fmt::sprintf       9.06 µs/iter     110,363.1   (7.81 µs … 338.19 µs) 8.42 µs 23.19 µs 38.42 µs

summary
  format@latest
   4.17x faster than std@0.221.0/fmt::sprintf
```

## Bundle size

| Name                        | Size                                                                                                                                                                                                                                     |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `format`                    | [![format:format](https://deno.bundlejs.com/?q=https://deno.land/x/format@1.0.0/mod.ts&treeshake=[{+format+}]&badge=)](https://bundlejs.com/?q=https%3A%2F%2Fdeno.land%2Fx%2Fformat@1.0.0%2Fmod.ts&treeshake=%5B%7B+format+%7D%5D)       |
| `std/fmt/print.ts::sprintf` | [![std/fmt/print.ts::sprintf](https://deno.bundlejs.com/?q=https://deno.land/std/fmt/printf.ts&treeshake=[{+sprintf+}]&badge=)](https://bundlejs.com/?q=https%3A%2F%2Fdeno.land%2Fstd%2Ffmt%2Fprintf.ts&treeshake=%5B%7B+sprintf+%7D%5D) |

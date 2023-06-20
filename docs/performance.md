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
runtime: deno 1.34.3 (x86_64-apple-darwin)

benchmark                     time (avg)             (min … max)       p75       p99      p995
---------------------------------------------------------------- -----------------------------
format@latest                  2.21 µs/iter        (2 µs … 3.16 µs)   2.27 µs   3.16 µs   3.16 µs
std@0.190.0/fmt::sprintf       9.33 µs/iter   (7.62 µs … 261.12 µs)   8.45 µs  28.46 µs  53.34 µs

summary
  format@latest
   4.23x faster than std@0.190.0/fmt::sprintf
```

## Bundle size

| Name                        | Size                                                                                                                                                                                                                                     |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `format`                    | [![format:format](https://deno.bundlejs.com/?q=https://deno.land/x/format@1.0.0/mod.ts&treeshake=[{+format+}]&badge=)](https://bundlejs.com/?q=https%3A%2F%2Fdeno.land%2Fx%2Fformat@1.0.0%2Fmod.ts&treeshake=%5B%7B+format+%7D%5D)       |
| `std/fmt/print.ts::sprintf` | [![std/fmt/print.ts::sprintf](https://deno.bundlejs.com/?q=https://deno.land/std/fmt/printf.ts&treeshake=[{+sprintf+}]&badge=)](https://bundlejs.com/?q=https%3A%2F%2Fdeno.land%2Fstd%2Ffmt%2Fprintf.ts&treeshake=%5B%7B+sprintf+%7D%5D) |

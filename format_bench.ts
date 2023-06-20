import { format } from "./mod.ts";
import { sprintf } from "https://deno.land/std@0.190.0/fmt/printf.ts";

Deno.bench(
  "format@latest",
  { baseline: true, group: "single parameter with long string" },
  () => {
    format(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa{0}",
      ["b"],
    );
  },
);

Deno.bench("std@0.190.0/fmt::springf", {
  group: "single parameter with long string",
}, () => {
  sprintf(
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa%s",
    "b",
  );
});

Deno.bench(
  "format@latest",
  { baseline: true, group: "multiple params with short string format" },
  () => {
    format(
      "{0}{1}{2}{3}",
      [0, 1, 2, 3],
    );
  },
);

Deno.bench("std@0.190.0/fmt::springf", {
  group: "multiple params with short string format",
}, () => {
  sprintf(
    "%d%d%d%d",
    0,
    1,
    2,
    3,
  );
});

import { format } from "./mod.ts";
import { sprintf } from "https://deno.land/std@0.190.0/fmt/printf.ts";

Deno.bench(
  "format@latest",
  { baseline: true, group: "long string" },
  () => {
    format(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa{0}",
      ["b"],
    );
  },
);

Deno.bench("std@0.190.0/fmt::springf", { group: "long string" }, () => {
  sprintf(
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa%s",
    "b",
  );
});

// Copyright © 2023 Tomoki Miyauchi. All rights reserved. MIT license.

import { format } from "./mod.ts";
import { assertEquals, sprintf } from "./_dev_deps.ts";

const enum Template {
  This =
    "{lorem} ipsum dolor sit amet, consectetur adipiscing elit, sed {do} eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  Std =
    "%s ipsum dolor sit amet, consectetur adipiscing elit, sed %s eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
}

const EXPECTED =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const group = "multiple parameter with long string";

Deno.bench(
  "format@latest",
  { baseline: true, group },
  () => {
    assertEquals(
      format(
        Template.This,
        { lorem: "Lorem", do: "do" },
      ),
      EXPECTED,
    );
  },
);

Deno.bench("std@0.190.0/fmt::sprintf", { group }, () => {
  assertEquals(
    sprintf(
      Template.Std,
      "Lorem",
      "do",
    ),
    EXPECTED,
  );
});

import { BuildOptions } from "https://deno.land/x/dnt@0.34.0/mod.ts";

export const makeOptions = (version: string): BuildOptions => ({
  test: false,
  shims: {},
  typeCheck: true,
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  package: {
    name: "@miyauci/format",
    version,
    description: "Formatting and printing string utilities",
    keywords: [
      "format",
      "fmt",
      "formatter",
      "print",
      "sprintf",
      "format-string",
      "replace",
      "replacement",
      "template",
      "interpolate",
    ],
    license: "MIT",
    homepage: "https://github.com/TomokiMiyauci/format",
    repository: {
      type: "git",
      url: "git+https://github.com/TomokiMiyauci/format.git",
    },
    bugs: {
      url: "https://github.com/TomokiMiyauci/format/issues",
    },
    sideEffects: false,
    type: "module",
    publishConfig: {
      access: "public",
    },
  },
  packageManager: "pnpm",
});

import { defineConfig } from "tsup"

export default defineConfig({
    clean: true,
    dts: false,
    entry: ["src/http.ts", "src/stdio.ts"],
    external: ["@phylopic/api-models", "@phylopic/utils"],
    format: ["esm"],
    platform: "node",
    sourcemap: true,
    target: "node24",
})

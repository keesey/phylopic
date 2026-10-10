import { defineConfig } from "tsup"

export default defineConfig({
    clean: true,
    dts: false,
    entry: ["src/http.ts", "src/stdio.ts"],
    external: ["@phylopic/api-models", "@phylopic/search", "@phylopic/utils", "@phylopic/utils-api"],
    format: ["esm"],
    platform: "node",
    sourcemap: true,
    target: "node24",
})

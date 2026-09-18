import { defineConfig } from "tsup"
export default defineConfig({
    clean: true,
    dts: true,
    entry: ["src/index.ts"],
    external: [
        "@phylopic/api-models",
        "@phylopic/utils",
        "@types/react",
        "axios",
        "react",
        "react/jsx-runtime",
        "swr",
        "swr/immutable",
        "swr/infinite",
    ],
    format: ["cjs", "esm"],
    sourcemap: true,
    splitting: true,
    target: "esnext",
})

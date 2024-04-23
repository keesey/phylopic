import { defineConfig } from "tsup"
export default defineConfig({
    clean: true,
    dts: true,
    entry: ["src/index.ts"],
    external: [
        "@phylopic/api-models",
        "@phylopic/utils",
        "@phylopic/utils-api",
        "@types/react",
        "next",
        "next/image",
        "next/link",
        "next/router",
        "next/script",
        "parse-nomen",
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
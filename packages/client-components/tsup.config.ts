import { defineConfig } from "tsup"
export default defineConfig({
    clean: true,
    dts: true,
    entry: ["src/index.ts"],
    esbuildOptions(options) {
        options.banner = {
            js: '"use client"',
        }
    },
    external: [
        "@phylopic/api-models",
        "@phylopic/utils",
        "@phylopic/utils-api",
        "@types/react",
        "axios",
        "clsx",
        "flux-standard-action",
        "next",
        "next/image",
        "next/link",
        "next/router",
        "next/script",
        "parse-nomen",
        "react",
        "react/jsx-runtime",
        "react-spinners",
        "react-spinners/helpers/props",
        "swr",
        "swr/immutable",
        "swr/infinite",
    ],
    format: ["cjs", "esm"],
    sourcemap: true,
    splitting: true,
    target: "esnext",
})

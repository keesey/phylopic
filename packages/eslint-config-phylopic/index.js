module.exports = {
    extends: ["next", "prettier"],
    overrides: [
        {
            files: ["**/*.ts", "**/*.tsx"],
            plugins: ["@typescript-eslint"],
            rules: {
                "@typescript-eslint/consistent-type-imports": [
                    "error",
                    {
                        fixStyle: "inline-type-imports",
                        prefer: "type-imports",
                    },
                ],
            },
        },
    ],
}

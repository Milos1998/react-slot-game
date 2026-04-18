import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";
import prettier from "eslint-plugin-prettier";

export default defineConfig([
    js.configs.recommended,
    tseslint.configs.recommended,
    {
        files: ["**/*.{js,mjs,cjs,ts}"],
        languageOptions: {
            globals: globals.browser,
        },
    },
    {
        files: ["**/*.css"],
        plugins: { css },
        language: "css/css",
    },
    {
        rules: {
            "@typescript-eslint/no-unused-vars": "warn",
            "require-yield": "off",
            curly: "error",
            "prettier/prettier": "error",
            "@typescript-eslint/no-explicit-any": "off",
            "no-unused-vars": "off",
            "prefer-const": "warn",
        },
    },
    {
        plugins: {
            prettier,
        },
    },
    {
        ignores: [".vscode", "assets", "node_modules", "dist", "docs", "webpack.config.js"],
    },
]);

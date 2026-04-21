import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default defineConfig([
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
        plugins: {
            react,
            "react-hooks": reactHooks,
        },
        languageOptions: {
            globals: globals.browser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
    },
    {
        settings: {
            react: {
                version: "detect",
            },
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
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
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

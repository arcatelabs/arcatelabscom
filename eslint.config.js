import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default [
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
  {
    ignores: ["dist/", ".vercel/", ".astro/", "node_modules/", "src/env.d.ts"],
  },
];

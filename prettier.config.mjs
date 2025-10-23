/** @type {import('prettier').Config} */
const config = {
  semi: true,
  singleQuote: false,
  trailingComma: "none",
  tabWidth: 2,
  printWidth: 90,
  plugins: ["prettier-plugin-tailwindcss"]
};

export default config;

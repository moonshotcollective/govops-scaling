module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["airbnb-base", "plugin:prettier/recommended"],
  plugins: ["@babel"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {},
};

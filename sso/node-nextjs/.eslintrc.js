// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    semi: [
      2,
      'always'
    ],
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-key": "off"
  }
};

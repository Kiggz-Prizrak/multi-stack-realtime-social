module.exports = {
  env: {
    node: true,
    es2021: true,
  },

  extends: ['airbnb-base', 'plugin:prettier/recommended'],

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'script', // Node.js backend
  },

  rules: {
    // 🔕 Laisser Prettier gérer le formatage
    'linebreak-style': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'lf',
      },
    ],

    // 🧠 Règles pratiques backend
    'no-console': 'off', // logs serveur OK
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
    'consistent-return': 'off',

    // 💡 Imports (Sequelize, Node)
    'import/no-extraneous-dependencies': 'off',
  },
};

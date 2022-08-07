module.exports = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "project": [
      "./tsconfig.json"
    ]
  },
  "plugins": [
    "@typescript-eslint",
    "import"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict"
  ],
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "rules": {
    // eslint
    "interface-over-type-literal": "off",
    "no-constructor-return": "error",
    "no-duplicate-imports": "warn",
    "no-promise-executor-return": "error",
    "no-self-compare": "warn",
    "no-template-curly-in-string": "warn",
    "no-unused-private-class-members": "warn",
    "require-atomic-updates": "error",
    "camelcase": "warn",
    "consistent-return": "warn",
    "curly": [
      "warn",
      "multi-or-nest",
      "consistent"
    ],
    "default-case": "warn",
    "default-case-last": "warn",
    "default-param-last": "warn",
    "eqeqeq": "error",
    "func-name-matching": "warn",
    "grouped-accessor-pairs": [
      "warn",
      "getBeforeSet"
    ],
    "guard-for-in": "error",
    "no-alert": "error",
    "no-array-constructor": "error",
    "no-console": "warn",
    "no-else-return": "warn",
    "no-eq-null": "error",
    "no-floating-decimal": "warn",
    "no-negated-condition": "error",
    "no-nested-ternary": "error",
    "no-return-assign": "error",
    "no-return-await": "warn",
    "no-throw-literal": "error",
    "no-var": "error",
    "prefer-arrow-callback": "warn",
    "prefer-const": "warn",
    "radix": "error",
    "require-await": "error",
    "sort-imports": "off", // use import/order
    "arrow-body-style": [
      "warn",
      "as-needed"
    ],
    "array-bracket-newline": [
      "warn",
      "consistent"
    ],
    "array-bracket-spacing": [
      "warn",
      "always"
    ],
    "array-element-newline": [
      "warn",
      "consistent"
    ],
    "arrow-parens": "warn",
    "arrow-spacing": "warn",
    "block-spacing": "warn",
    "brace-style": [
      "error",
      "1tbs",
      {
        "allowSingleLine": false
      }
    ],
    "comma-dangle": [
      "warn",
      {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "imports": "never",
        "exports": "never",
        "functions": "never"
      }
    ],
    "comma-spacing": "warn",
    "comma-style": "warn",
    "computed-property-spacing": [
      "warn",
      "never"
    ],
    "dot-location": [
      "warn",
      "property"
    ],
    "eol-last": [
      "warn",
      "always"
    ],
    "func-call-spacing": "warn",
    "implicit-arrow-linebreak": [
      "warn",
      "beside"
    ],
    "indent": [
      "warn",
      2,
      {
        "SwitchCase": 1,
        "FunctionExpression": {
          "parameters": "first"
        },
        "FunctionDeclaration": {
          "parameters": "first"
        },
        "CallExpression": {
          "arguments": "first"
        }
      }
    ],
    "jsx-quotes": [
      "error",
      "prefer-single"
    ],
    "key-spacing": [
      "warn",
      {
        "singleLine": {
          "beforeColon": false,
          "afterColon": true
        },
        "multiLine": {
          "beforeColon": true,
          "afterColon": true,
          "align": "colon"
        }
      }
    ],
    "keyword-spacing": "warn",
    "linebreak-style": [
      "error",
      "unix"
    ],
    "new-parens": "error",
    "no-extra-parens": "warn",
    "no-multiple-empty-lines": [
      "warn",
      {
        "max": 1
      }
    ],
    "no-tabs": "warn",
    "no-trailing-spaces": "warn",
    "nonblock-statement-body-position": "error",
    "object-curly-newline": [
      "warn",
      {
        "consistent": true
      }
    ],
    "object-curly-spacing": [
      "warn",
      "always"
    ],
    "operator-linebreak": [
      "warn",
      "after"
    ],
    "padded-blocks": [
      "warn",
      "never"
    ],
    "quotes": [
      "warn",
      "single"
    ],
    "rest-spread-spacing": [
      "warn",
      "never"
    ],
    "semi": "warn",
    "semi-spacing": "warn",
    "space-before-blocks": "warn",
    "space-before-function-paren": [
      "warn",
      {
        "anonymous": "never",
        "named": "never",
        "asyncArrow": "always"
      }
    ],
    "space-in-parens": "warn",
    "space-infix-ops": "warn",
    "space-unary-ops": "warn",
    "switch-colon-spacing": "warn",
    "template-curly-spacing": "warn",
    "template-tag-spacing": "warn",
    // @typescript-eslint
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/prefer-ts-expect-error": "off",
    "@typescript-eslint/consistent-type-definitions": [
      "warn",
      "type"
    ],
    "@typescript-eslint/explicit-function-return-type": [
      "warn"
    ],
    "@typescript-eslint/member-delimiter-style": [
      "warn",
      {
        "multiline": {
          "delimiter": "semi",
          "requireLast": true
        },
        "singleline": {
          "delimiter": "semi",
          "requireLast": true
        }
      }
    ],
    "@typescript-eslint/member-ordering": "warn",
    "@typescript-eslint/method-signature-style": [
      "warn",
      "property"
    ],
    "@typescript-eslint/naming-convention": [
      "warn",
      {
        "selector": "default",
        "format": [
          "camelCase"
        ],
        "filter": {
          "regex": ".*(Component|Plugin)",
          "match": false
        },
        "leadingUnderscore": "allow",
        "trailingUnderscore": "allow"
      },
      {
        "selector": "variable",
        "format": [
          "camelCase",
          "UPPER_CASE"
        ],
        "filter": {
          "regex": ".*Component",
          "match": false
        },
        "leadingUnderscore": "allow",
        "trailingUnderscore": "allow"
      },
      {
        "selector": "typeLike",
        "format": [
          "PascalCase"
        ]
      }
    ],
    "@typescript-eslint/no-confusing-void-expression": "warn",
    "@typescript-eslint/no-implicit-any-catch": "warn",
    "@typescript-eslint/no-invalid-void-type": "off",
    "@typescript-eslint/prefer-readonly": "warn",
    // import
    "import/no-self-import": "error",
    "import/no-cycle": "error",
    "import/first": "error",
    "import/exports-last": "error",
    "import/order": [
      "error",
      {
        "newlines-between": "always-and-inside-groups",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        },
        "warnOnUnassignedImports": true
      }
    ],
    "import/newline-after-import": "warn"
  }
}

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'refact',
        'style',
        'docs',
        'test',
        'chore',
        'perf',
        'settings',
      ],
    ],
    'header-max-length': [2, 'always', 100],
    'subject-empty': [2, 'never'],
  },
};

/** 提交信息规范：Conventional Commits，scope 限定为包名 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'],
    ],
    'scope-enum': [
      2,
      'always',
      ['demo', 'core', 'ui', 'server', 'eslint-config', 'app'],
    ],
    'scope-empty': [0],
    'subject-case': [0],
  },
}

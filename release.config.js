export default {
  branches: ['master'],
  repositoryUrl: 'https://github.com/sunset-z/sroll-ts-demo.git',
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        releaseRules: [
          { type: 'feat', release: 'minor' },
          { type: 'fix', release: 'patch' },
          { type: 'docs', release: 'patch' },
          { type: 'style', release: 'patch' },
          { type: 'perf', release: 'patch' },
          { type: 'refactor', release: 'patch' },
          { type: 'test', release: 'patch' },
          { type: 'build', release: 'patch' },
          { type: 'ci', release: 'patch' },
          { type: 'chore', release: 'patch' },
          { type: 'revert', release: 'patch' },
          { type: 'del', release: 'patch' },
          { scope: 'no-release', release: false },
        ],
      },
    ],
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        // 更改 package.json 的 version
        npmPublish: false, // 这里禁用 npm 发布
      },
    ],
    [
      '@semantic-release/exec',
      {
        verifyReleaseCmd: 'echo "Verifying release version ${nextRelease.version}"',
        prepareCmd: 'npm run build:npm', // 构建产物
        publishCmd: 'npm run release', // 打包、发布一体
      },
    ],
    '@semantic-release/github',
    [
      '@semantic-release/git',
      {
        // assets: ['dist/**/*', 'package.json', 'CHANGELOG.md'], // 这里会跟根目录一同打包
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};

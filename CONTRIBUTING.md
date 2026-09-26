# 贡献指南

> 本指南适用于 OpenContiNew 社区旗下的 ContiNew 系列项目（ContiNew Admin / ContiNew Starter / ContiNew App 等），社区各项目通用。

感谢您对 ContiNew 开源项目的关注！无论是修复一个错别字、报告一个 Bug，还是实现一个新功能，每一份贡献都很有价值。

ContiNew（Continue New）系列项目致力于通过持续迭代，为开发者提供舒适的开发体验。我们的初衷是希望通过开源协作模式，提升技术透明度、放大集体智慧、共创优秀实践，源源不断地为企业级项目开发提供助力。除代码之外，我们同样重视文档以及与其它开源项目的整合，欢迎在这些方面做出贡献。

## 行为准则

参与本项目即表示您同意遵守我们的[行为准则](CODE_OF_CONDUCT.md)。请在所有交流中保持友善和建设性。

## 贡献方式

贡献并不仅限于写代码，以下方式都非常欢迎：

| 方式 | 说明 |
|:-----|:-----|
| 报告 Bug | 通过 [Issue 表单](https://github.com/continew-org/continew-app/issues/new/choose) 提交，并附上版本号、复现步骤与错误日志 |
| 建议功能 | 通过 [Feature 表单](https://github.com/continew-org/continew-app/issues/new/choose) 描述使用场景与期望效果 |
| 改进文档 | 修复错别字、完善表述、补充使用示例（包括 [官方文档](https://continew.top)） |
| 审查 PR | 帮助我们审查其他贡献者的 [Pull Request](https://github.com/continew-org/continew-app/pulls) |
| 编写代码 | 修复 Bug、开发新功能、提升性能 |

如果是比较复杂的修改（如新功能、重构），建议先提交 Issue 讨论方案，达成基本共识后再动手，避免重复劳动。

## 分支说明

ContiNew 系列项目采用清晰的分支策略，确保开发与维护有序进行。提交 PR 前，请确认目标分支是否处于活跃维护状态。

| 分支  | 说明                                                         |
| ----- | ------------------------------------------------------------ |
| dev   | 开发分支，用于下个大版本的开发，接受新功能或功能优化 PR |
| x.x.x | 维护分支，用于特定版本（如 vx.x.x）的 bug 修复，仅接受已有功能的修复 PR，不接受新功能 |

## 环境准备

| 要求 | 说明 |
|:-----|:-----|
| Node.js 22+ | 项目基于 Node 22（LTS） |
| pnpm 12+ | 推荐通过 `corepack enable` 启用仓库 `packageManager` 字段锁定的版本，无需单独安装 |
| 微信开发者工具 | 仅微信小程序真机预览与上传时需要 |
| IDE（可选） | VS Code，建议安装 ESLint / Volar 插件 |

### 代码规范

ContiNew App 的代码风格以 ESLint（`@continew-app/eslint-config`，基于 `@antfu/eslint-config` 二次定制）为唯一事实源，配合 husky + lint-staged 在提交时自动检查。请勿依赖 IDE 手工格式化，以 `pnpm lint` 结果为准。

## 报告 Issue

在提交 Issue 之前，请先：

1. 确认使用的是[最新版本](https://github.com/continew-org/continew-app/releases)，项目由维护者利用业余时间维护，没有额外精力回溯修复历史版本的问题；
2. 搜索 [已有 Issue](https://github.com/continew-org/continew-app/issues)，避免重复提交；
3. 查阅官方文档。

一份好的 Bug 报告应当做到：

- **具体**：包含版本号、环境信息（端：App / 微信小程序 / H5）、相关配置，如涉及构建失败请附上完整日志；
- **可复现**：提供清晰的复现步骤，最好附上最小复现示例；
- **唯一**：不与已存在的问题重复。

> [!IMPORTANT]
> **请勿通过公开 Issue 报告安全漏洞**，请参阅 [安全策略](SECURITY.md)，通过 GitHub 安全通告负责任地披露。

## 代码贡献流程

### 1. Fork 仓库并克隆到本地

将 [continew-org/continew-app](https://github.com/continew-org/continew-app) Fork 到您的账号下，然后克隆到本地：

```bash
git clone https://github.com/<您的用户名>/continew-app.git
cd continew-app
```

> 上述地址以 GitHub 为例。社区在 AtomGit、Gitee 等平台也提供有官方仓库（见 [README](README.md)），在对应平台贡献时，将命令中的仓库地址替换为相应平台地址即可，流程一致。

### 2. 关联上游仓库

```bash
git remote add upstream https://github.com/continew-org/continew-app.git
git fetch upstream
```

> `upstream` 仅用于同步主仓库最新代码，请勿直接向其推送，所有贡献都应推送到您的 fork 并通过 Pull Request 提交。

### 3. 创建特性分支

基于目标分支（通常为 dev）创建新分支，请勿直接在源分支上修改（源分支仅做同步 ContiNew 最新代码用）：

```bash
git checkout -b feat/your-feature upstream/dev
```

分支命名建议使用前缀标明变更类型：`feat/`（新功能）、`fix/`（Bug 修复）、`docs/`（文档）、`refactor/`（重构）、`test/`（测试）、`chore`（构建、CI 或工具链变更）。

### 4. 开发与自测

安装依赖并开发：

```bash
pnpm install
pnpm dev:demo      # 启动演示应用（H5）
```

推送前请在本地执行：

```bash
pnpm verify
```

该命令会通过三道门禁：**lint**（ESLint 代码规范）、**typecheck**（vue-tsc / tsc 全量类型检查）、**build**（三端生产构建）。被 lint 拦截时执行 `pnpm lint:fix` 自动修复，修复后请再执行一次 `pnpm verify` 确认通过。

### 5. 提交 Commit

提交信息请遵循 [Conventional Commits（约定式提交）1.0.0](https://www.conventionalcommits.org/zh-hans/v1.0.0/)规范，结构如下：

```
<类型>[可选作用域]: <描述>

[可选的正文]

[可选的脚注]
```

- **类型（type）**：说明变更性质。`feat` 表示新增功能，`fix` 表示 Bug 修复；其余常用类型：`docs`（文档）、`refactor`（重构）、`perf`（性能优化）、`test`（测试）、`style`（格式调整，不影响功能）、`build`（构建或依赖变更）、`ci`（CI 配置或脚本）、`chore`（其他杂项）、`revert`（回退提交）；
- **作用域（scope）**：可选，表示变更影响的包。可取值：`demo` `core` `ui` `server` `eslint-config`；
- **描述（description）**：简短说明本次变更；
- **破坏性变更（breaking change）**：在类型或作用域后追加 `!`（如 `feat!:`），或在脚注中以 `BREAKING CHANGE: <说明>` 标注（对应主版本）。

示例：

```
feat(ui): CmDialog 支持自定义底部按钮区
fix(core): 修复 token 刷新并发时重复请求
refactor!: 移除已废弃的 XXX 配置项
```

> **PR 标题会被 CI 自动校验**：本项目采用 Squash and merge，PR 标题即最终提交信息，
> 因此 PR 标题同样必须符合上述规范，否则 `PR Validation / Validate PR title` 检查会失败。
> 标题写错时直接编辑标题即可重新触发校验。

### 6. 同步与变基

提交 PR 前，请同步主仓库最新代码并变基，保持提交历史单链清晰（避免产生 `Merge branch` 类提交）：

```bash
git fetch upstream
git rebase upstream/dev
```

### 7. 推送并创建 PR

```bash
git push origin feat/your-feature
```

在所在代码托管平台上向 **dev** 分支创建 Pull Request，并按 [PR 模板](.github/PULL_REQUEST_TEMPLATE.md) 填写说明信息。

### 8. 签署 CLA

提交 PR 后，所在平台的 CLA 校验机器人会提示签署 [CLA（贡献者许可协议）](CLA.md)（GitHub、AtomGit、Gitee 等主流代码托管平台均已支持，按机器人提示点击同意即可）。请确保 commit 使用的邮箱与您在对应代码托管平台账号绑定的邮箱一致。

### 9. 代码审查与合并

维护者会尽快审查您的 PR，并可能提出修改意见，这是正常协作的一部分。根据意见修改后推送即可（变基后再次推送如提示冲突，可 `git push -f` 强推到您自己的 fork 分支）。PR 合并后，下次贡献前请先同步最新代码，再从第 3 步开始。

## PR 检查清单

提交 PR 前，请对照以下清单自检：

- [ ] 一个 PR 只解决一个 Issue（只做一件事），不夹带无关改动
- [ ] 代码遵循已有风格，`pnpm verify` 三道门禁全部通过
- [ ] 如有行为变更，已同步更新相关文档
- [ ] 按 PR 模板完整填写说明，并关联相关 Issue（Closes/Fixes/Resolves #<issue号>）
- [ ] commit message 符合 Conventional Commits（约定式提交）规范
- [ ] commit 作者邮箱已绑定所在代码托管平台账号

## 让 PR 更快被合并

- **尽早签署 CLA**：不少首次贡献者因忽略 CLA 机器人评论而卡住，未签署 CLA 的 PR 无法合并；
- **保证本地检查通过**：CI 未通过的 PR 不会被审查，推送前先在本地完整执行一遍 `pnpm verify`；
- **保持改动聚焦且精简**：只做一件事的 PR 远比混杂无关改动的 PR 更容易审查，改动较大时请拆分为多个独立 PR；
- **撰写清晰的描述**：说明改了*什么*以及*为什么*，描述务必与实际 diff 一致；如果开发过程中范围发生了变化，请在请求审查前更新描述；
- **回应审查意见**：尽量在几天内回应维护者的审查意见，超过数周无响应的 PR 可能会被关闭（随时可以重新打开）。

## 社区

- **官方交流群**：[入群方式](https://continew.top/discussion.html)。欢迎先提交 Issue 沉淀问题，再将 Issue 链接分享至交流群并 @ 我们，即可与维护团队及其他大佬用户直接交流探讨

## 许可

向 ContiNew App 贡献代码即表示您同意您的贡献以 [Apache-2.0](LICENSE) 许可证进行许可。

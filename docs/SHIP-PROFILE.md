# SHIP-PROFILE — 宇树 EAM Console（3010 demo）发版档案

> 本档案是 `/ship` 通用流程的项目接口：ship 的每一步执行**这里声明的命令**。
> 建立：2026-09-09（首次 /ship 时按实测流程落档）。
> 本项目是**纯前端 demo**（`build:mock`，无后端 `/admin-api`），数据落 localStorage。
> 原理与排障见 `~/.claude/skills/yushu-deploy/SKILL.md`。

## 环境定位（先记这个）

| 项 | 值 |
|---|---|
| 本地源码 | `D:\0201yushu\0201yushu\xitong\iimake-eam-console-rebuild` |
| 服务器 | `root@8.130.182.148`（SSH 免密已配） |
| 远端目录 | `/var/www/yushu-eam` |
| 访问地址 | http://8.130.182.148:3010/ |
| 构建模式 | `build:mock`（**不要切 stage**，服务器上没有 yudao 后端） |

**本项目只有一套环境**：3010 既是测试环境也是演示环境，不存在"测试环境 → 生产环境"两段式。
`/ship` 的第 6 步与第 8 步在本项目合并为一次部署。

## 构建与静态检查

- 类型检查：`npx vue-tsc --noEmit -p tsconfig.json`
  - ⚠️ 仓库存量报错约 200+ 条，集中在 `src/components/bpmnProcessDesigner/`、`SimpleProcessDesignerV2/` 等历史模块。
  - **全绿定义 = 本次改动涉及的文件零报错**，用 `| grep -i <模块名>` 过滤本次范围，不要求全仓库归零。
- Lint：`npx eslint --ext .ts,.vue <本次改动的目录/文件>`
  - 不跑 `pnpm lint:eslint`（它带 `--fix` 会顺手改无关文件，违反精准修改）。
  - `src/mock-data/` 在 ignore 列表内，被跳过是正常的。
- 构建：`pnpm build:mock`

## 测试矩阵（全绿定义）

| 层 | 命令 | 覆盖内容 | 状态 |
|----|------|---------|------|
| L1 单测 | `npx vitest run` | ListPage / QueryForm / RowActions / lib 下工具函数 | ⚠️ **当前跑不起来**，见下 |
| L2 类型 | `npx vue-tsc --noEmit` | 本次改动文件零报错 | 可用 |
| L3 构建 | `pnpm build:mock` | 产物可构建 | 可用 |
| L4 UI 实地 | Playwright 驱动真实页面断言 | 见下"UI 改动验证方式" | 可用 |

### ⚠️ L1 单测当前不可用（预先存在，非某次改动引入）

`package.json` 声明 `vitest: ^4.1.5` 但 `vite: 5.1.4`，vitest 4 需要 vite 6+ 的 `./module-runner` 导出，
启动即报 `ERR_PACKAGE_PATH_NOT_EXPORTED`。修复需降 `vitest` 到 `^3`（改 devDependency + lock），
属独立技术决策，**须王老师拍板后单独处理**，不在功能迭代里顺手动依赖。
现存单测均不覆盖 NPI 模块，故 NPI 迭代不依赖 L1，但其它模块改动时须先修好这条。

### UI 改动验证方式

用 Playwright 驱动**真实页面**做 DOM 断言，不看截图猜：
1. `npx vite preview --mode mock --port 4173 --strictPort`（后台）
2. 导航到目标路由，用 `browser_evaluate` 断言：
   - CSS 行为：`getComputedStyle` + `getBoundingClientRect`（如 sticky 表头滚动后偏移量）
   - 业务状态：读 `localStorage.getItem('eam-npi-store-v2')` 校验数据落库
   - 交互链路：程序化点击按钮 → 断言状态/DOM 变化
3. 部署后在 `http://8.130.182.148:3010/` 上**再跑一遍同样断言**（线上实地验证）

## 部署

```bash
# 前置：确认 dist 是最新源码构建的
stat -c '%y' dist/index.html          # 应晚于最新源码 mtime，否则先 pnpm build:mock

# 1. 打包上传
tar -czf /tmp/yushu-eam-dist.tar.gz -C dist .
scp -q -o StrictHostKeyChecking=no /tmp/yushu-eam-dist.tar.gz root@8.130.182.148:/tmp/

# 2. 服务器：备份 → 只删构建产物 → 解压 → reload
ssh -o StrictHostKeyChecking=no root@8.130.182.148 'set -e; R=/var/www/yushu-eam; B=${R}-backup-$(date +%Y%m%d-%H%M%S); cp -r $R $B; echo "已备份: $B"; rm -rf $R/assets $R/index.html $R/favicon.ico $R/logo.gif; tar -xzf /tmp/yushu-eam-dist.tar.gz -C $R; rm /tmp/yushu-eam-dist.tar.gz; nginx -s reload; ls -la $R'

# 3. 本地清理
rm -f /tmp/yushu-eam-dist.tar.gz
```

**不要直接跑 `./deploy.sh`**：脚本里 `PROJECT_DIR` 写死 Mac 路径 `/Users/wangpeng/...`，在 Windows 上 `cd` 即失败；
且它用 `rm -rf $REMOTE_PATH/*`，改用上面按名删构建产物的写法更稳。

**回滚**：`ssh root@8.130.182.148 'R=/var/www/yushu-eam; rm -rf $R/*; cp -r <备份目录>/* $R/; nginx -s reload'`
（备份目录形如 `/var/www/yushu-eam-backup-20260909-224926`，`ls -d /var/www/yushu-eam-backup-*` 可列出）

### 冒烟检查

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://8.130.182.148:3010/
# 校验新代码确实上线：本地 dist 找含新标识的 chunk，curl 线上同名文件比对
grep -rl "<本次新增的类名/函数名>" dist/assets/*.js
curl -s http://8.130.182.148:3010/assets/<chunk名>.js | grep -c "<标识>"
```

### ⚠️ 演示数据不会自动刷新

数据落 `localStorage['eam-npi-store-v2']`。改了 seed 数据后，**老浏览器仍读旧存档**（只做字段 normalize，不换 seed）。
发版后必须提醒使用者：**点一次页面上的「重置演示数据」按钮**，否则看不到新演示数据。

## GitHub

- 远程：`origin` → `https://github.com/wangpeng1017/yushueam-archived.git`
- 当前分支：`dev_2026.3.1`
- 推送：`git push origin dev_2026.3.1`（2026-09-09 实测可写，仓库名里的 `-archived` 只是名字，不是 GitHub 归档态）
- 排除：`dist/`、`.playwright-mcp/`（已在 .gitignore 或不提交）
- ⚠️ 偶发 `schannel: failed to receive handshake, SSL/TLS connection failed`（网络抖动），重试即可，不是权限问题
- ⚠️ 工作区里长期存在与功能无关的未提交改动（`deploy.sh`、`_unitree-style/sync.sh`、`pnpm-lock.yaml`、`pnpm-workspace.yaml`），
  **提交时按文件显式 `git add`，不要 `git add -A`**

## 文档同步清单

- `docs/PRD.md` — 功能条目与变更历史
- `docs/plans/YYYY-MM-DD-<主题>-design.md` — 每次较大改造的设计文档（brainstorm 产出）

## 项目专属铁律

- 工作区级家规见 `D:\0201yushu\CLAUDE.md`（分支坑、数据安全红线、凭证不外传等）
- 部署 SOP 原文见 `~/.claude/skills/yushu-deploy/SKILL.md`
- **不要把 EAM（3010）改动当成 Portal（3011）改动** —— 两个仓库结构高度相似，是真踩过的坑

# 非标设备研制（NPI）改版设计 — 项目管理 + 项目知识库

> 2026-09-04 王老师拍板（/brainstorm）。目标 URL：http://8.130.182.148:3010/eam/npi/*
> 模式：纯前端 demo（build:mock），数据 localStorage 持久化，文件上传只记元数据。

## 1. 决策记录

| 议题 | 决定 |
|------|------|
| 持久化 | 纯前端；localStorage 存项目/异常/知识库；文件不真存 |
| 异常履历位置 | 项目详情内页签，不单开菜单 |
| 阶段模型 | 固定 8 阶段（与《自动化项目计划统计表》一致），阶段名/责任人/起止可改，不可增删 |
| 推进规则 | 必传资料缺失时提示，填理由可强推，理由记入阶段日志 |
| 提醒 | 页内提醒条（2 天内到期 / 已逾期）+ 甘特图颜色标记 |
| 知识库 | 自由文件夹树 + 预置"项目资料"只读根目录，阶段上传自动归档到 项目资料/项目名/阶段名 |
| 旧菜单 | 删除 方案评审/BOM 管理/装配与验收 三页；npiOverview 重定向到新项目管理 |

## 2. 菜单与路由

- `/eam/npi/npiProject` 项目管理 → `eam/npi/project/page`
- `/eam/npi/npiKnowledge` 项目知识库 → `eam/npi/knowledge/page`
- `/eam/npi/npiOverview` 与 `/eam/npi/index` 重定向到 `/eam/npi/npiProject`

## 3. 数据模型（`src/mock-data/eam-npi.ts` 导出类型）

```ts
type StageStatus = 'pending' | 'in_progress' | 'completed'
interface NpiDoc { id; name; size; type; uploadedAt; uploader }
interface NpiStageLog { time; action: 'advance' | 'force_advance' | 'edit'; operator; remark }
interface NpiStage {
  idx: 1..8; name; owner; planStart; planEnd; progress: 0-100; status: StageStatus
  requiredDocs: string[]        // 必传资料清单（模板给默认值）
  docs: NpiDoc[]                // 已传资料（元数据）
  logs: NpiStageLog[]
}
interface NpiProject {
  id; projectCode; projectName; owner; planStart; planEnd
  status: 'not_started' | 'in_progress' | 'delivered'
  currentStage: 1..8; stages: NpiStage[8]; description
}
interface NpiIssue {
  id; projectId; stageIdx; seq; problem; cause; tempMeasure; longMeasure
  issueType: '结构设计' | '电气问题' | '装配问题' | '软件调试' | '品质异常' | '其他'
  owner; occurDate; planDoneDate; actualDoneDate; status: 'open' | 'closed'
}
interface KbFolder { id; parentId | null; name; readonly: boolean; projectId?; stageIdx? }
interface KbFile extends NpiDoc { folderId; projectId?; stageIdx? }
```

默认 8 阶段模板与必传资料：

| idx | 阶段 | 必传资料 |
|-----|------|---------|
| 1 | 方案设计+评审 | 方案设计说明书、方案评审记录 |
| 2 | 细化出图 | 机械图纸、电气图纸 |
| 3 | BOM整理下单 | BOM 清单 |
| 4 | 物料采购 | 采购订单 |
| 5 | 整机装配 | 装配检查表 |
| 6 | 整机布线 | 布线检查表 |
| 7 | 上电调试 | 调试报告 |
| 8 | 交付导入 | 验收报告 |

## 4. 持久化：`src/store/modules/npi.ts`（Pinia）

- key `eam-npi-store-v1`，首次加载无数据时写入种子（附件 14 个项目 + CIP033 两条异常 + 知识库示例树）
- 所有增改删经 store action，action 末尾 `persist()`
- `resetSeed()` 清 localStorage 重新写种子，页面提供"重置演示数据"按钮
- 页面直接用 store，不再经 mock-bridge 请求（旧 `/eam/npi/*` mock 接口删除）

## 5. 项目管理页 `src/views/eam/npi/project/page.vue`

1. 搜索区：项目编号、名称、负责人、状态
2. 提醒条：`el-alert`（warning）"2 天内到期 N 个阶段 · 已逾期 M 个 · 查看"，点开 Dialog 表格（项目/阶段/责任人/计划结束/剩余天数），行点击打开该项目详情。判定：`planEnd - today` 在 [0,2] 天且状态≠completed 为临期；<0 且≠completed 为逾期
3. 视图切换 tabs：甘特图 / 列表
   - 甘特：左侧固定列 220px（编号、名称、当前阶段）；右侧时间轴按日 24px（周粒度）或按日 6px（月粒度）可切换；顶部两行表头（月份 / 日）；每项目一行，8 段阶段条按 planStart~planEnd 定位，条内文字"阶段名 进度%"；色：completed 绿 #52C41A、in_progress 蓝 #1677FF、临期橙 #FA8C16、逾期红 #FF4D4F、pending 灰 #E5E6EB；今天竖线红虚线。点击行打开详情。自研 div 甘特，不引第三方库
   - 列表：`ListPage` 组件，列：编号/名称/负责人/计划开始/计划结束/当前阶段/整体进度/状态/操作（详情、删除）
4. 工具栏：新增项目（primary）、重置演示数据（plain）
5. 新增/编辑项目 Dialog：编号、名称、负责人、计划开始、计划结束、说明；新建时按 8 阶段模板生成 stages，起止在计划区间内等分顺延
6. 项目详情 Dialog（width 1100px）三页签：
   - **阶段管理**：`el-steps` 展示 8 阶段；下方表格每行一阶段（名称可编辑、责任人、计划开始、计划结束、进度、状态、资料 x/y、操作：编辑/上传资料）；"推进到下一阶段"按钮：当前阶段 requiredDocs 中未在 docs 出现的项列表为空 → 直接推进（当前 completed、进度 100、下一阶段 in_progress）；否则弹 Dialog 列缺项 + 理由输入，确认后 force_advance 记日志。最后一阶段推进 → 项目 delivered。阶段日志时间线在页签底部
   - 上传资料：`el-upload` `:auto-upload="false"`，`on-change` 取 file.name/size 写入 stage.docs，同时 store 归档到知识库 `项目资料/<projectName>/<stageName>`（文件夹不存在则自动创建，readonly）
   - **异常履历**：见 §6
   - **项目资料**：按阶段分组列出所有 docs，只读

## 6. 异常履历页签 `src/views/eam/npi/project/IssueTab.vue`

- 顶部一行文字：各阶段"阶段名 进度%"摘要
- 表格按阶段分组（`el-table` 用 `span-method` 合并阶段列，或每阶段一个小表，二选一取实现简单者）
- 列：序号/问题及改善项/原因/临时措施/长期措施/异常类型/责任人/发生日期/计划完成/实际完成/状态/操作（编辑、结案）
- 新增 Dialog：阶段（默认当前阶段）+ 上述字段；结案 = status closed + actualDoneDate 今天

## 7. 项目知识库 `src/views/eam/npi/knowledge/page.vue`

- 用 `TreeListLayout`（左树 240px 固定）
- 左树：`el-tree` 节点右键/悬浮操作：新建子文件夹、重命名、删除（readonly 节点及非空文件夹禁止删，提示）；根节点"项目资料"（readonly）与"公共资料"
- 右侧：`ListPage`，工具栏：上传（primary，同样 auto-upload=false 只记元数据）、搜索框（按文件名，当前文件夹内）；列：名称/类型/大小/来源项目/来源阶段/上传人/上传时间/操作（删除，readonly 文件夹内文件不可删）

## 8. 删除清单

- `src/views/eam/npi/overview/`、`designReview/`、`bom/`、`acceptance/` 四个目录
- `src/mock-data/eam-npi.ts` 中旧 mock 接口（文件保留，只留类型 + 阶段模板 + 种子数据导出）
- `auth.ts` 菜单 4 项替换为 2 项

## 9. 验收标准

- `pnpm ts:check` 零报错；`pnpm build:mock` 成功
- 本地 `pnpm dev` 走通：新建项目 → 上传资料 → 推进（缺资料强推）→ 提醒条数字正确 → 刷新数据仍在 → 知识库能看到自动归档文件 → 新建文件夹并上传 → 重置演示数据恢复种子
- 表格 th 数 === 首行 td 数，Console 无 TypeError

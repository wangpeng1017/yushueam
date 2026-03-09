# AGENTS.md - EAM 前端迁移项目 Agent 规范

## 项目背景

本项目（iimake-eam-console-rebuild）是 EAM 设备资产管理系统的新前端，目标是从旧前端（iimake-eam-console）逐模块迁移业务功能到新框架中。后端（iimake-eam）接口已完成且不改动。

### 三个项目的角色

| 项目 | 角色 | 路径 |
| --- | --- | --- |
| iimake-eam | 后端（接口稳定，不改动） | `e:\ydworkspace\iimake-eam` |
| iimake-eam-console | 旧前端（业务逻辑参考源） | `e:\ydworkspace\iimake-eam-console` |
| iimake-eam-console-rebuild | 新前端（迁移交付目标） | `e:\ydworkspace\iimake-eam-console-rebuild` |

### 技术栈

- 新前端：Vue 3.5 + TypeScript 5.3 + Element Plus 2.11 + Pinia 2.1 + Vite 5.1
- 旧前端：Vue 3.4 + TypeScript 4.9 + Ant Design Vue 4.1 + Pinia 2.1 + Vite 5.2
- 后端：Spring Boot 3.5 + Java 17 + MyBatis-Plus

---

## Agent 行为规范

### 迁移前必须做

1. **读旧前端对应模块代码**：包括 `.api.ts`、`.data.ts`、`List.vue`、`modules/*.vue`，理解完整业务逻辑
2. **确认后端 Controller**：读取后端对应 Controller 类，确认 URL 路径、HTTP Method、请求参数、响应结构
3. **阅读 MIGRATION-GUIDE.md**：遵循迁移规范中的目录结构、组件映射、编码约定
4. **对照已有 MDM 模块范式**：以 `src/views/mdm/warehouse/` 作为标准编码参考

### 绝对禁止

1. **不得修改后端接口**：不改任何 Controller、Service、Entity、VO、Mapper
2. **不得引入旧框架依赖**：不使用 `ant-design-vue`、`vxe-table`、JeecgBoot 组件
3. **不得使用旧项目的路径别名**：不使用 `/@/`、`/#/`，统一用 `@/`
4. **不得创建大一统 Hook**：不封装 `useListPage` 类的通用 Hook，页面逻辑写在页面内
5. **不得引入 qiankun 微前端**
6. **不得在 API 层封装删除确认框**：确认提示在页面层处理
7. **不得使用旧前端的 `defHttp`**：统一使用新前端的 `request` 实例
8. **不得假设不存在的业务规则**：如有不确认的逻辑，标注后询问用户

### 必须遵循

1. **目录规范**：

   - EAM 页面统一放 `src/views/eam/{模块名}/`
   - EAM API 统一放 `src/api/eam/{模块名}/index.ts`
   - Store 仅在跨页面共享时才创建，放 `src/store/modules/eam/{模块名}/index.ts`

2. **文件结构**：每个 CRUD 模块包含：

   - `page.vue` — 列表页（搜索 + 表格 + 分页 + 操作）
   - `form.vue` — 新增/编辑表单弹窗
   - 子模块（如有）放同级子目录
   - 对应 `src/api/eam/{模块名}/index.ts`

3. **编码风格**：

   - 使用 `<script lang="ts" setup>`
   - 使用 `<style lang="scss" scoped>`
   - 表格使用 `<el-table>` + `<Pagination>`
   - 弹窗使用 `<Dialog>` 组件
   - 字典使用 `<DictTag>` + `getDictOptions()`
   - 权限使用 `v-hasPermi` 指令
   - 页面包裹使用 `<ContentWrap>`
   - 日期格式化使用 `dateFormatter` / `dateFormatter2`

4. **API 规范**：

   - 定义 DTO 接口（`XxxDto`、`XxxSaveDto`、`XxxUpdateDto`）
   - URL 使用 `/admin-api` 前缀（由 axios base_url 自动拼接，API 文件中不写此前缀）
   - 旧前端 `/eam-api/xxx` 路径需去掉 `/eam-api` 前缀，直接写后端 Controller 的实际路径
   - 使用 `request.get/post/put/delete/download` 方法

5. **状态管理**：
   - 页面内状态优先用 `ref()` / `reactive()`
   - 仅跨页面共享或明显复用时才创建 Pinia Store

---

## 质量检查命令

迁移完成一个模块后，必须执行：

```bash
# TypeScript 类型检查
npm run ts:check

# ESLint 检查并修复
npm run lint:eslint

# 代码格式化
npm run lint:format
```

---

## 迁移工作流

每个模块迁移遵循以下步骤：

1. **编写 Module Spec**：使用 MODULE-SPEC-TEMPLATE.md 模板，确认功能清单和 API 清单
2. **创建 API 文件**：`src/api/eam/{模块}/index.ts`，含 DTO 定义
3. **创建 page.vue**：列表页，含搜索表单、数据表格、分页、操作按钮
4. **创建 form.vue**：新增/编辑弹窗
5. **处理子模块**（如有）
6. **运行质量检查**
7. **联调验证**

---

## 当前迁移范围

- 聚焦 EAM 主业务模块（设备档案、保养、维修、点检、备件等）
- PPS（计划）、QMS（质量）、APP 端暂不纳入
- 优先试点：设备分类、设备类型、供应商

---

## 参考文件

| 文件           | 位置                               | 用途                         |
| -------------- | ---------------------------------- | ---------------------------- |
| 迁移指南       | `.qoder/MIGRATION-GUIDE.md`        | 组件映射、API 规则、目录规范 |
| 模块 Spec 模板 | `.qoder/MODULE-SPEC-TEMPLATE.md`   | 模块迁移前的需求确认模板     |
| 标准 page 范式 | `src/views/mdm/warehouse/page.vue` | 列表页编码参考               |
| 标准 form 范式 | `src/views/mdm/warehouse/form.vue` | 表单弹窗编码参考             |
| 标准 API 范式  | `src/api/mdm/warehouse/index.ts`   | API 文件编码参考             |

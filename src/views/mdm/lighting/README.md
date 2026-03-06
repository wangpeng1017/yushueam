# 物联灯管理模块

## 功能概述

物联灯管理模块用于管理仓库中的物联灯设备,包括巷道控制器、灯条和库位的绑定关系管理。

## 页面结构

```
src/views/mdm/lighting/
├── index.vue                           # 主页面(仓库和控制器视图)
├── components/
│   ├── LightbarList.vue               # 灯条列表组件
│   ├── BindLocationDialog.vue         # 绑定库位弹窗
│   └── BindLightbarDialog.vue         # 绑定新灯条弹窗
└── README.md                          # 本文档
```

## 功能说明

### 1. 主页面 (index.vue)

**功能:**
- 左侧树形结构显示仓库和控制器层级
- 右侧显示控制器卡片列表
- 点击控制器卡片进入灯条管理页面

**主要操作:**
- 刷新组织结构树
- 添加新控制器
- 批量绑定灯条
- 查看控制器详情

### 2. 灯条列表 (LightbarList.vue)

**功能:**
- 显示指定控制器下的所有灯条
- 显示灯条的在线状态、启用状态、绑定库位等信息
- 支持绑定库位和解绑灯条操作

**主要操作:**
- 绑定新灯条
- 绑定库位
- 解绑灯条
- 返回控制器列表

### 3. 绑定库位弹窗 (BindLocationDialog.vue)

**功能:**
- 选择库位并绑定到指定灯条
- 支持搜索库位(按编码或名称)
- 支持多选库位
- 显示已选择的库位列表

**交互流程:**
1. 打开弹窗
2. 搜索或选择库位
3. 查看已选择的库位
4. 确认绑定

### 4. 绑定新灯条弹窗 (BindLightbarDialog.vue)

**功能:**
- 显示IoT系统中可用的灯条设备
- 支持搜索设备
- 支持多选设备
- 批量绑定灯条到控制器

**交互流程:**
1. 打开弹窗
2. 搜索或选择设备
3. 查看已选择的设备
4. 确认绑定

## API 接口

### 控制器管理 API

```typescript
import * as ControllerApi from '@/api/mdm/lighting/controller'

// 分页查询控制器
ControllerApi.getAisleControllerPage(params)

// 获取控制器详情
ControllerApi.getAisleController(id)

// 创建控制器
ControllerApi.saveAisleController(data)

// 更新控制器
ControllerApi.updateAisleController(data)

// 删除控制器
ControllerApi.removeAisleController(id)
```

### 灯条绑定 API

```typescript
import * as LightbarApi from '@/api/mdm/lighting/lightbar'

// 查询控制器下的灯条列表
LightbarApi.listLightBarByController(controllerId)

// 绑定灯条
LightbarApi.bindLightBar(data)

// 批量绑定灯条
LightbarApi.batchBindLightBar(data)

// 解绑灯条
LightbarApi.unbindLightBar(data)
```

### 库位绑定 API

```typescript
import * as LocationApi from '@/api/mdm/lighting/location'

// 查询灯条绑定的库位列表
LocationApi.listLocationByLightbar(lightbarDeviceId)

// 单个绑定库位
LocationApi.bindLocation(data)

// 批量绑定库位
LocationApi.batchBindLocation(data)

// 解绑库位
LocationApi.unbindLocation(data)
```

## 枚举 Store

```typescript
import { useLightingEnumStore } from '@/store/modules/enums'

const lightingEnumStore = useLightingEnumStore()

// 加载枚举
await lightingEnumStore.loadOnlineStatus()
await lightingEnumStore.loadTaskStatus()
await lightingEnumStore.loadEnableFlag()

// 使用枚举
const statusList = lightingEnumStore.getOnlineStatusList
const statusText = lightingEnumStore.getOnlineStatusText('ONLINE')
const statusType = lightingEnumStore.getOnlineStatusType('ONLINE')
```

## 路由配置

需要在路由配置文件中添加以下路由:

```typescript
{
  path: '/mdm/lighting',
  name: 'LightingManagement',
  component: () => import('@/views/mdm/lighting/index.vue'),
  meta: {
    title: '物联灯管理',
    icon: 'Lamp',
    permission: 'mdm:lighting:query'
  }
}
```

## 权限配置

需要在后端菜单管理中配置以下权限:

- `mdm:lighting:query` - 查询权限
- `mdm:lighting:controller:save` - 创建控制器
- `mdm:lighting:controller:update` - 更新控制器
- `mdm:lighting:controller:remove` - 删除控制器
- `mdm:lighting:lightbar:bind` - 绑定灯条
- `mdm:lighting:lightbar:unbind` - 解绑灯条
- `mdm:lighting:location:bind` - 绑定库位
- `mdm:lighting:location:unbind` - 解绑库位

## 国际化

国际化配置文件位于:
- 中文: `src/locales/zh-CN/lighting.ts`
- 英文: `src/locales/en/lighting.ts`

使用方式:

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div>{{ t('lighting.title') }}</div>
</template>
```

## 待完善功能

1. **仓库API集成**: 当前使用模拟数据,需要对接实际的仓库API
2. **库位API集成**: 需要对接库位搜索和查询API
3. **IoT设备API集成**: 需要对接IoT设备列表API
4. **控制器表单**: 添加控制器的新增/编辑表单
5. **批量操作**: 批量绑定、批量解绑等功能
6. **权限控制**: 完善按钮级别的权限控制
7. **错误处理**: 完善错误提示和异常处理
8. **性能优化**: 大数据量时的分页和虚拟滚动

## 注意事项

1. 所有API调用都需要处理异常情况
2. 解绑灯条会级联删除库位绑定关系,需要提示用户
3. 设备在线状态需要实时更新
4. 库位搜索支持模糊匹配
5. 批量操作需要显示操作结果(成功/失败数量)

## 开发建议

1. 使用 TypeScript 确保类型安全
2. 使用 Composition API 组织代码
3. 合理使用 computed 和 watch
4. 组件拆分要合理,避免单个组件过大
5. 注意性能优化,避免不必要的重渲染
6. 添加适当的 loading 状态
7. 错误提示要友好明确

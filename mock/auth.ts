/**
 * Mock: 登录认证 + 用户权限 + 字典
 * 支持4个预设账号，通过 token 区分车间数据权限
 */


import type { MockMethod } from 'vite-plugin-mock'

// ── 用户-车间映射（通过token识别） ──
const USER_MAP: Record<string, any> = {
  'c-admin':   { token: 'mock-token-c',   workshopCode: 'C',   workshopName: 'C端车间',    nickname: 'C端管理员' },
  'b-admin':   { token: 'mock-token-b',   workshopCode: 'B',   workshopName: 'B端车间',    nickname: 'B端管理员' },
  'cnc-admin': { token: 'mock-token-cnc', workshopCode: 'CNC', workshopName: '数控机加车间', nickname: '数控机加管理员' },
  'admin':     { token: 'mock-token-all', workshopCode: 'ALL', workshopName: '全部车间',    nickname: '超级管理员' },
  'feishu-approver': { token: 'mock-token-feishu', workshopCode: 'ALL', workshopName: '飞书审批员', nickname: '审批员' },
}

// 通过token反查车间
export function getWorkshopByToken(authorization?: string): string {
  const token = (authorization || '').replace('Bearer ', '')
  for (const u of Object.values(USER_MAP)) {
    if (u.token === token) return u.workshopCode
  }
  return 'ALL'
}

// ── 菜单树（通用，所有角色共享菜单结构） ──
const eamMenus = [
  {
    path: '/eam/equipment',
    name: '设备台账', icon: 'ep:monitor', component: '#',
    visible: true, keepAlive: true, alwaysShow: true, parentId: 0,
    children: [
      { path: 'optEquipment', name: '设备档案', icon: 'ep:document', component: 'eam/optEquipment/page', componentName: 'EamOptEquipment', visible: true, keepAlive: true, parentId: 10 },
      { path: 'equipmentType', name: '设备类型', icon: 'ep:collection-tag', component: 'eam/equipmentType/page', componentName: 'EamEquipmentType', visible: true, keepAlive: true, parentId: 10 },
      { path: 'equipmentCategory', name: '设备类别', icon: 'ep:files', component: 'eam/equipmentCategory/page', componentName: 'EamEquipmentCategory', visible: true, keepAlive: true, parentId: 10 },
      { path: 'supplier', name: '供应商管理', icon: 'ep:office-building', component: 'eam/supplier/page', componentName: 'EamSupplier', visible: true, keepAlive: true, parentId: 10 },
      { path: 'deviceLedger', name: '设备履历', icon: 'ep:tickets', component: 'eam/deviceLedger/page', componentName: 'EamDeviceLedger', visible: true, keepAlive: true, parentId: 10 },
    ]
  },
  {
    path: '/eam/maintenance',
    name: '保养管理', icon: 'ep:tools', component: '#',
    visible: true, keepAlive: true, alwaysShow: true, parentId: 0,
    children: [
      { path: 'maintenanceStandard', name: '保养标准', icon: 'ep:document-copy', component: 'eam/maintenanceStandard/page', componentName: 'EamMaintenanceStandard', visible: true, keepAlive: true, parentId: 20 },
      { path: 'maintenancePlan', name: '保养计划', icon: 'ep:calendar', component: 'eam/maintenancePlan/page', componentName: 'EamMaintenancePlan', visible: true, keepAlive: true, parentId: 20 },
      { path: 'maintenanceWorkOrder', name: '保养工单', icon: 'ep:list', component: 'eam/maintenanceWorkOrder/page', componentName: 'EamMaintenanceWorkOrder', visible: true, keepAlive: true, parentId: 20 },
      { path: 'maintenanceWorkRecord', name: '保养记录', icon: 'ep:notebook', component: 'eam/maintenanceWorkRecord/page', componentName: 'EamMaintenanceWorkRecord', visible: true, keepAlive: true, parentId: 20 },
    ]
  },
  {
    path: '/eam/inspection',
    name: '点巡检管理', icon: 'ep:document-checked', component: '#',
    visible: true, keepAlive: true, alwaysShow: true, parentId: 0,
    children: [
      { path: 'inspectionRoute', name: '巡检路线', icon: 'ep:guide', component: 'eam/inspectionRoute/page', componentName: 'EamInspectionRoute', visible: true, keepAlive: true, parentId: 30 },
      { path: 'spotInspectionStandard', name: '点检标准', icon: 'ep:document-copy', component: 'eam/spotInspectionStandard/page', componentName: 'EamSpotInspectionStandard', visible: true, keepAlive: true, parentId: 30 },
      { path: 'spotInspectionPlan', name: '点检计划', icon: 'ep:calendar', component: 'eam/spotInspectionPlan/page', componentName: 'EamSpotInspectionPlan', visible: true, keepAlive: true, parentId: 30 },
      { path: 'spotInspectionWork', name: '点检工单', icon: 'ep:list', component: 'eam/spotInspectionWork/page', componentName: 'EamSpotInspectionWork', visible: true, keepAlive: true, parentId: 30 },
      { path: 'spotInspectionRecord', name: '点检记录', icon: 'ep:notebook', component: 'eam/spotInspectionRecord/page', componentName: 'EamSpotInspectionRecord', visible: true, keepAlive: true, parentId: 30 },
    ]
  },
  {
    path: '/eam/repair',
    name: '维修管理', icon: 'ep:set-up', component: '#',
    visible: true, keepAlive: true, alwaysShow: true, parentId: 0,
    children: [
      { path: 'failureWorkOrder', name: '故障报修', icon: 'ep:warning', component: 'eam/failureWorkOrder/page', componentName: 'EamFailureWorkOrder', visible: true, keepAlive: true, parentId: 40 },
      { path: 'repairWorkOrder', name: '维修工单', icon: 'ep:list', component: 'eam/repairWorkOrder/page', componentName: 'EamRepairWorkOrder', visible: true, keepAlive: true, parentId: 40 },
      { path: 'repairWorkRecord', name: '维修记录', icon: 'ep:notebook', component: 'eam/repairWorkRecord/page', componentName: 'EamRepairWorkRecord', visible: true, keepAlive: true, parentId: 40 },
      { path: 'repairKnowledge', name: '维修知识库', icon: 'ep:reading', component: 'eam/repairKnowledge/page', componentName: 'EamRepairKnowledge', visible: true, keepAlive: true, parentId: 40 },
    ]
  },
  {
    path: '/eam/sparePart',
    name: '备件管理', icon: 'ep:files', component: '#',
    visible: true, keepAlive: true, alwaysShow: true, parentId: 0,
    children: [
      { path: 'sparePartClassiftion', name: '备件分类', icon: 'ep:menu', component: 'eam/sparePartClassiftion/page', componentName: 'EamSparePartClassiftion', visible: true, keepAlive: true, parentId: 50 },
      { path: 'sparePartSearchList', name: '备件库查询', icon: 'ep:search', component: 'eam/sparePartSearchList/page', componentName: 'EamSparePartSearchList', visible: true, keepAlive: true, parentId: 50 },
      { path: 'sparePartRecordList', name: '备件使用记录', icon: 'ep:notebook', component: 'eam/sparePartRecordList/page', componentName: 'EamSparePartRecordList', visible: true, keepAlive: true, parentId: 50 },
    ]
  },
  {
    path: '/eam/iot',
    name: 'IoT/OEE', icon: 'ep:data-line', component: '#',
    visible: true, keepAlive: true, alwaysShow: true, parentId: 0,
    plantScope: ['C', 'CNC', 'ALL'],
    children: [
      { path: 'deviceMonitor', name: '设备运行监控', icon: 'ep:monitor', component: 'eam/deviceMonitor/page', componentName: 'EamDeviceMonitor', visible: true, keepAlive: true, parentId: 70 },
      { path: 'oeeAnalysis', name: 'OEE分析看板', icon: 'ep:trend-charts', component: 'eam/oeeAnalysis/page', componentName: 'EamOeeAnalysis', visible: true, keepAlive: true, parentId: 70 },
    ]
  },
  {
    path: '/eam/tooling',
    name: '生产工器具', icon: 'ep:scissor', component: '#',
    visible: true, keepAlive: true, alwaysShow: true, parentId: 0,
    plantScope: ['CNC', 'ALL'],
    children: [
      { path: 'toolCategory', name: '工器具分类', icon: 'ep:menu', component: 'eam/toolCategory/page', componentName: 'EamToolCategory', visible: true, keepAlive: true, parentId: 80 },
      { path: 'toolMaster', name: '刀具档案', icon: 'ep:scissor', component: 'eam/toolMaster/page', componentName: 'EamToolMaster', visible: true, keepAlive: true, parentId: 80 },
      { path: 'gaugeMaster', name: '量具档案', icon: 'ep:histogram', component: 'eam/gaugeMaster/page', componentName: 'EamGaugeMaster', visible: true, keepAlive: true, parentId: 80 },
      { path: 'mouldMaster', name: '模具档案', icon: 'ep:box', component: 'eam/mouldMaster/page', componentName: 'EamMouldMaster', visible: true, keepAlive: true, parentId: 80 },
      { path: 'toolPurchaseDemand', name: '采购需求', icon: 'ep:shopping-cart', component: 'eam/toolPurchaseDemand/page', componentName: 'EamToolPurchaseDemand', visible: true, keepAlive: true, parentId: 80 },
      { path: 'toolingInbound', name: '入库管理', icon: 'ep:download', component: 'eam/toolingInbound/page', componentName: 'EamToolingInbound', visible: true, keepAlive: true, parentId: 80 },
      { path: 'toolingOutbound', name: '出库管理', icon: 'ep:upload', component: 'eam/toolingOutbound/page', componentName: 'EamToolingOutbound', visible: true, keepAlive: true, parentId: 80 },
      { path: 'gaugeBorrowReturn', name: '借用归还', icon: 'ep:refresh', component: 'eam/gaugeBorrowReturn/page', componentName: 'EamGaugeBorrowReturn', visible: true, keepAlive: true, parentId: 80 },
      { path: 'toolingScrap', name: '报废登记', icon: 'ep:delete', component: 'eam/toolingScrap/page', componentName: 'EamToolingScrap', visible: true, keepAlive: true, parentId: 80 },
    ]
  },
  {
    path: '/eam/project',
    name: '非标研制', icon: 'ep:cpu', component: '#',
    visible: true, keepAlive: true, alwaysShow: true, parentId: 0,
    plantScope: ['C', 'ALL'],
    children: [
      { path: 'customEquipmentProject', name: '研制项目', icon: 'ep:promotion', component: 'eam/customEquipmentProject/page', componentName: 'EamCustomEquipmentProject', visible: true, keepAlive: true, parentId: 90 },
    ]
  },
  {
    path: '/system',
    name: '系统管理', icon: 'ep:setting', component: '#',
    visible: true, keepAlive: true, alwaysShow: true, parentId: 0,
    plantScope: ['ALL'],
    children: [
      { path: 'plantConfig', name: '端别配置', icon: 'ep:operation', component: 'system/plantConfig/page', componentName: 'SystemPlantConfig', visible: true, keepAlive: true, parentId: 100 },
      { path: 'feishuApproval', name: '飞书审批模拟', icon: 'ep:chat-line-square', component: 'system/feishuApproval/page', componentName: 'SystemFeishuApproval', visible: true, keepAlive: true, parentId: 100 },
    ]
  }
]

// 根据车间过滤菜单
function filterMenusByPlant(menus: any[], plantCode: string) {
  return menus
    .filter(m => !m.plantScope || m.plantScope.includes(plantCode))
    .map(m => ({
      ...m,
      children: m.children ? filterMenusByPlant(m.children, plantCode) : undefined
    }))
}

export default [
  // ── 登录（根据用户名返回不同token） ──
  {
    url: '/admin-api/system/auth/login',
    method: 'post',
    response: ({ body }) => {
      const username = body?.username || body?.loginName || 'admin'
      const user = USER_MAP[username] || USER_MAP['admin']
      return {
        code: 200,
        data: {
          accessToken: user.token,
          refreshToken: 'mock-refresh-' + user.workshopCode,
          expiresTime: Date.now() + 24 * 60 * 60 * 1000,
          userId: 1
        }
      }
    }
  },
  {
    url: '/admin-api/system/auth/loginByUsername',
    method: 'post',
    response: ({ body }) => {
      const username = body?.username || body?.loginName || 'admin'
      const user = USER_MAP[username] || USER_MAP['admin']
      return {
        code: 200,
        data: {
          accessToken: user.token,
          refreshToken: 'mock-refresh-' + user.workshopCode,
          expiresTime: Date.now() + 24 * 60 * 60 * 1000,
          userId: 1
        }
      }
    }
  },
  // ── 获取权限（根据token返回对应车间的用户信息） ──
  {
    url: '/admin-api/system/auth/get-permission-info',
    method: 'get',
    response: ({ headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      const user = Object.values(USER_MAP).find(u => u.workshopCode === ws) || USER_MAP['admin']
      return {
        code: 200,
        data: {
          permissions: ['*:*:*'],
          roles: ['admin'],
          user: {
            id: 1,
            avatar: '',
            nickname: user.nickname + '（' + user.workshopName + '）',
            deptId: 100,
            plantCode: ws,
            workshopName: user.workshopName
          },
          menus: filterMenusByPlant(eamMenus, ws)
        }
      }
    }
  },
  { url: '/admin-api/system/auth/logout', method: 'post', response: () => ({ code: 200, data: true }) },
  { url: '/admin-api/system/dict-data/simple-list', method: 'get', response: () => ({ code: 200, data: [] }) },
  { url: '/admin-api/system/dict-data/list-all-simple', method: 'get', response: () => ({ code: 200, data: [] }) },
  { url: '/admin-api/system/tenant/get-id-by-name', method: 'get', response: () => ({ code: 200, data: 1 }) },
] as MockMethod[]

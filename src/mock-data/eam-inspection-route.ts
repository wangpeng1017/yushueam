/**
 * Mock: 巡检路线管理 + 巡检点位管理
 */

import { getWorkshopByToken } from './auth'

function paginate(list: any[], pageNo = 1, pageSize = 10) {
  const start = (Number(pageNo) - 1) * Number(pageSize)
  return { records: list.slice(start, start + Number(pageSize)), total: list.length }
}

// ── 有状态存储 ──
const routePointStore: Record<string, any[]> = {}

function getRoutePoints(routeCode: string, defaults: any[]) {
  if (!routePointStore[routeCode]) routePointStore[routeCode] = [...defaults]
  return routePointStore[routeCode]
}

// ── 基础路线数据 ──
const allRoutes = [
  {
    id: 'R001',
    routeCode: 'RT-C-001',
    routeName: 'C端电子车间巡检路线',
    areaName: 'C端-电子车间',
    pointCount: 4,
    remark: '',
    createByPersonName: '王工',
    createTime: '2025-03-01 08:00:00',
    workshopCode: 'C'
  },
  {
    id: 'R002',
    routeCode: 'RT-B-001',
    routeName: 'B端生产车间巡检路线',
    areaName: 'B端车间',
    pointCount: 3,
    remark: '',
    createByPersonName: '李工',
    createTime: '2025-03-05 09:00:00',
    workshopCode: 'B'
  },
  {
    id: 'R003',
    routeCode: 'RT-N-001',
    routeName: '数控机加车间巡检路线',
    areaName: '数控机加-CNC',
    pointCount: 3,
    remark: '',
    createByPersonName: '张工',
    createTime: '2025-03-10 10:00:00',
    workshopCode: 'CNC'
  }
]

// ── 各路线默认点位 ──
const defaultPoints: Record<string, any[]> = {
  'RT-C-001': [
    { id: 'P-C-001', routeCode: 'RT-C-001', pointName: 'PACK线区域', pointLocation: 'C端电子车间 1F 东侧', checkRequirement: '检查PACK线运行状态、设备声音、温度是否正常', sort: 1, createByPersonName: '王工', createTime: '2025-03-01 08:10:00' },
    { id: 'P-C-002', routeCode: 'RT-C-001', pointName: '电机装配区', pointLocation: 'C端电子车间 1F 中部', checkRequirement: '检查电机装配工位工具完整性、安全防护是否到位', sort: 2, createByPersonName: '王工', createTime: '2025-03-01 08:11:00' },
    { id: 'P-C-003', routeCode: 'RT-C-001', pointName: 'PCBA区域', pointLocation: 'C端电子车间 2F 西侧', checkRequirement: '检查防静电措施、SMT设备运行参数是否在标准范围', sort: 3, createByPersonName: '王工', createTime: '2025-03-01 08:12:00' },
    { id: 'P-C-004', routeCode: 'RT-C-001', pointName: '仓储区域', pointLocation: 'C端电子车间 1F 北侧', checkRequirement: '检查物料摆放、标识、防潮措施是否符合要求', sort: 4, createByPersonName: '王工', createTime: '2025-03-01 08:13:00' }
  ],
  'RT-B-001': [
    { id: 'P-B-001', routeCode: 'RT-B-001', pointName: '装配区', pointLocation: 'B端车间 1F 东侧装配线', checkRequirement: '检查装配工位工装夹具、工具摆放及安全帽佩戴', sort: 1, createByPersonName: '李工', createTime: '2025-03-05 09:10:00' },
    { id: 'P-B-002', routeCode: 'RT-B-001', pointName: '锁螺丝区', pointLocation: 'B端车间 1F 中部锁螺丝线', checkRequirement: '检查自动锁螺丝机扭矩设定值、漏锁报警功能', sort: 2, createByPersonName: '李工', createTime: '2025-03-05 09:11:00' },
    { id: 'P-B-003', routeCode: 'RT-B-001', pointName: 'PACK压装区', pointLocation: 'B端车间 1F 西侧压装台', checkRequirement: '检查压装机压力参数、行程限位及安全光栅工作状态', sort: 3, createByPersonName: '李工', createTime: '2025-03-05 09:12:00' }
  ],
  'RT-N-001': [
    { id: 'P-N-001', routeCode: 'RT-N-001', pointName: 'CNC加工区A', pointLocation: '数控机加车间 A区 CNC铣削', checkRequirement: '检查CNC主轴温度、切削液浓度、防护门开关是否正常', sort: 1, createByPersonName: '张工', createTime: '2025-03-10 10:10:00' },
    { id: 'P-N-002', routeCode: 'RT-N-001', pointName: 'CNC加工区B', pointLocation: '数控机加车间 B区 车削中心', checkRequirement: '检查刀具磨损状态、卡盘夹持力、程序版本是否正确', sort: 2, createByPersonName: '张工', createTime: '2025-03-10 10:11:00' },
    { id: 'P-N-003', routeCode: 'RT-N-001', pointName: '注塑区', pointLocation: '数控机加车间 注塑区', checkRequirement: '检查注塑机料筒温度、注射压力、模具冷却水温是否达标', sort: 3, createByPersonName: '张工', createTime: '2025-03-10 10:12:00' }
  ]
}

let pointIdCounter = 1000

export default [
  // ── 路线列表（分页） ──
  {
    url: '/admin-api/workOrder/eamInspectionRoute/list',
    method: 'get',
    response: (req: any) => {
      const ws = getWorkshopByToken(req)
      const { routeCode, routeName, areaName, pageNo = 1, pageSize = 10 } = req.query
      let filtered = allRoutes.filter(r => ws === 'ALL' || r.workshopCode === ws)
      if (routeCode) filtered = filtered.filter(r => r.routeCode.includes(routeCode))
      if (routeName) filtered = filtered.filter(r => r.routeName.includes(routeName))
      if (areaName) filtered = filtered.filter(r => r.areaName.includes(areaName))
      // 同步 pointCount
      filtered = filtered.map(r => ({
        ...r,
        pointCount: getRoutePoints(r.routeCode, defaultPoints[r.routeCode] || []).length
      }))
      return { code: 200, data: paginate(filtered, pageNo, pageSize), msg: 'ok' }
    }
  },
  // ── 路线详情 ──
  {
    url: '/admin-api/workOrder/eamInspectionRoute/queryById',
    method: 'get',
    response: (req: any) => {
      const { id } = req.query
      const route = allRoutes.find(r => r.id === id)
      return { code: 200, data: route || null, msg: 'ok' }
    }
  },
  // ── 新增路线 ──
  {
    url: '/admin-api/workOrder/eamInspectionRoute/add',
    method: 'post',
    response: (req: any) => {
      const body = req.body
      const ws = getWorkshopByToken(req)
      const newRoute = {
        ...body,
        id: 'R' + Date.now(),
        pointCount: 0,
        createByPersonName: '当前用户',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        workshopCode: ws === 'ALL' ? 'C' : ws
      }
      allRoutes.push(newRoute)
      routePointStore[newRoute.routeCode] = []
      return { code: 200, data: true, msg: 'ok' }
    }
  },
  // ── 编辑路线 ──
  {
    url: '/admin-api/workOrder/eamInspectionRoute/edit',
    method: 'put',
    response: (req: any) => {
      const body = req.body
      const idx = allRoutes.findIndex(r => r.id === body.id)
      if (idx !== -1) Object.assign(allRoutes[idx], body)
      return { code: 200, data: true, msg: 'ok' }
    }
  },
  // ── 删除路线 ──
  {
    url: '/admin-api/workOrder/eamInspectionRoute/delete',
    method: 'delete',
    response: (req: any) => {
      const { id } = req.query
      const idx = allRoutes.findIndex(r => r.id === id)
      if (idx !== -1) {
        const routeCode = allRoutes[idx].routeCode
        allRoutes.splice(idx, 1)
        delete routePointStore[routeCode]
      }
      return { code: 200, data: true, msg: 'ok' }
    }
  },

  // ── 点位列表（分页） ──
  {
    url: '/admin-api/workOrder/eamInspectionRoutePoint/list',
    method: 'get',
    response: (req: any) => {
      const { routeCode, pageNo = 1, pageSize = 10 } = req.query
      if (!routeCode) return { code: 200, data: { records: [], total: 0 }, msg: 'ok' }
      const points = getRoutePoints(routeCode, defaultPoints[routeCode] || [])
      const sorted = [...points].sort((a, b) => (a.sort || 0) - (b.sort || 0))
      return { code: 200, data: paginate(sorted, pageNo, pageSize), msg: 'ok' }
    }
  },
  // ── 新增点位 ──
  {
    url: '/admin-api/workOrder/eamInspectionRoutePoint/add',
    method: 'post',
    response: (req: any) => {
      const body = req.body
      const points = getRoutePoints(body.routeCode, defaultPoints[body.routeCode] || [])
      const newPoint = {
        ...body,
        id: 'PT-' + (++pointIdCounter),
        createByPersonName: '当前用户',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }
      points.push(newPoint)
      return { code: 200, data: true, msg: 'ok' }
    }
  },
  // ── 删除点位 ──
  {
    url: '/admin-api/workOrder/eamInspectionRoutePoint/delete',
    method: 'delete',
    response: (req: any) => {
      const { id } = req.query
      for (const code in routePointStore) {
        const arr = routePointStore[code]
        const idx = arr.findIndex((p: any) => p.id === id)
        if (idx !== -1) {
          arr.splice(idx, 1)
          break
        }
      }
      // 也检查 defaultPoints（首次删除前未初始化store的情况）
      for (const code in defaultPoints) {
        const arr = defaultPoints[code]
        const idx = arr.findIndex((p: any) => p.id === id)
        if (idx !== -1) {
          // 触发store初始化再删除
          const storeArr = getRoutePoints(code, arr)
          const si = storeArr.findIndex((p: any) => p.id === id)
          if (si !== -1) storeArr.splice(si, 1)
          break
        }
      }
      return { code: 200, data: true, msg: 'ok' }
    }
  }
]

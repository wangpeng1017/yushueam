/**
 * Mock: 设备档案 + 设备类型 + 设备类别 + 设备履历 + 供应商
 * 三车间独立数据，通过 token 识别数据权限
 */
import type { MockMethod } from 'vite-plugin-mock'
import { getWorkshopByToken } from './auth'

// ── 工具函数 ──
function paginate(list: any[], pageNo = 1, pageSize = 10) {
  const start = (Number(pageNo) - 1) * Number(pageSize)
  return { records: list.slice(start, start + Number(pageSize)), total: list.length }
}

function filterByWorkshop(list: any[], ws: string) {
  if (ws === 'ALL') return list
  return list.filter(item => item.workshopCode === ws)
}

// ══════════════════════════════════════════════
// 设备档案数据（三车间）
// ══════════════════════════════════════════════
const equipmentList = [
  // ── C端车间（~10台） ──
  { id: 'C01', workshopCode: 'C', equipmentSn: 'EW-LP-001', equipmentName: '轻型手动压机', equipmentType: 'T003', equipmentTypeDesc: '加工类设备', equipmentCategory: 'C001', equipmentCategoryDesc: '重点设备', equipmentMode: 'LP-50', equipmentTag: 'C端-电子车间', locationSn: 'C-EW-01', equipmentSupplier: 'S001', equipmentSupplierName: '华诚精密', equipmentStatus: '1', operationStatus: '1', equipmentRevstop: '1', sequenceNumber: 1, equipmentPurchase: '2024-06-15', equipmentOperating: '2024-07-01', createTime: '2024-07-01 08:00:00' },
  { id: 'C02', workshopCode: 'C', equipmentSn: 'EW-TCM-001', equipmentName: '端子机', equipmentType: 'T003', equipmentTypeDesc: '加工类设备', equipmentCategory: 'C001', equipmentCategoryDesc: '重点设备', equipmentMode: 'TCM-200', equipmentTag: 'C端-电子车间', locationSn: 'C-EW-02', equipmentSupplier: 'S002', equipmentSupplierName: '金田铜业', equipmentStatus: '1', operationStatus: '1', equipmentRevstop: '1', sequenceNumber: 2, equipmentPurchase: '2024-05-20', equipmentOperating: '2024-06-01', createTime: '2024-06-01 08:00:00' },
  { id: 'C03', workshopCode: 'C', equipmentSn: 'EW-PP-001', equipmentName: '气动压机', equipmentType: 'T003', equipmentTypeDesc: '加工类设备', equipmentCategory: 'C001', equipmentCategoryDesc: '重点设备', equipmentMode: 'PP-100', equipmentTag: 'C端-电子车间', locationSn: 'C-EW-03', equipmentSupplier: 'S003', equipmentSupplierName: '力丰液压', equipmentStatus: '1', operationStatus: '1', equipmentRevstop: '1', sequenceNumber: 3, equipmentPurchase: '2024-03-10', equipmentOperating: '2024-04-01', createTime: '2024-04-01 08:00:00' },
  { id: 'C04', workshopCode: 'C', equipmentSn: 'EW-BPIL-001', equipmentName: 'PACK线', equipmentType: 'T001', equipmentTypeDesc: '非标设备', equipmentCategory: 'C002', equipmentCategoryDesc: '关键设备', equipmentMode: 'BPIL-A1', equipmentTag: 'C端-电子车间', locationSn: 'C-EW-04', equipmentSupplier: 'S004', equipmentSupplierName: '自研', equipmentStatus: '1', operationStatus: '1', equipmentRevstop: '1', sequenceNumber: 4, equipmentPurchase: '2024-01-15', equipmentOperating: '2024-02-01', createTime: '2024-02-01 08:00:00' },
  { id: 'C05', workshopCode: 'C', equipmentSn: 'EW-CCM-001', equipmentName: '三防漆涂覆机', equipmentType: 'T001', equipmentTypeDesc: '非标设备', equipmentCategory: 'C002', equipmentCategoryDesc: '关键设备', equipmentMode: 'CCM-3F', equipmentTag: 'C端-电子车间', locationSn: 'C-EW-05', equipmentSupplier: 'S005', equipmentSupplierName: '诺信EFD', equipmentStatus: '1', operationStatus: '1', equipmentRevstop: '1', sequenceNumber: 5, equipmentPurchase: '2024-04-20', equipmentOperating: '2024-05-15', createTime: '2024-05-15 08:00:00' },
  { id: 'C06', workshopCode: 'C', equipmentSn: 'EW-PL-001', equipmentName: '流水线', equipmentType: 'T001', equipmentTypeDesc: '非标设备', equipmentCategory: 'C002', equipmentCategoryDesc: '关键设备', equipmentMode: 'PL-6M', equipmentTag: 'C端-电子车间', locationSn: 'C-EW-06', equipmentSupplier: 'S004', equipmentSupplierName: '自研', equipmentStatus: '1', operationStatus: '1', equipmentRevstop: '1', sequenceNumber: 6, equipmentPurchase: '2024-02-01', equipmentOperating: '2024-03-01', createTime: '2024-03-01 08:00:00' },
  { id: 'C07', workshopCode: 'C', equipmentSn: 'EW-BSM-001', equipmentName: '电池分选机', equipmentType: 'T003', equipmentTypeDesc: '加工类设备', equipmentCategory: 'C002', equipmentCategoryDesc: '关键设备', equipmentMode: 'BSM-16', equipmentTag: 'C端-电子车间', locationSn: 'C-EW-07', equipmentSupplier: 'S006', equipmentSupplierName: '新威尔', equipmentStatus: '1', operationStatus: '1', equipmentRevstop: '1', sequenceNumber: 7, equipmentPurchase: '2024-06-01', equipmentOperating: '2024-07-01', createTime: '2024-07-01 08:00:00' },
  { id: 'C08', workshopCode: 'C', equipmentSn: 'EW-WCM-001', equipmentName: '裁线机', equipmentType: 'T003', equipmentTypeDesc: '加工类设备', equipmentCategory: 'C001', equipmentCategoryDesc: '重点设备', equipmentMode: 'WCM-50', equipmentTag: 'C端-电子车间', locationSn: 'C-EW-08', equipmentSupplier: 'S007', equipmentSupplierName: '科瑞达', equipmentStatus: '1', operationStatus: '1', equipmentRevstop: '1', sequenceNumber: 8, equipmentPurchase: '2024-05-10', equipmentOperating: '2024-06-01', createTime: '2024-06-01 08:00:00' },
  { id: 'C09', workshopCode: 'C', equipmentSn: 'PM-LP-001', equipmentName: '轻型手动压机(715线)', equipmentType: 'T003', equipmentTypeDesc: '加工类设备', equipmentCategory: 'C001', equipmentCategoryDesc: '重点设备', equipmentMode: 'LP-30', equipmentTag: 'C端-715产品线', locationSn: 'C-PM-01', equipmentSupplier: 'S001', equipmentSupplierName: '华诚精密', equipmentStatus: '1', operationStatus: '1', equipmentRevstop: '1', sequenceNumber: 9, equipmentPurchase: '2024-08-01', equipmentOperating: '2024-08-15', createTime: '2024-08-15 08:00:00' },
  { id: 'C10', workshopCode: 'C', equipmentSn: 'PM-HP-001', equipmentName: '重型手动压机(715线)', equipmentType: 'T003', equipmentTypeDesc: '加工类设备', equipmentCategory: 'C001', equipmentCategoryDesc: '重点设备', equipmentMode: 'HP-100', equipmentTag: 'C端-715产品线', locationSn: 'C-PM-02', equipmentSupplier: 'S001', equipmentSupplierName: '华诚精密', equipmentStatus: '1', operationStatus: '1', equipmentRevstop: '1', sequenceNumber: 10, equipmentPurchase: '2024-08-01', equipmentOperating: '2024-08-15', createTime: '2024-08-15 08:00:00' },

  // ── B端车间（~5台） ──
  { id: 'B01', workshopCode: 'B', equipmentSn: 'B-20000002', equipmentName: '冷媒检漏仪', equipmentType: 'T004', equipmentTypeDesc: '测试仪器', equipmentCategory: 'C001', equipmentCategoryDesc: '重点设备', equipmentMode: 'GS-H3', equipmentTag: 'B端', locationSn: 'B-QC-01', equipmentSupplier: 'S008', equipmentSupplierName: '工艺部', equipmentStatus: '1', operationStatus: '1', equipmentRevstop: '1', sequenceNumber: 1, equipmentPurchase: '2025-01-10', equipmentOperating: '2025-02-01', createTime: '2025-02-01 08:00:00' },
  { id: 'B02', workshopCode: 'B', equipmentSn: 'B-20000015', equipmentName: '自动锁螺丝机', equipmentType: 'T003', equipmentTypeDesc: '加工类设备', equipmentCategory: 'C001', equipmentCategoryDesc: '重点设备', equipmentMode: 'ASM-4', equipmentTag: 'B端', locationSn: 'B-PD-01', equipmentSupplier: 'S016', equipmentSupplierName: '快克智能', equipmentStatus: '1', operationStatus: '1', equipmentRevstop: '1', sequenceNumber: 2, equipmentPurchase: '2025-02-10', equipmentOperating: '2025-03-01', createTime: '2025-03-01 08:00:00' },
  { id: 'B03', workshopCode: 'B', equipmentSn: 'B-20000023', equipmentName: '手动PACK压装机', equipmentType: 'T003', equipmentTypeDesc: '加工类设备', equipmentCategory: 'C001', equipmentCategoryDesc: '重点设备', equipmentMode: 'MP-200', equipmentTag: 'B端', locationSn: 'B-PK-01', equipmentSupplier: 'S001', equipmentSupplierName: '华诚精密', equipmentStatus: '1', operationStatus: '1', equipmentRevstop: '1', sequenceNumber: 3, equipmentPurchase: '2025-01-20', equipmentOperating: '2025-02-15', createTime: '2025-02-15 08:00:00' },
  { id: 'B04', workshopCode: 'B', equipmentSn: 'B-20000031', equipmentName: '电阻自动焊接机', equipmentType: 'T003', equipmentTypeDesc: '加工类设备', equipmentCategory: 'C002', equipmentCategoryDesc: '关键设备', equipmentMode: 'RW-100', equipmentTag: 'B端', locationSn: 'B-PD-02', equipmentSupplier: 'S017', equipmentSupplierName: '联赢激光', equipmentStatus: '1', operationStatus: '1', equipmentRevstop: '1', sequenceNumber: 4, equipmentPurchase: '2025-03-01', equipmentOperating: '2025-03-15', createTime: '2025-03-15 08:00:00' },
  { id: 'B05', workshopCode: 'B', equipmentSn: 'B-20000040', equipmentName: '电批（工具）', equipmentType: 'T002', equipmentTypeDesc: '工具类设备', equipmentCategory: 'C007', equipmentCategoryDesc: '手持电动工具', equipmentMode: 'ED-10', equipmentTag: 'B端', locationSn: 'B-PD-03', equipmentSupplier: 'S018', equipmentSupplierName: '日东工器', equipmentStatus: '1', operationStatus: '1', equipmentRevstop: '1', sequenceNumber: 5, equipmentPurchase: '2025-02-20', equipmentOperating: '2025-03-01', createTime: '2025-03-01 08:00:00' },

  // ── 数控机加车间（~10台） ──
  { id: 'N01', workshopCode: 'CNC', equipmentSn: 'A1', equipmentName: 'CNC铣削加工中心', equipmentType: 'T005', equipmentTypeDesc: '数控设备', equipmentCategory: 'C003', equipmentCategoryDesc: '标品设备', equipmentMode: 'T-7', equipmentTag: '数控-CNC', locationSn: 'CNC-A1', equipmentSupplier: 'S009', equipmentSupplierName: '乔峰', equipmentStatus: '1', operationStatus: '1', equipmentRevstop: '1', sequenceNumber: 1, equipmentPurchase: '2025-01-01', equipmentOperating: '2025-01-15', createTime: '2025-01-15 08:00:00' },
  { id: 'N02', workshopCode: 'CNC', equipmentSn: 'A2', equipmentName: 'CNC铣削加工中心', equipmentType: 'T005', equipmentTypeDesc: '数控设备', equipmentCategory: 'C003', equipmentCategoryDesc: '标品设备', equipmentMode: 'T-700B', equipmentTag: '数控-CNC', locationSn: 'CNC-A2', equipmentSupplier: 'S010', equipmentSupplierName: '台群', equipmentStatus: '1', operationStatus: '1', equipmentRevstop: '1', sequenceNumber: 2, equipmentPurchase: '2025-01-01', equipmentOperating: '2025-01-15', createTime: '2025-01-15 08:00:00' },
  { id: 'N03', workshopCode: 'CNC', equipmentSn: 'A3', equipmentName: 'CNC铣削加工中心', equipmentType: 'T005', equipmentTypeDesc: '数控设备', equipmentCategory: 'C003', equipmentCategoryDesc: '标品设备', equipmentMode: 'T-600B', equipmentTag: '数控-CNC', locationSn: 'CNC-A3', equipmentSupplier: 'S010', equipmentSupplierName: '台群', equipmentStatus: '1', operationStatus: '1', equipmentRevstop: '1', sequenceNumber: 3, equipmentPurchase: '2025-01-05', equipmentOperating: '2025-01-20', createTime: '2025-01-20 08:00:00' },
  { id: 'N04', workshopCode: 'CNC', equipmentSn: 'A4', equipmentName: 'CNC铣削加工中心', equipmentType: 'T005', equipmentTypeDesc: '数控设备', equipmentCategory: 'C003', equipmentCategoryDesc: '标品设备', equipmentMode: 'VF2', equipmentTag: '数控-CNC', locationSn: 'CNC-A4', equipmentSupplier: 'S011', equipmentSupplierName: '哈斯', equipmentStatus: '1', operationStatus: '1', equipmentRevstop: '1', sequenceNumber: 4, equipmentPurchase: '2025-02-01', equipmentOperating: '2025-02-15', createTime: '2025-02-15 08:00:00' },
  { id: 'N05', workshopCode: 'CNC', equipmentSn: 'A6', equipmentName: 'CNC铣削加工中心', equipmentType: 'T005', equipmentTypeDesc: '数控设备', equipmentCategory: 'C003', equipmentCategoryDesc: '标品设备', equipmentMode: 'NMC630', equipmentTag: '数控-CNC', locationSn: 'CNC-A6', equipmentSupplier: 'S012', equipmentSupplierName: '华中', equipmentStatus: '1', operationStatus: '1', equipmentRevstop: '1', sequenceNumber: 5, equipmentPurchase: '2025-01-15', equipmentOperating: '2025-02-01', createTime: '2025-02-01 08:00:00' },
  { id: 'N06', workshopCode: 'CNC', equipmentSn: 'A7', equipmentName: 'CNC铣磨加工中心', equipmentType: 'T005', equipmentTypeDesc: '数控设备', equipmentCategory: 'C003', equipmentCategoryDesc: '标品设备', equipmentMode: 'T-V856H', equipmentTag: '数控-CNC', locationSn: 'CNC-A7', equipmentSupplier: 'S010', equipmentSupplierName: '台群', equipmentStatus: '1', operationStatus: '1', equipmentRevstop: '1', sequenceNumber: 6, equipmentPurchase: '2025-02-10', equipmentOperating: '2025-02-25', createTime: '2025-02-25 08:00:00' },
  { id: 'N07', workshopCode: 'CNC', equipmentSn: 'C1', equipmentName: 'CNC车削中心', equipmentType: 'T005', equipmentTypeDesc: '数控设备', equipmentCategory: 'C003', equipmentCategoryDesc: '标品设备', equipmentMode: 'C320K TT', equipmentTag: '数控-CNC', locationSn: 'CNC-C1', equipmentSupplier: 'S013', equipmentSupplierName: '广数', equipmentStatus: '1', operationStatus: '1', equipmentRevstop: '1', sequenceNumber: 7, equipmentPurchase: '2025-03-01', equipmentOperating: '2025-03-15', createTime: '2025-03-15 08:00:00' },
  { id: 'N08', workshopCode: 'CNC', equipmentSn: 'D1', equipmentName: 'NC车削加工机', equipmentType: 'T005', equipmentTypeDesc: '数控设备', equipmentCategory: 'C003', equipmentCategoryDesc: '标品设备', equipmentMode: '6146SY', equipmentTag: '数控-CNC', locationSn: 'CNC-D1', equipmentSupplier: 'S014', equipmentSupplierName: '锐锋', equipmentStatus: '1', operationStatus: '1', equipmentRevstop: '1', sequenceNumber: 8, equipmentPurchase: '2025-02-15', equipmentOperating: '2025-03-01', createTime: '2025-03-01 08:00:00' },
  { id: 'N09', workshopCode: 'CNC', equipmentSn: 'INJ-001', equipmentName: '注塑机', equipmentType: 'T006', equipmentTypeDesc: '注塑设备', equipmentCategory: 'C003', equipmentCategoryDesc: '标品设备', equipmentMode: 'MA1200', equipmentTag: '数控-注塑', locationSn: 'INJ-01', equipmentSupplier: 'S015', equipmentSupplierName: '海天国际', equipmentStatus: '1', operationStatus: '1', equipmentRevstop: '1', sequenceNumber: 9, equipmentPurchase: '2025-01-20', equipmentOperating: '2025-02-10', createTime: '2025-02-10 08:00:00' },
  { id: 'N10', workshopCode: 'CNC', equipmentSn: 'INJ-002', equipmentName: '注塑机', equipmentType: 'T006', equipmentTypeDesc: '注塑设备', equipmentCategory: 'C003', equipmentCategoryDesc: '标品设备', equipmentMode: 'MA900', equipmentTag: '数控-注塑', locationSn: 'INJ-02', equipmentSupplier: 'S015', equipmentSupplierName: '海天国际', equipmentStatus: '1', operationStatus: '3', equipmentRevstop: '1', sequenceNumber: 10, equipmentPurchase: '2025-03-10', equipmentOperating: '2025-04-01', createTime: '2025-04-01 08:00:00' },
]

// ── 枚举 ──
const statusEnum = [
  { value: '1', text: '正常', type: 'success' },
  { value: '2', text: '停用', type: 'danger' },
  { value: '3', text: '维修中', type: 'warning' },
  { value: '4', text: '报废', type: 'info' },
]
const operationStatusEnum = [
  { value: '1', text: '运行', type: 'success' },
  { value: '2', text: '停机', type: 'danger' },
  { value: '3', text: '待机', type: 'warning' },
  { value: '4', text: '故障', type: 'danger' },
]
const revstopEnum = [
  { value: '1', text: '启用', type: 'success' },
  { value: '2', text: '停用', type: 'danger' },
]

// ── 设备类型/类别 ──
const typeTree = [
  { key: 'T001', title: '非标设备', parentKey: null, children: [
    { key: 'T001-1', title: '自动化工作站', parentKey: 'T001' },
    { key: 'T001-2', title: '自动化线体', parentKey: 'T001' },
    { key: 'T001-3', title: '半自动设备', parentKey: 'T001' },
  ]},
  { key: 'T002', title: '工具类设备', parentKey: null },
  { key: 'T003', title: '加工类设备', parentKey: null },
  { key: 'T004', title: '测试仪器', parentKey: null },
  { key: 'T005', title: '数控设备', parentKey: null, children: [
    { key: 'T005-1', title: '铣削CNC', parentKey: 'T005' },
    { key: 'T005-2', title: '车铣磨CNC', parentKey: 'T005' },
    { key: 'T005-3', title: '车削NC', parentKey: 'T005' },
  ]},
  { key: 'T006', title: '注塑设备', parentKey: null },
]
const categoryTree = [
  { key: 'C001', title: '重点设备', parentKey: null },
  { key: 'C002', title: '关键设备', parentKey: null },
  { key: 'C003', title: '标品设备', parentKey: null },
  { key: 'C004', title: '安全设施', parentKey: null },
  { key: 'C007', title: '手持电动工具', parentKey: null },
]

export default [
  // ── 设备档案（按车间过滤） ──
  {
    url: '/admin-api/equipment/optEquipment/list',
    method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      let data = filterByWorkshop(equipmentList, ws)
      if (query?.equipmentSn) data = data.filter(e => e.equipmentSn.includes(query.equipmentSn))
      if (query?.equipmentName) data = data.filter(e => e.equipmentName.includes(query.equipmentName))
      if (query?.equipmentType) data = data.filter(e => e.equipmentType === query.equipmentType)
      if (query?.equipmentCategory) data = data.filter(e => e.equipmentCategory === query.equipmentCategory)
      return { code: 200, data: paginate(data, query?.pageNo, query?.pageSize) }
    }
  },
  {
    url: '/admin-api/equipment/optEquipment/queryById',
    method: 'get',
    response: ({ query }) => ({ code: 200, data: equipmentList.find(e => e.id === query?.id) || null })
  },
  { url: '/admin-api/equipment/optEquipment/add', method: 'post', response: () => ({ code: 200, data: { id: String(Date.now()) } }) },
  { url: '/admin-api/equipment/optEquipment/edit', method: 'put', response: () => ({ code: 200, data: true }) },
  { url: '/admin-api/equipment/optEquipment/delete', method: 'delete', response: () => ({ code: 200, data: true }) },
  { url: '/admin-api/equipment/optEquipment/deleteBatch', method: 'delete', response: () => ({ code: 200, data: true }) },
  { url: '/admin-api/equipment/optEquipment/listOfStatus', method: 'get', response: () => ({ code: 200, data: statusEnum }) },
  { url: '/admin-api/equipment/optEquipment/listOfOperationStatus', method: 'get', response: () => ({ code: 200, data: operationStatusEnum }) },
  { url: '/admin-api/equipment/optEquipment/listOfMode', method: 'get', response: () => ({ code: 200, data: revstopEnum }) },

  // ── 设备类型下拉 ──
  { url: '/admin-api/mdm/eamBaseEquipmentType/scanDeviceTypeList', method: 'get', response: () => ({
    code: 200,
    data: [
      { typeCode: 'T001', typeName: '非标设备' },
      { typeCode: 'T002', typeName: '工具类设备' },
      { typeCode: 'T003', typeName: '加工类设备' },
      { typeCode: 'T004', typeName: '测试仪器' },
      { typeCode: 'T005', typeName: '数控设备' },
      { typeCode: 'T006', typeName: '注塑设备' },
    ]
  })},

  // ── 设备类型 ──
  { url: '/admin-api/mdm/eamBaseEquipmentType/list', method: 'get', response: ({ query }) => ({
    code: 200,
    data: paginate(typeTree.flatMap(t => [
      { id: t.key, code: t.key, name: t.title, parentCode: '', seq: 0, createTime: '2025-01-01' },
      ...(t.children || []).map(c => ({ id: c.key, code: c.key, name: c.title, parentCode: t.key, seq: 0, createTime: '2025-01-01' }))
    ]), query?.pageNo, query?.pageSize || 50)
  })},
  { url: '/admin-api/mdm/eamBaseEquipmentType/tree', method: 'get', response: () => ({ code: 200, data: typeTree }) },

  // ── 设备类别 ──
  { url: '/admin-api/mdm/eamBaseEquipmentCategory/list', method: 'get', response: ({ query }) => ({
    code: 200,
    data: paginate(categoryTree.map(c => ({ id: c.key, code: c.key, name: c.title, parentCode: '', seq: 0, createTime: '2025-01-01' })), query?.pageNo, query?.pageSize || 50)
  })},
  { url: '/admin-api/mdm/eamBaseEquipmentCategory/tree', method: 'get', response: () => ({ code: 200, data: categoryTree }) },

  // ── 设备履历（按车间过滤） ──
  {
    url: '/admin-api/equipment/deviceLedger/list',
    method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      let data = filterByWorkshop(equipmentList, ws)
      if (query?.equipmentSn) data = data.filter(e => e.equipmentSn.includes(query.equipmentSn))
      return { code: 200, data: paginate(data, query?.pageNo, query?.pageSize) }
    }
  },

  // ── 供应商 ──
  { url: '/admin-api/equipment/optSupplier/list', method: 'get', response: ({ query }) => {
    const suppliers = [
      { id: 'S001', code: 'S001', name: '华诚精密', category: '设备', status: '1', createTime: '2025-01-01' },
      { id: 'S004', code: 'S004', name: '自研（自动化团队）', category: '非标', status: '1', createTime: '2025-01-01' },
      { id: 'S009', code: 'S009', name: '乔峰', category: 'CNC', status: '1', createTime: '2025-01-01' },
      { id: 'S010', code: 'S010', name: '台群', category: 'CNC', status: '1', createTime: '2025-01-01' },
      { id: 'S011', code: 'S011', name: '哈斯', category: 'CNC', status: '1', createTime: '2025-01-01' },
      { id: 'S012', code: 'S012', name: '华中', category: 'CNC', status: '1', createTime: '2025-01-01' },
      { id: 'S013', code: 'S013', name: '广数', category: 'CNC', status: '1', createTime: '2025-01-01' },
      { id: 'S014', code: 'S014', name: '锐锋', category: 'CNC', status: '1', createTime: '2025-01-01' },
      { id: 'S015', code: 'S015', name: '海天国际', category: '注塑', status: '1', createTime: '2025-01-01' },
      { id: 'S016', code: 'S016', name: '快克智能', category: '设备', status: '1', createTime: '2025-01-01' },
    ]
    return { code: 200, data: paginate(suppliers, query?.pageNo, query?.pageSize) }
  }},
] as MockMethod[]

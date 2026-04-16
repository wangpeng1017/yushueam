/**
 * Mock: 保养/点检/维修/备件 工单数据
 * 三车间独立数据，通过 token 识别数据权限
 */

import { getWorkshopByToken } from './auth'

function paginate(list: any[], pageNo = 1, pageSize = 10) {
  const start = (Number(pageNo) - 1) * Number(pageSize)
  return { records: list.slice(start, start + Number(pageSize)), total: list.length }
}
function filterByWorkshop(list: any[], ws: string) {
  if (ws === 'ALL') return list
  return list.filter(item => item.workshopCode === ws)
}

// ══════════════════════════════════════════════
// 保养标准
// ══════════════════════════════════════════════
const maintenanceStandards = [
  { id: 'MS-C01', workshopCode: 'C', code: 'MS-C-001', name: '绕线机月保养标准', equipmentTypeCode: 'T003', equipmentTypeDesc: '加工类设备', remark: '剪刀部润滑/工件夹紧部/XYZ轴/张力器', createTime: '2025-01-10' },
  { id: 'MS-C02', workshopCode: 'C', code: 'MS-C-002', name: 'PACK线季度保养标准', equipmentTypeCode: 'T001', equipmentTypeDesc: '非标设备', remark: '适用于C端PACK线', createTime: '2025-02-01' },
  { id: 'MS-B01', workshopCode: 'B', code: 'MS-B-001', name: '自动锁螺丝机月保养标准', equipmentTypeCode: 'T003', equipmentTypeDesc: '加工类设备', remark: '台面清洁/气压检查/按钮/治具/急停', createTime: '2025-01-15' },
  { id: 'MS-B02', workshopCode: 'B', code: 'MS-B-002', name: '电阻焊接机月保养标准', equipmentTypeCode: 'T003', equipmentTypeDesc: '加工类设备', remark: '适用于B端焊接设备', createTime: '2025-03-01' },
  { id: 'MS-N01', workshopCode: 'CNC', code: 'MS-N-001', name: 'CNC铣削月保养标准', equipmentTypeCode: 'T005', equipmentTypeDesc: '数控设备', remark: '适用于台群/乔峰/哈斯等CNC设备', createTime: '2025-01-15' },
  { id: 'MS-N02', workshopCode: 'CNC', code: 'MS-N-002', name: '注塑机季度保养标准', equipmentTypeCode: 'T006', equipmentTypeDesc: '注塑设备', remark: '适用于海天注塑机', createTime: '2025-02-01' },
]

// ══════════════════════════════════════════════
// 保养工单
// ══════════════════════════════════════════════
const maintenanceWorkOrders = [
  { id: 'MW-C01', workshopCode: 'C', code: 'MW-C-0001', planName: '绕线机月保养计划', equipmentSn: 'EW-LP-001', equipmentName: '轻型手动压机', equipmentTypeDesc: '加工类设备', equipmentModel: 'LP-50', equipmentSupplierName: '华诚精密', maintenanceLevel: '1', maintenanceLevelDesc: '一级保养', status: '4', personName: '陆钟', workStartTime: '2026-04-01 08:00', overdueTime: '2026-04-01 18:00', startTime: '2026-04-01 09:15', endTime: '2026-04-01 10:30', useTime: '1小时15分', remark: '', createByPersonName: '系统', createTime: '2026-04-01 08:00' },
  { id: 'MW-C02', workshopCode: 'C', code: 'MW-C-0002', planName: 'PACK线季度保养计划', equipmentSn: 'EW-BPIL-001', equipmentName: 'PACK线', equipmentTypeDesc: '非标设备', equipmentModel: 'BPIL-A1', equipmentSupplierName: '自研', maintenanceLevel: '2', maintenanceLevelDesc: '二级保养', status: '1', personName: '', workStartTime: '2026-04-20 08:00', overdueTime: '2026-04-20 18:00', startTime: '', endTime: '', useTime: '', remark: '', createByPersonName: '系统', createTime: '2026-04-14 08:00' },
  { id: 'MW-B01', workshopCode: 'B', code: 'MW-B-0001', planName: '锁螺丝机月保养计划', equipmentSn: 'B-20000015', equipmentName: '自动锁螺丝机', equipmentTypeDesc: '加工类设备', equipmentModel: 'ASM-4', equipmentSupplierName: '快克智能', maintenanceLevel: '1', maintenanceLevelDesc: '一级保养', status: '2', personName: '买盼', workStartTime: '2026-04-15 08:00', overdueTime: '2026-04-15 18:00', startTime: '', endTime: '', useTime: '', remark: '', createByPersonName: '系统', createTime: '2026-04-14 08:00' },
  { id: 'MW-N01', workshopCode: 'CNC', code: 'MW-N-0001', planName: 'CNC月保养计划', equipmentSn: 'A1', equipmentName: 'CNC铣削加工中心', equipmentTypeDesc: '数控设备', equipmentModel: 'T-7', equipmentSupplierName: '乔峰', maintenanceLevel: '1', maintenanceLevelDesc: '一级保养', status: '4', personName: '刚嘉成', workStartTime: '2026-04-01 08:00', overdueTime: '2026-04-01 18:00', startTime: '2026-04-01 08:30', endTime: '2026-04-01 10:00', useTime: '1小时30分', remark: '', createByPersonName: '系统', createTime: '2026-04-01 08:00' },
  { id: 'MW-N02', workshopCode: 'CNC', code: 'MW-N-0002', planName: '注塑机季度保养计划', equipmentSn: 'INJ-001', equipmentName: '注塑机', equipmentTypeDesc: '注塑设备', equipmentModel: 'MA1200', equipmentSupplierName: '海天国际', maintenanceLevel: '2', maintenanceLevelDesc: '二级保养', status: '1', personName: '', workStartTime: '2026-04-25 08:00', overdueTime: '2026-04-25 18:00', startTime: '', endTime: '', useTime: '', remark: '', createByPersonName: '系统', createTime: '2026-04-20 08:00' },
]

// ══════════════════════════════════════════════
// 故障报修
// ══════════════════════════════════════════════
const failureWorkOrders = [
  { id: 'FW-C01', workshopCode: 'C', failureCode: 'FW-C-0001', equipmentSn: 'EW-LP-001', equipmentName: '轻型手动压机', equipmentType: 'T003', equipmentTypeName: '加工类设备', equipmentMode: 'LP-50', equipmentSupplierName: '华诚精密', breakdownTime: '2026-03-05 10:30', personName: '高学才', breakdownLevel: '2', breakdownLevelText: '一般', breakdownType: '1', breakdownTypeText: '电气故障', repairDegree: '2', repairDegreeText: '普通', remark: '标定电脑485通讯异常', status: '2', executeStatus: '3', auditorIdea: '同意维修', createByPersonName: '高学才', createTime: '2026-03-05 10:35' },
  { id: 'FW-C02', workshopCode: 'C', failureCode: 'FW-C-0002', equipmentSn: 'EW-CCM-001', equipmentName: '三防漆涂覆机', equipmentType: 'T001', equipmentTypeName: '非标设备', equipmentMode: 'CCM-3F', equipmentSupplierName: '诺信EFD', breakdownTime: '2026-04-12 14:00', personName: '刘朋朋', breakdownLevel: '3', breakdownLevelText: '轻微', breakdownType: '2', breakdownTypeText: '机械故障', repairDegree: '3', repairDegreeText: '低', remark: '喷嘴堵塞', status: '1', executeStatus: '1', auditorIdea: '', createByPersonName: '刘朋朋', createTime: '2026-04-12 14:05' },
  { id: 'FW-B01', workshopCode: 'B', failureCode: 'FW-B-0001', equipmentSn: 'B-20000015', equipmentName: '自动锁螺丝机', equipmentType: 'T003', equipmentTypeName: '加工类设备', equipmentMode: 'ASM-4', equipmentSupplierName: '快克智能', breakdownTime: '2026-04-08 09:15', personName: '严欢欢', breakdownLevel: '2', breakdownLevelText: '一般', breakdownType: '2', breakdownTypeText: '机械故障', repairDegree: '2', repairDegreeText: '普通', remark: '锁付机构出丝不畅，卡料', status: '2', executeStatus: '3', auditorIdea: '同意维修', createByPersonName: '严欢欢', createTime: '2026-04-08 09:20' },
  { id: 'FW-N01', workshopCode: 'CNC', failureCode: 'FW-N-0001', equipmentSn: 'A4', equipmentName: 'CNC铣削加工中心', equipmentType: 'T005', equipmentTypeName: '数控设备', equipmentMode: 'VF2', equipmentSupplierName: '哈斯', breakdownTime: '2026-04-10 14:20', personName: '陈爽', breakdownLevel: '1', breakdownLevelText: '紧急', breakdownType: '2', breakdownTypeText: '机械故障', repairDegree: '1', repairDegreeText: '紧急', remark: '主轴异响，疑似轴承磨损', status: '1', executeStatus: '1', auditorIdea: '', createByPersonName: '陈爽', createTime: '2026-04-10 14:25' },
  { id: 'FW-N02', workshopCode: 'CNC', failureCode: 'FW-N-0002', equipmentSn: 'INJ-001', equipmentName: '注塑机', equipmentType: 'T006', equipmentTypeName: '注塑设备', equipmentMode: 'MA1200', equipmentSupplierName: '海天国际', breakdownTime: '2026-04-14 11:00', personName: '彭向', breakdownLevel: '2', breakdownLevelText: '一般', breakdownType: '1', breakdownTypeText: '电气故障', repairDegree: '2', repairDegreeText: '普通', remark: '温控模块显示异常', status: '2', executeStatus: '2', auditorIdea: '同意', createByPersonName: '彭向', createTime: '2026-04-14 11:05' },
]

// ══════════════════════════════════════════════
// 维修工单
// ══════════════════════════════════════════════
const repairWorkOrders = [
  { id: 'RW-C01', workshopCode: 'C', repairCode: 'RW-C-0001', equipmentSn: 'EW-LP-001', equipmentName: '轻型手动压机', equipmentTypeName: '加工类设备', equipmentMode: 'LP-50', equipmentSupplierName: '华诚精密', sourceType: '1', sourceTypeText: '故障报修', breakdownTime: '2026-03-05 10:30', breakdownLevelText: '一般', breakdownTypeText: '电气故障', repairDegreeText: '普通', remark: '标定电脑485通讯异常', status: '5', repairPersonName: 'XXX', repairLevelText: '小修', repairTypeText: '电气维修', needShutdownText: '否', shutdownDurationText: '', repairBeginTime: '2026-03-05 11:00', repairEndTime: '2026-03-05 11:10', repairDurationText: '10分钟', failureWorkOrderCode: 'FW-C-0001', presentPersonName: '高学才', presentTime: '2026-03-05 10:35', confirmPersonName: '高学才', confirmTime: '2026-03-05 11:15', repairRecord: '更换485端子，通讯恢复正常', createByPersonName: '刘淇', createTime: '2026-03-05 10:40' },
  { id: 'RW-B01', workshopCode: 'B', repairCode: 'RW-B-0001', equipmentSn: 'B-20000015', equipmentName: '自动锁螺丝机', equipmentTypeName: '加工类设备', equipmentMode: 'ASM-4', equipmentSupplierName: '快克智能', sourceType: '1', sourceTypeText: '故障报修', breakdownTime: '2026-04-08 09:15', breakdownLevelText: '一般', breakdownTypeText: '机械故障', repairDegreeText: '普通', remark: '锁付机构出丝不畅', status: '5', repairPersonName: '买盼', repairLevelText: '小修', repairTypeText: '机械维修', needShutdownText: '否', shutdownDurationText: '', repairBeginTime: '2026-04-08 10:00', repairEndTime: '2026-04-08 10:20', repairDurationText: '20分钟', failureWorkOrderCode: 'FW-B-0001', presentPersonName: '严欢欢', presentTime: '2026-04-08 09:20', confirmPersonName: '严欢欢', confirmTime: '2026-04-08 10:25', repairRecord: '清理供丝通道堵塞碎屑，更换批头', createByPersonName: '买盼', createTime: '2026-04-08 09:25' },
  { id: 'RW-N01', workshopCode: 'CNC', repairCode: 'RW-N-0001', equipmentSn: 'INJ-001', equipmentName: '注塑机', equipmentTypeName: '注塑设备', equipmentMode: 'MA1200', equipmentSupplierName: '海天国际', sourceType: '1', sourceTypeText: '故障报修', breakdownTime: '2026-04-14 11:00', breakdownLevelText: '一般', breakdownTypeText: '电气故障', repairDegreeText: '普通', remark: '温控模块显示异常', status: '3', repairPersonName: '刚嘉成', repairLevelText: '大修', repairTypeText: '电气维修', needShutdownText: '是', shutdownDurationText: '2小时', repairBeginTime: '2026-04-14 13:00', repairEndTime: '', repairDurationText: '', failureWorkOrderCode: 'FW-N-0002', presentPersonName: '彭向', presentTime: '2026-04-14 11:05', confirmPersonName: '', confirmTime: '', repairRecord: '', createByPersonName: '刚嘉成', createTime: '2026-04-14 11:30' },
]

// ══════════════════════════════════════════════
// 点检工单
// ══════════════════════════════════════════════
const spotInspectionWorks = [
  { id: 'SW-C01', workshopCode: 'C', workCode: 'SW-C-0001', planName: '绕线机日常点检计划', status: '3', hasParamPlan: '2', inspectionType: '1', spotInspection: '8/8', workStartTime: '2026-04-15 08:00', overdueTime: '2026-04-15 09:00', startTime: '2026-04-15 08:05', endTime: '2026-04-15 08:45', personName: '陆钟', createTime: '2026-04-15 08:00' },
  { id: 'SW-C02', workshopCode: 'C', workCode: 'SW-C-0002', planName: '绕线机日常点检计划', status: '2', hasParamPlan: '2', inspectionType: '1', spotInspection: '3/8', workStartTime: '2026-04-16 08:00', overdueTime: '2026-04-16 09:00', startTime: '2026-04-16 08:10', endTime: '', personName: '陆钟', createTime: '2026-04-16 08:00' },
  { id: 'SW-B01', workshopCode: 'B', workCode: 'SW-B-0001', planName: '锁螺丝机日常点检计划', status: '3', hasParamPlan: '2', inspectionType: '1', spotInspection: '5/5', workStartTime: '2026-04-15 08:00', overdueTime: '2026-04-15 09:00', startTime: '2026-04-15 08:00', endTime: '2026-04-15 08:30', personName: '买盼', createTime: '2026-04-15 08:00' },
  { id: 'SW-B02', workshopCode: 'B', workCode: 'SW-B-0002', planName: 'B端电子车间巡检工单', status: '1', hasParamPlan: '2', inspectionType: '2', spotInspection: '0/5', workStartTime: '2026-04-16 08:00', overdueTime: '2026-04-16 09:00', startTime: '', endTime: '', personName: '', createTime: '2026-04-16 08:00' },
  { id: 'SW-N01', workshopCode: 'CNC', workCode: 'SW-N-0001', planName: 'CNC日常点检计划', status: '3', hasParamPlan: '1', inspectionType: '1', spotInspection: '30/30', workStartTime: '2026-04-15 08:00', overdueTime: '2026-04-15 10:00', startTime: '2026-04-15 08:00', endTime: '2026-04-15 09:30', personName: '刚嘉成', createTime: '2026-04-15 08:00' },
  { id: 'SW-N02', workshopCode: 'CNC', workCode: 'SW-N-0002', planName: '数控车间巡检工单', status: '2', hasParamPlan: '1', inspectionType: '2', spotInspection: '12/30', workStartTime: '2026-04-16 08:00', overdueTime: '2026-04-16 10:00', startTime: '2026-04-16 08:10', endTime: '', personName: '刚嘉成', createTime: '2026-04-16 08:00' },
]

// ══════════════════════════════════════════════
// 备件（共用，按使用记录区分车间）
// ══════════════════════════════════════════════
const spareParts = [
  { id: 'SP01', number: 'BJ-001', name: '485通讯端子', specification: '标准', unitName: '个', materialGroupName: '设备配件', actualStock: 12, maxStock: 20, minStock: 5, relatedEquipment: 'EW-LP-001' },
  { id: 'SP02', number: 'BJ-002', name: 'NSK PS-2润滑脂', specification: '0.5g/次', unitName: '管', materialGroupName: '耗材', actualStock: 3, maxStock: 10, minStock: 3, relatedEquipment: 'C端绕线机类' },
  { id: 'SP03', number: 'BJ-003', name: '张力器羊毛轮', specification: '标准', unitName: '个', materialGroupName: '设备配件', actualStock: 8, maxStock: 15, minStock: 5, relatedEquipment: 'C端绕线机类' },
  { id: 'SP04', number: 'BJ-004', name: '急停按钮', specification: 'φ22', unitName: '个', materialGroupName: '设备配件', actualStock: 2, maxStock: 10, minStock: 5, relatedEquipment: '通用' },
  { id: 'SP05', number: 'BJ-005', name: '气管接头', specification: '6mm', unitName: '个', materialGroupName: '设备配件', actualStock: 20, maxStock: 30, minStock: 10, relatedEquipment: '通用' },
  { id: 'SP06', number: 'BJ-006', name: '批头', specification: 'PH2', unitName: '个', materialGroupName: '设备配件', actualStock: 1, maxStock: 10, minStock: 3, relatedEquipment: 'B端锁螺丝机' },
  { id: 'SP07', number: 'BJ-007', name: 'CNC主轴轴承', specification: '7014C', unitName: '套', materialGroupName: '设备配件', actualStock: 2, maxStock: 5, minStock: 2, relatedEquipment: 'CNC设备' },
  { id: 'SP08', number: 'BJ-008', name: '注塑机温控模块', specification: 'TC-48', unitName: '块', materialGroupName: '设备配件', actualStock: 0, maxStock: 3, minStock: 1, relatedEquipment: 'INJ-001/002' },
]

const sparePartRecords = [
  { id: 'SPR01', workshopCode: 'C', sparePartNumber: 'BJ-001', sparePartName: '485通讯端子', quantity: 1, operationType: '出库', relatedWorkOrder: 'RW-C-0001', operatorName: 'XXX', operateTime: '2026-03-05 11:05', remark: 'C端维修领用' },
  { id: 'SPR02', workshopCode: 'C', sparePartNumber: 'BJ-002', sparePartName: 'NSK PS-2润滑脂', quantity: 3, operationType: '出库', relatedWorkOrder: 'MW-C-0001', operatorName: '陆钟', operateTime: '2026-04-01 09:20', remark: 'C端保养领用' },
  { id: 'SPR03', workshopCode: 'B', sparePartNumber: 'BJ-006', sparePartName: '批头', quantity: 2, operationType: '出库', relatedWorkOrder: 'RW-B-0001', operatorName: '买盼', operateTime: '2026-04-08 10:10', remark: 'B端维修领用' },
  { id: 'SPR04', workshopCode: 'CNC', sparePartNumber: 'BJ-008', sparePartName: '注塑机温控模块', quantity: 1, operationType: '出库', relatedWorkOrder: 'RW-N-0001', operatorName: '刚嘉成', operateTime: '2026-04-14 13:30', remark: '数控机加维修领用' },
  { id: 'SPR05', workshopCode: 'CNC', sparePartNumber: 'BJ-007', sparePartName: 'CNC主轴轴承', quantity: 1, operationType: '退库', relatedWorkOrder: 'RW-N-0001', operatorName: '刚嘉成', operateTime: '2026-04-14 15:00', remark: '维修后未使用退回' },
]

// ── 枚举 ──
const workOrderStatus = [ { value: '1', text: '待派工', type: 'info' }, { value: '2', text: '已派工', type: 'warning' }, { value: '3', text: '执行中', type: '' }, { value: '4', text: '已完成', type: 'success' } ]
const maintenanceLevelEnum = [ { value: '1', text: '一级保养' }, { value: '2', text: '二级保养' }, { value: '3', text: '三级保养' } ]
const failureStatusEnum = [ { value: '1', text: '待审核', type: 'info' }, { value: '2', text: '已通过', type: 'success' }, { value: '3', text: '已驳回', type: 'danger' } ]
const executeStatusEnum = [ { value: '1', text: '待执行', type: 'info' }, { value: '2', text: '执行中', type: '' }, { value: '3', text: '已完成', type: 'success' } ]
const breakdownLevelEnum = [ { value: '1', text: '紧急', type: 'danger' }, { value: '2', text: '一般', type: 'warning' }, { value: '3', text: '轻微', type: 'info' } ]
const breakdownTypeEnum = [ { value: '1', text: '电气故障' }, { value: '2', text: '机械故障' }, { value: '3', text: '软件故障' }, { value: '4', text: '其他' } ]
const repairDegreeEnum = [ { value: '1', text: '紧急', type: 'danger' }, { value: '2', text: '普通' }, { value: '3', text: '低', type: 'info' } ]
const repairStatusEnum = [ { value: '1', text: '待派工', type: 'info' }, { value: '2', text: '已派工', type: 'warning' }, { value: '3', text: '维修中' }, { value: '4', text: '已完工', type: 'success' }, { value: '5', text: '已确认', type: 'success' } ]
const inspectionStatusEnum = [ { value: '1', text: '待派工', type: 'info' }, { value: '2', text: '执行中' }, { value: '3', text: '已完成', type: 'success' } ]

// ── 通用handler生成器 ──
function listHandler(allData: any[], url: string, method = 'get') {
  return {
    url: '/admin-api' + url,
    method,
    response: ({ query, headers }: any) => {
      const ws = getWorkshopByToken(headers?.authorization)
      const data = filterByWorkshop(allData, ws)
      return { code: 200, data: paginate(data, query?.pageNo, query?.pageSize) }
    }
  }
}

export default [
  // ══ 保养标准 ══
  listHandler(maintenanceStandards, '/workOrder/eamMaintenanceStandard/list'),
  { url: '/admin-api/workOrder/eamMaintenanceStandard/queryById', method: 'get', response: ({ query }) => ({ code: 200, data: maintenanceStandards.find(s => s.id === query?.id) }) },
  { url: '/admin-api/workOrder/eamMaintenanceStandard/add', method: 'post', response: () => ({ code: 200, data: { id: String(Date.now()) } }) },
  { url: '/admin-api/workOrder/eamMaintenanceStandard/edit', method: 'put', response: () => ({ code: 200, data: true }) },
  { url: '/admin-api/workOrder/eamMaintenanceStandard/delete', method: 'delete', response: () => ({ code: 200, data: true }) },

  // ══ 保养计划 ══
  {
    url: '/admin-api/workOrder/eamMaintenancePlan/list', method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      const plans = [
        { id: 'MP-C01', workshopCode: 'C', code: 'MP-C-001', name: '绕线机月保养计划', equipmentTypeDesc: '加工类设备', maintenanceLevel: '1', planStartTime: '2025-01-01', planEndTime: '2026-12-31', periodicFrequencyType: '3', status: '1', createTime: '2025-01-01' },
        { id: 'MP-B01', workshopCode: 'B', code: 'MP-B-001', name: '锁螺丝机月保养计划', equipmentTypeDesc: '加工类设备', maintenanceLevel: '1', planStartTime: '2025-02-01', planEndTime: '2026-12-31', periodicFrequencyType: '3', status: '1', createTime: '2025-02-01' },
        { id: 'MP-N01', workshopCode: 'CNC', code: 'MP-N-001', name: 'CNC月保养计划', equipmentTypeDesc: '数控设备', maintenanceLevel: '1', planStartTime: '2025-02-01', planEndTime: '2026-12-31', periodicFrequencyType: '3', status: '1', createTime: '2025-02-01' },
        { id: 'MP-N02', workshopCode: 'CNC', code: 'MP-N-002', name: '注塑机季度保养计划', equipmentTypeDesc: '注塑设备', maintenanceLevel: '2', planStartTime: '2025-03-01', planEndTime: '2026-12-31', periodicFrequencyType: '3', status: '1', createTime: '2025-03-01' },
      ]
      return { code: 200, data: paginate(filterByWorkshop(plans, ws), query?.pageNo, query?.pageSize) }
    }
  },

  // ══ 保养工单 ══
  listHandler(maintenanceWorkOrders, '/workOrder/eamMaintenanceWork/list'),
  { url: '/admin-api/workOrder/eamMaintenanceWork/queryById', method: 'get', response: ({ query }) => ({ code: 200, data: maintenanceWorkOrders.find(w => w.id === query?.id) || maintenanceWorkOrders[0] }) },
  { url: '/admin-api/workOrder/eamMaintenanceWork/saveMaintenance', method: 'post', response: () => ({ code: 200, data: { id: String(Date.now()) } }) },
  { url: '/admin-api/workOrder/eamMaintenanceWork/dispatch', method: 'post', response: () => ({ code: 200, data: true }) },
  { url: '/admin-api/workOrder/eamMaintenanceWork/complete', method: 'post', response: () => ({ code: 200, data: true }) },
  { url: '/admin-api/workOrder/eamMaintenanceWork/delete', method: 'delete', response: () => ({ code: 200, data: true }) },
  { url: '/admin-api/workOrder/eamMaintenanceWork/listOfStatus', method: 'get', response: () => ({ code: 200, data: workOrderStatus }) },
  { url: '/admin-api/workOrder/eamMaintenanceWork/listOfMaintenanceLevel', method: 'get', response: () => ({ code: 200, data: maintenanceLevelEnum }) },

  // ══ 故障报修 ══
  listHandler(failureWorkOrders, '/workOrder/eamFailureWorkOrder/list'),
  { url: '/admin-api/workOrder/eamFailureWorkOrder/queryById', method: 'get', response: ({ query }) => ({ code: 200, data: failureWorkOrders.find(f => f.id === query?.id) || failureWorkOrders[0] }) },
  { url: '/admin-api/workOrder/eamFailureWorkOrder/add', method: 'post', response: () => ({ code: 200, data: { id: String(Date.now()) } }) },
  { url: '/admin-api/workOrder/eamFailureWorkOrder/listOfStatus', method: 'get', response: () => ({ code: 200, data: failureStatusEnum }) },
  { url: '/admin-api/workOrder/eamFailureWorkOrder/listOfExecuteStatus', method: 'get', response: () => ({ code: 200, data: executeStatusEnum }) },
  { url: '/admin-api/workOrder/eamFailureWorkOrder/listOfBreakdownLevel', method: 'get', response: () => ({ code: 200, data: breakdownLevelEnum }) },
  { url: '/admin-api/workOrder/eamFailureWorkOrder/listOfBreakdownType', method: 'get', response: () => ({ code: 200, data: breakdownTypeEnum }) },
  { url: '/admin-api/workOrder/eamFailureWorkOrder/listOfRepairDegree', method: 'get', response: () => ({ code: 200, data: repairDegreeEnum }) },

  // ══ 维修工单 ══
  listHandler(repairWorkOrders, '/workOrder/eamRepairWorkOrder/list'),
  { url: '/admin-api/workOrder/eamRepairWorkOrder/queryById', method: 'get', response: ({ query }) => ({ code: 200, data: repairWorkOrders.find(r => r.id === query?.id) || repairWorkOrders[0] }) },
  { url: '/admin-api/workOrder/eamRepairWorkOrder/listOfStatus', method: 'get', response: () => ({ code: 200, data: repairStatusEnum }) },
  { url: '/admin-api/workOrder/eamRepairWorkOrder/listOfSourceType', method: 'get', response: () => ({ code: 200, data: [{ value: '1', text: '故障报修' }, { value: '2', text: '点检异常' }, { value: '3', text: '巡检异常' }] }) },

  // ══ 点检标准 ══
  {
    url: '/admin-api/workOrder/eamSpotInspectionStandard/list', method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      const standards = [
        { id: 'SIS-C01', workshopCode: 'C', code: 'SIS-C-001', name: '绕线机日常点检标准', equipmentTypeText: '加工类设备', inspectionType: '1', remark: '日检6项+月检4项', createTime: '2025-01-01' },
        { id: 'SIS-C02', workshopCode: 'C', code: 'SIS-C-002', name: 'C端电子车间巡检标准', equipmentTypeText: '', inspectionType: '2', remark: '环境巡视、温湿度、异常声响', createTime: '2025-02-01' },
        { id: 'SIS-B01', workshopCode: 'B', code: 'SIS-B-001', name: '自动锁螺丝机日常点检标准', equipmentTypeText: '加工类设备', inspectionType: '1', remark: '日检6项：外观/电源/面板/锁付/夹具/耗材', createTime: '2025-01-01' },
        { id: 'SIS-N01', workshopCode: 'CNC', code: 'SIS-N-001', name: 'CNC日常点检标准', equipmentTypeText: '数控设备', inspectionType: '1', remark: '含参数点检', createTime: '2025-02-01' },
        { id: 'SIS-N02', workshopCode: 'CNC', code: 'SIS-N-002', name: '数控车间巡检标准', equipmentTypeText: '', inspectionType: '2', remark: '设备运行状态巡视', createTime: '2025-03-01' },
      ]
      return { code: 200, data: paginate(filterByWorkshop(standards, ws), query?.pageNo, query?.pageSize) }
    }
  },

  // ══ 点检计划 ══
  {
    url: '/admin-api/workOrder/eamSpotInspectionPlan/list', method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      const plans = [
        { id: 'SIP-C01', workshopCode: 'C', code: 'SP-C-001', name: '绕线机日常点检计划', equipmentTypeText: '加工类设备', inspectionType: '1', startDate: '2025-01-01', endDate: '2026-12-31', periodicFrequencyType: '1', status: '1', createTime: '2025-01-01' },
        { id: 'SIP-C02', workshopCode: 'C', code: 'SP-C-002', name: 'C端电子车间巡检计划', equipmentTypeText: '', inspectionType: '2', startDate: '2025-02-01', endDate: '2026-12-31', periodicFrequencyType: '1', status: '1', createTime: '2025-02-01' },
        { id: 'SIP-B01', workshopCode: 'B', code: 'SP-B-001', name: '锁螺丝机日常点检计划', equipmentTypeText: '加工类设备', inspectionType: '1', startDate: '2025-02-01', endDate: '2026-12-31', periodicFrequencyType: '1', status: '1', createTime: '2025-02-01' },
        { id: 'SIP-N01', workshopCode: 'CNC', code: 'SP-N-001', name: 'CNC日常点检计划', equipmentTypeText: '数控设备', inspectionType: '1', startDate: '2025-02-01', endDate: '2026-12-31', periodicFrequencyType: '1', status: '1', createTime: '2025-02-01' },
      ]
      return { code: 200, data: paginate(filterByWorkshop(plans, ws), query?.pageNo, query?.pageSize) }
    }
  },

  // ══ 点检工单 ══
  listHandler(spotInspectionWorks, '/workOrder/eamSpotInspectionWork/list'),
  { url: '/admin-api/workOrder/eamSpotInspectionWork/queryById', method: 'get', response: ({ query }) => ({ code: 200, data: spotInspectionWorks.find(s => s.id === query?.id) || spotInspectionWorks[0] }) },
  { url: '/admin-api/workOrder/eamSpotInspectionWork/listOfStatus', method: 'get', response: () => ({ code: 200, data: inspectionStatusEnum }) },

  // ══ 点检参数配置 ══
  { url: '/admin-api/workOrder/eamSpotInspectionParamConf/list', method: 'get', response: ({ query }) => ({ code: 200, data: paginate([], query?.pageNo, query?.pageSize) }) },

  // ══ 点检记录 ══
  { url: '/admin-api/workOrder/eamSpotInspectionWork/recordList', method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      const completed = filterByWorkshop(spotInspectionWorks.filter(s => s.status === '3'), ws)
      return { code: 200, data: paginate(completed, query?.pageNo, query?.pageSize) }
    }
  },

  // ══ 备件分类 ══
  { url: '/admin-api/work/eamSparePartClassification/list', method: 'get', response: ({ query }) => ({
    code: 200,
    data: paginate([
      { id: 'SPC01', code: 'SPC01', name: '设备配件', parentCode: '', seq: 1, createTime: '2025-01-01' },
      { id: 'SPC02', code: 'SPC02', name: '工具配件', parentCode: '', seq: 2, createTime: '2025-01-01' },
      { id: 'SPC03', code: 'SPC03', name: '耗材', parentCode: '', seq: 3, createTime: '2025-01-01' },
    ], query?.pageNo, query?.pageSize)
  })},
  { url: '/admin-api/work/eamSparePartClassification/tree', method: 'get', response: () => ({
    code: 200, data: [
      { key: 'SPC01', title: '设备配件', parentKey: null },
      { key: 'SPC02', title: '工具配件', parentKey: null },
      { key: 'SPC03', title: '耗材', parentKey: null },
    ]
  })},

  // ══ 备件库查询（共用） ══
  { url: '/admin-api/work/eamSparePartSearch/list', method: 'get', response: ({ query }) => ({ code: 200, data: paginate(spareParts, query?.pageNo, query?.pageSize) }) },

  // ══ 备件使用记录（按车间过滤） ══
  {
    url: '/admin-api/work/eamSparePartRecord/list', method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      return { code: 200, data: paginate(filterByWorkshop(sparePartRecords, ws), query?.pageNo, query?.pageSize) }
    }
  },

  // ══ 保养记录（按车间过滤） ══
  {
    url: '/admin-api/workOrder/eamMaintenanceWork/recordList', method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      const completed = filterByWorkshop(maintenanceWorkOrders.filter(w => w.status === '4'), ws)
      return { code: 200, data: paginate(completed, query?.pageNo, query?.pageSize) }
    }
  },

  // ══ 维修记录（按车间过滤） ══
  {
    url: '/admin-api/workOrder/eamRepairWorkOrder/recordList', method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      return { code: 200, data: paginate(filterByWorkshop(repairWorkOrders, ws), query?.pageNo, query?.pageSize) }
    }
  },

  // ══ 维修工单备件耗用 ══
  {
    url: '/admin-api/workOrder/eamRepairWorkOrderSparePart/list',
    method: 'get',
    response: ({ query }) => {
      const repairCode = query?.repairCode || ''
      const allParts: Record<string, any[]> = {
        'RW-C-0001': [
          { id: 'RWSP01', repairCode: 'RW-C-0001', sparePartNumber: 'BJ-001', sparePartName: '485通讯端子', quantity: 1, operatorName: 'XXX', operateTime: '2026-03-05 11:05', remark: '更换故障端子' }
        ],
        'RW-B-0001': [
          { id: 'RWSP02', repairCode: 'RW-B-0001', sparePartNumber: 'BJ-006', sparePartName: '批头', quantity: 2, operatorName: '买盼', operateTime: '2026-04-08 10:10', remark: '更换磨损批头' }
        ],
        'RW-N-0001': [
          { id: 'RWSP03', repairCode: 'RW-N-0001', sparePartNumber: 'BJ-008', sparePartName: '注塑机温控模块', quantity: 1, operatorName: '刚嘉成', operateTime: '2026-04-14 13:30', remark: '更换故障温控板' }
        ]
      }
      const data = allParts[repairCode] || []
      return { code: 200, data: { records: data, total: data.length } }
    }
  },
  {
    url: '/admin-api/workOrder/eamRepairWorkOrderSparePart/add',
    method: 'post',
    response: () => ({ code: 200, data: { id: String(Date.now()) } })
  },
  {
    url: '/admin-api/workOrder/eamRepairWorkOrderSparePart/delete',
    method: 'delete',
    response: () => ({ code: 200, data: true })
  },
]

/** 备件采购（单条主记录，无明细子表；内嵌 mock 数据源） */
import type { PurchaseConfig } from '../types'
import { FEISHU_STATUS_OPTIONS } from '../feishu-status'

const WAREHOUSE_OPTIONS = [
  { label: '设备维修备件库', value: '1' },
  { label: '自动化备件库', value: '2' },
  { label: 'B 端关键备件库', value: '3' },
  { label: 'CNC 设备备件库', value: '4' }
]
const WAREHOUSE_TEXT: Record<string, string> = { '1': '设备维修备件库', '2': '自动化备件库', '3': 'B端关键备件库', '4': 'CNC设备备件库' }

const SOURCE_OPTIONS = [
  { label: '安全库存预警', value: 'warning' },
  { label: '维修工单', value: 'workOrder' },
  { label: '计划补货', value: 'plan' }
]
const SOURCE_TEXT: Record<string, string> = { warning: '安全库存预警', workOrder: '维修工单缺件', plan: '计划补货' }

export const sparePartPurchaseConfig: PurchaseConfig = {
  key: 'sparePart',
  title: '备件采购申请',
  alert: '备件采购说明：触发来源 = 安全库存预警 / 维修工单缺件 / 计划性补货；流程 = 申请 → 飞书审批 → ERP 生成 PO → 入库扣账',
  codeField: 'code',
  codePrefix: 'SP-PR-2026',
  nameField: 'itemName',
  formWidth: '700px',
  searchFields: [
    { prop: 'code', label: '申请单号', placeholder: 'SP-PR-XXXX' },
    { prop: 'itemName', label: '备件名称', placeholder: '如 NSK 润滑脂' },
    { prop: 'status', label: '状态', type: 'select', options: FEISHU_STATUS_OPTIONS }
  ],
  columns: [
    { prop: 'code', label: '申请单号', width: 160 },
    { prop: 'itemName', label: '备件名称', minWidth: 180, align: 'left' },
    { prop: 'specification', label: '规格型号', width: 140 },
    { prop: 'quantity', label: '申请数量', width: 90 },
    { prop: 'unit', label: '单位', width: 70 },
    { prop: 'totalAmount', label: '预估金额', width: 120, money: true, align: 'right' },
    { prop: 'applicantName', label: '申请人', width: 90 },
    { prop: 'warehouseType', label: '所属库房', width: 140, formatter: (r) => WAREHOUSE_TEXT[r.warehouseType] || r.warehouseTypeText || '—' },
    { prop: 'triggerSource', label: '触发来源', width: 110, tag: (r) => (r.triggerSource === 'warning' ? 'danger' : r.triggerSource === 'workOrder' ? 'warning' : ''), formatter: (r) => SOURCE_TEXT[r.triggerSource] || r.triggerSourceText || '—' },
    { prop: 'applicationDate', label: '申请日期', width: 110 }
  ],
  formFields: [
    { prop: 'partNumber', label: '备件编号', span: 12, required: true, placeholder: '如 BJ-XXX' },
    { prop: 'itemName', label: '备件名称', span: 12, required: true },
    { prop: 'specification', label: '规格型号', span: 12 },
    { prop: 'quantity', label: '申请数量', span: 6, type: 'number', required: true, min: 1 },
    { prop: 'unit', label: '单位', span: 6, placeholder: '管/桶/个' },
    { prop: 'warehouseType', label: '所属库房', span: 12, type: 'select', options: WAREHOUSE_OPTIONS, default: '1' },
    { prop: 'triggerSource', label: '触发来源', span: 12, type: 'radio', options: SOURCE_OPTIONS, default: 'plan' },
    { prop: 'applicantName', label: '申请人', span: 12, required: true },
    { prop: 'totalAmount', label: '预估金额', span: 12, type: 'number', min: 0 },
    { prop: 'remark', label: '备注', span: 24, type: 'textarea' }
  ],
  dataSource: {
    type: 'inline',
    rows: [
      { id: 'SPP01', code: 'SP-PR-2026-001', itemName: 'NSK PS-2润滑脂', specification: '0.5g/次', quantity: 10, unit: '管', totalAmount: 350, applicantName: '陆钟', warehouseType: '1', triggerSource: 'warning', applicationDate: '2026-04-22', status: 'DELIVERED', erpPurchaseOrderNo: 'PO-2026-04-0501' },
      { id: 'SPP02', code: 'SP-PR-2026-002', itemName: '注塑机温控模块', specification: 'TC-48', quantity: 2, unit: '块', totalAmount: 5360, applicantName: '彭向', warehouseType: '4', triggerSource: 'workOrder', applicationDate: '2026-04-14', status: 'FEISHU_APPROVED', erpPurchaseOrderNo: '' },
      { id: 'SPP03', code: 'SP-PR-2026-003', itemName: '检测探针 0.5mm', specification: '弹簧探针', quantity: 8, unit: '组', totalAmount: 1160, applicantName: '严欢欢', warehouseType: '3', triggerSource: 'warning', applicationDate: '2026-04-25', status: 'FEISHU_APPROVING', erpPurchaseOrderNo: '' },
      { id: 'SPP04', code: 'SP-PR-2026-004', itemName: '485通讯端子', specification: '标准', quantity: 20, unit: '个', totalAmount: 250, applicantName: '李伟', warehouseType: '2', triggerSource: 'plan', applicationDate: '2026-04-26', status: 'DRAFT', erpPurchaseOrderNo: '' },
      { id: 'SPP05', code: 'SP-PR-2026-005', itemName: 'CNC 主轴轴承', specification: '7014C', quantity: 1, unit: '套', totalAmount: 3850, applicantName: '刚嘉成', warehouseType: '4', triggerSource: 'workOrder', applicationDate: '2026-04-17', status: 'DELIVERED', erpPurchaseOrderNo: 'PO-2026-04-0489' },
      { id: 'SPP06', code: 'SP-PR-2026-006', itemName: '伺服电机驱动器', specification: 'V90 400W', quantity: 2, unit: '台', totalAmount: 6400, applicantName: '李伟', warehouseType: '2', triggerSource: 'workOrder', applicationDate: '2026-04-19', status: 'DELIVERED', erpPurchaseOrderNo: 'PO-2026-04-0463' },
      { id: 'SPP07', code: 'SP-PR-2026-007', itemName: '电极头', specification: 'φ16', quantity: 6, unit: '对', totalAmount: 390, applicantName: '买盼', warehouseType: '3', triggerSource: 'plan', applicationDate: '2026-04-20', status: 'DELIVERED', erpPurchaseOrderNo: 'PO-2026-04-0145' },
      { id: 'SPP08', code: 'SP-PR-2026-008', itemName: '46# 抗磨液压油', specification: '200L/桶', quantity: 3, unit: '桶', totalAmount: 3840, applicantName: '彭向', warehouseType: '4', triggerSource: 'warning', applicationDate: '2026-04-23', status: 'DELIVERED', erpPurchaseOrderNo: 'PO-2026-04-0512' },
      { id: 'SPP09', code: 'SP-PR-2026-009', itemName: '止逆环', specification: 'φ40 标准', quantity: 4, unit: '个', totalAmount: 1680, applicantName: '彭向', warehouseType: '4', triggerSource: 'plan', applicationDate: '2026-04-24', status: 'FEISHU_APPROVED', erpPurchaseOrderNo: '' },
      { id: 'SPP10', code: 'SP-PR-2026-010', itemName: '点胶针头', specification: '22G', quantity: 30, unit: '盒', totalAmount: 1350, applicantName: '刘朋朋', warehouseType: '2', triggerSource: 'plan', applicationDate: '2026-04-25', status: 'FEISHU_APPROVING', erpPurchaseOrderNo: '' },
      { id: 'SPP11', code: 'SP-PR-2026-011', itemName: '气管接头', specification: '6mm', quantity: 50, unit: '个', totalAmount: 400, applicantName: '陆钟', warehouseType: '1', triggerSource: 'plan', applicationDate: '2026-04-15', status: 'PUSH_FAILED', erpPurchaseOrderNo: '' },
      { id: 'SPP12', code: 'SP-PR-2026-012', itemName: '冷却液 5%', specification: 'BLASOCUT 25L', quantity: 6, unit: '桶', totalAmount: 3480, applicantName: '王组长', warehouseType: '4', triggerSource: 'warning', applicationDate: '2026-04-26', status: 'FEISHU_REJECTED', erpPurchaseOrderNo: '' }
    ]
  }
}

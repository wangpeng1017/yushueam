/**
 * 设备采购 / 自制设备备件采购 共用的「通用头部字段」与「明细子表定义」
 * —— 保证两类采购的新建表单头部完全一致。
 */
import type { FormFieldDef, DetailColumnDef, DetailTabDef } from '../types'
import { PROJECT_OPTIONS } from './project-master'

export const WORKSHOP_OPTIONS = [
  { label: 'C 端（PACK/PCBA/装配）', value: 'C' },
  { label: 'B 端', value: 'B' },
  { label: '数控机加', value: 'CNC' }
]

export const WORKSHOP_TEXT: Record<string, string> = { C: 'C 端', B: 'B 端', CNC: '数控' }

/** 通用设备采购头部字段（单据编号自动生成；项目从项目主数据搜索选择，选填） */
export const commonHeaderFields: FormFieldDef[] = [
  { prop: 'projectCode', label: '单据编号', span: 8, disabledOnEdit: true, placeholder: '留空自动生成' },
  { prop: 'projectNo', label: '项目', span: 16, type: 'projectSelect', options: PROJECT_OPTIONS, fillNameProp: 'projectName', placeholder: '搜索选择项目（来自项目主数据，选填）' },
  { prop: 'applicantName', label: '申购人', span: 8, required: true },
  { prop: 'applicantDept', label: '申购部门', span: 8, required: true },
  { prop: 'workshopCode', label: '所属端别', span: 8, type: 'select', required: true, options: WORKSHOP_OPTIONS, default: 'C' },
  { prop: 'applicationDate', label: '申购日期', span: 8, type: 'date', required: true },
  { prop: 'expectedDate', label: '要求到货日期', span: 8, type: 'date', required: true },
  { prop: 'totalAmount', label: '预估金额', span: 8, type: 'number', min: 0, step: 1000 },
  { prop: 'remark', label: '备注', span: 24, type: 'textarea', placeholder: '材质、数量以清单为准；货期过长的请与申购人沟通...' }
]

/** 钣金件 / 机加工件 通用列（结构相同） */
const machinedColumns: DetailColumnDef[] = [
  { prop: 'materialCode', label: '物料编号', width: 140 },
  { prop: 'drawingNo', label: '图号', width: 170 },
  { prop: 'itemName', label: '名称', minWidth: 160 },
  { prop: 'quantity', label: '数量', width: 80, type: 'number' },
  { prop: 'material', label: '材质', width: 120 },
  { prop: 'surfaceTreat', label: '表面处理', width: 140 },
  { prop: 'remark', label: '备注', minWidth: 120 }
]
const machinedRow = () => ({ materialCode: '', drawingNo: '', itemName: '', quantity: 1, material: '', surfaceTreat: '', remark: '' })

export const sheetMetalTab: DetailTabDef = {
  name: 'sheetMetal', label: '钣金件清单', itemsField: 'sheetMetalItems', columns: machinedColumns, newRow: machinedRow
}
export const machiningTab: DetailTabDef = {
  name: 'machining', label: '机加工件清单', itemsField: 'machiningItems', columns: machinedColumns, newRow: machinedRow
}
export const outsourceTab: DetailTabDef = {
  name: 'outsource', label: '外购件清单', itemsField: 'outsourceItems',
  alert: '货期过长的请与申购人沟通，提前预警或替换。加急！',
  columns: [
    { prop: 'materialCode', label: '物料编号', width: 140 },
    { prop: 'drawingSpec', label: '图号/型号/规格', width: 180 },
    { prop: 'description', label: '物料描述', minWidth: 160 },
    { prop: 'quantity', label: '数量', width: 80, type: 'number' },
    { prop: 'brand', label: '品牌', width: 110 },
    { prop: 'remark', label: '备注', minWidth: 120, placeholder: '加急 / 货期' },
    { prop: 'link', label: '链接', width: 200, placeholder: 'https://...' }
  ],
  newRow: () => ({ materialCode: '', drawingSpec: '', description: '', quantity: 1, brand: '', remark: '', link: '' })
}

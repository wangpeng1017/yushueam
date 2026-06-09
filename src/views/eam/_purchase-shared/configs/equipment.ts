/** 设备采购（通用设备采购，项目无关；明细 = 单张「采购明细」扁平表） */
import type { PurchaseConfig, DetailTabDef } from '../types'
import { FEISHU_STATUS_OPTIONS } from '../feishu-status'
import { commonHeaderFields } from './_shared'

/** 历史数据是「钣金/机加/外购」三数组，归并到单张采购明细 items，保证列表/详情/编辑一致 */
function mergeLegacyItems(r: any): any {
  if (Array.isArray(r.items)) return r
  const fromMachined = (arr: any[] = []) =>
    arr.map((x) => ({
      materialCode: x.materialCode || '', itemName: x.itemName || '', specification: x.drawingNo || '',
      quantity: x.quantity, unit: x.unit || '', remark: [x.material, x.surfaceTreat, x.remark].filter(Boolean).join(' / ')
    }))
  const fromOutsource = (arr: any[] = []) =>
    arr.map((x) => ({
      materialCode: x.materialCode || '', itemName: x.description || x.itemName || '', specification: x.drawingSpec || '',
      quantity: x.quantity, unit: x.unit || '', remark: [x.brand, x.remark].filter(Boolean).join(' / ')
    }))
  const items = [...fromMachined(r.sheetMetalItems), ...fromMachined(r.machiningItems), ...fromOutsource(r.outsourceItems)]
  return { ...r, items }
}

const itemsTab: DetailTabDef = {
  name: 'items', label: '采购明细', itemsField: 'items',
  columns: [
    { prop: 'materialCode', label: '物料编号', width: 150 },
    { prop: 'itemName', label: '名称', minWidth: 180 },
    { prop: 'specification', label: '规格型号', width: 180 },
    { prop: 'quantity', label: '数量', width: 90, type: 'number' },
    { prop: 'unit', label: '单位', width: 90 },
    { prop: 'remark', label: '备注', minWidth: 140 }
  ],
  newRow: () => ({ materialCode: '', itemName: '', specification: '', quantity: 1, unit: '台', remark: '' })
}

export const equipmentPurchaseConfig: PurchaseConfig = {
  key: 'equipment',
  title: '设备采购',
  codeField: 'projectCode',
  codePrefix: 'CIP-2026',
  nameField: 'projectName',
  searchFields: [
    { prop: 'projectCode', label: '单据编号', placeholder: 'CIP-2026-XXXX' },
    { prop: 'projectName', label: '项目名称' },
    { prop: 'status', label: '审批状态', type: 'select', options: FEISHU_STATUS_OPTIONS }
  ],
  columns: [
    { prop: 'projectCode', label: '单据编号', width: 140 },
    { prop: 'projectName', label: '项目', minWidth: 200, align: 'left', formatter: (r) => (r.projectNo ? `${r.projectNo} ${r.projectName || ''}` : r.projectName || '—') },
    { prop: 'applicantName', label: '申购人', width: 80 },
    { prop: 'applicantDept', label: '申购部门', width: 120 },
    { prop: 'applicationDate', label: '申购日期', width: 100 },
    { prop: 'expectedDate', label: '要求到货', width: 100 },
    { prop: 'itemCount', label: '明细', width: 90, formatter: (r) => `${r.items?.length || 0} 项` },
    { prop: 'totalAmount', label: '预估金额', width: 110, money: true, align: 'right' }
  ],
  formFields: commonHeaderFields,
  detailTabs: [itemsTab],
  mapRow: mergeLegacyItems,
  dataSource: {
    type: 'api',
    listPath: '/eam/purchase-request/page',
    detailPath: '/eam/purchase-request/get',
    createPath: '/eam/purchase-request/create',
    updatePath: '/eam/purchase-request/update',
    deletePath: '/eam/purchase-request/delete'
  }
}

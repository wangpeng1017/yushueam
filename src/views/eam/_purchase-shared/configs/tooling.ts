/** 工器具采购（统一为飞书黑盒流程；单条主记录，无明细子表） */
import type { PurchaseConfig } from '../types'

const TOOL_TYPE_OPTIONS = [
  { label: '刀具', value: '刀具' },
  { label: '量具', value: '量具' },
  { label: '模具', value: '模具' }
]

export const toolingPurchaseConfig: PurchaseConfig = {
  key: 'tooling',
  title: '工器具采购需求',
  codeField: 'demandCode',
  codePrefix: 'TPR-2026',
  nameField: 'itemName',
  statusField: 'approvalStatus',
  formWidth: '700px',
  searchFields: [
    { prop: 'demandCode', label: '需求单号' },
    { prop: 'itemName', label: '品名' }
  ],
  columns: [
    { prop: 'demandCode', label: '需求单号', width: 170 },
    { prop: 'toolType', label: '类型', width: 80 },
    { prop: 'itemName', label: '品名', minWidth: 180, align: 'left' },
    { prop: 'specification', label: '规格', width: 180 },
    { prop: 'quantity', label: '数量', width: 70 },
    { prop: 'unit', label: '单位', width: 60 },
    { prop: 'expectedDate', label: '期望到货', width: 110 },
    { prop: 'applicantName', label: '申请人', width: 90 }
  ],
  formFields: [
    { prop: 'toolType', label: '工器具类型', span: 8, type: 'select', required: true, options: TOOL_TYPE_OPTIONS },
    { prop: 'itemName', label: '品名', span: 16, required: true },
    { prop: 'specification', label: '规格型号', span: 8, required: true },
    { prop: 'quantity', label: '数量', span: 8, type: 'number', required: true, min: 1 },
    { prop: 'unit', label: '单位', span: 8, placeholder: '把/支/套' },
    { prop: 'expectedDate', label: '期望到货日期', span: 8, type: 'date', required: true },
    { prop: 'applicantName', label: '申请人', span: 8, required: true },
    { prop: 'department', label: '申请部门', span: 8 },
    { prop: 'usagePurpose', label: '用途说明', span: 24, type: 'textarea' }
  ],
  dataSource: {
    type: 'api',
    listPath: '/admin-api/eam/tool-purchase-demand/page',
    createPath: '/admin-api/eam/tool-purchase-demand/create',
    updatePath: '/admin-api/eam/tool-purchase-demand/update',
    deletePath: '/admin-api/eam/tool-purchase-demand/delete'
  }
}

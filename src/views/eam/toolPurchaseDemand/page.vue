<template>
  <SimpleListPage
    ref="listRef"
    apiPath="/admin-api/eam/tool-purchase-demand/page"
    :columns="columns"
    :searchFields="[
      { prop: 'demandCode', label: '需求单号' },
      { prop: 'itemName', label: '品名' },
    ]"
    :enableCreate="true"
    :enableDetail="true"
    detailTitleProp="demandCode"
    @create="handleCreate"
  />
  <SimpleFormDialog
    ref="formRef"
    title="新增采购需求"
    :fields="formFields"
    apiCreate="/admin-api/eam/tool-purchase-demand/create"
    @success="reloadList"
  />
</template>

<script setup lang="ts" name="EamToolPurchaseDemand">
import { ref } from 'vue'
import SimpleListPage from '../_tooling-shared/SimpleListPage.vue'
import SimpleFormDialog from '../_tooling-shared/SimpleFormDialog.vue'

const columns = [
  { prop: 'demandCode', label: '需求单号', width: 180 },
  { prop: 'toolType', label: '类型', width: 80 },
  { prop: 'itemName', label: '品名', minWidth: 180 },
  { prop: 'specification', label: '规格', width: 180 },
  { prop: 'quantity', label: '数量', width: 80 },
  { prop: 'unit', label: '单位', width: 70 },
  { prop: 'expectedDate', label: '期望到货日', width: 120 },
  { prop: 'applicantName', label: '申请人', width: 100 },
  { prop: 'department', label: '申请部门', width: 140 },
  {
    prop: 'erpPushStatus', label: 'ERP 状态', width: 120,
    tag: (r: any) => {
      const t = r.erpPushStatus
      return t === '已生成PO' ? 'success' : (t === '已推送' ? 'warning' : (t === '失败' ? 'danger' : 'info'))
    }
  },
  { prop: 'erpPurchaseOrderNo', label: 'PO 单号', width: 180 },
  { prop: 'createTime', label: '创建时间', width: 160 },
]

const formFields = [
  { prop: 'toolType', label: '工器具类型', type: 'select' as const, required: true, options: [
    { label: '刀具', value: '刀具' },
    { label: '量具', value: '量具' },
    { label: '模具', value: '模具' },
  ] },
  { prop: 'itemName', label: '品名', required: true },
  { prop: 'specification', label: '规格型号', required: true },
  { prop: 'quantity', label: '数量', type: 'number' as const, required: true, min: 1 },
  { prop: 'unit', label: '单位', placeholder: '把/支/套' },
  { prop: 'expectedDate', label: '期望到货日期', type: 'date' as const, required: true },
  { prop: 'applicantName', label: '申请人', required: true },
  { prop: 'department', label: '申请部门' },
  { prop: 'usagePurpose', label: '用途说明', type: 'textarea' as const, span: 24 },
]

const listRef = ref()
const formRef = ref()

function handleCreate() {
  formRef.value?.open()
}

function reloadList() {
  listRef.value?.loadList()
}
</script>

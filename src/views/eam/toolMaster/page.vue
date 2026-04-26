<template>
  <SimpleListPage
    ref="listRef"
    apiPath="/admin-api/eam/tool-master/page"
    :columns="columns"
    :searchFields="[
      { prop: 'toolName', label: '刀具名称' },
      { prop: 'toolCode', label: '刀具编号' },
    ]"
    :enableCreate="true"
    :enableDetail="true"
    detailTitleProp="toolName"
    @create="handleCreate"
  />
  <SimpleFormDialog
    ref="formRef"
    title="新增刀具档案"
    :fields="formFields"
    apiCreate="/admin-api/eam/tool-master/create"
    @success="reloadList"
  />
</template>

<script setup lang="ts" name="EamToolMaster">
import { ref } from 'vue'
import SimpleListPage from '../_tooling-shared/SimpleListPage.vue'
import SimpleFormDialog from '../_tooling-shared/SimpleFormDialog.vue'

const columns = [
  { prop: 'toolCode', label: '刀具编号', width: 200 },
  { prop: 'toolName', label: '刀具名称', minWidth: 180 },
  { prop: 'categoryPath', label: '分类路径', minWidth: 320 },
  { prop: 'specification', label: '规格型号', minWidth: 180 },
  { prop: 'material', label: '材质', width: 120 },
  { prop: 'brand', label: '品牌', width: 120 },
  { prop: 'purchaseOrderNo', label: '采购订单号', width: 160 },
  { prop: 'currentStock', label: '当前库存', width: 100 },
  { prop: 'unit', label: '单位', width: 80 },
  { prop: 'storageLocation', label: '仓位', width: 140 },
  { prop: 'status', label: '状态', width: 100, tag: (r: any) => r.status === '已启用' ? 'success' : 'info' },
]

const formFields = [
  { prop: 'toolName', label: '刀具名称', required: true },
  { prop: 'specification', label: '规格型号', required: true },
  { prop: 'material', label: '材质', type: 'select' as const, required: true, options: [
    { label: '硬质合金', value: '硬质合金' },
    { label: '高速钢', value: '高速钢' },
    { label: '陶瓷', value: '陶瓷' },
    { label: 'CBN', value: 'CBN' },
  ] },
  { prop: 'brand', label: '品牌' },
  { prop: 'supplierName', label: '供应商' },
  { prop: 'inboundQty', label: '首次入库数量', type: 'number' as const, required: true, min: 1 },
  { prop: 'unit', label: '单位', placeholder: '把' },
  { prop: 'unitPrice', label: '单价', type: 'number' as const, precision: 2 },
  { prop: 'storageLocation', label: '仓位' },
  { prop: 'remark', label: '备注', type: 'textarea' as const, span: 24 },
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

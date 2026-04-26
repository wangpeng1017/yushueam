<template>
  <SimpleListPage
    ref="listRef"
    apiPath="/admin-api/eam/gauge-master/page"
    :columns="columns"
    :searchFields="[{ prop: 'gaugeName', label: '量具名称' }]"
    :enableCreate="true"
    :enableDetail="true"
    detailTitleProp="gaugeName"
    @create="handleCreate"
  />
  <SimpleFormDialog
    ref="formRef"
    title="新增量具档案"
    :fields="formFields"
    apiCreate="/admin-api/eam/gauge-master/create"
    @success="reloadList"
  />
</template>

<script setup lang="ts" name="EamGaugeMaster">
import { ref } from 'vue'
import SimpleListPage from '../_tooling-shared/SimpleListPage.vue'
import SimpleFormDialog from '../_tooling-shared/SimpleFormDialog.vue'

const columns = [
  { prop: 'gaugeCode', label: '量具编号', width: 200 },
  { prop: 'gaugeName', label: '量具名称', minWidth: 180 },
  { prop: 'categoryPath', label: '分类路径', minWidth: 320 },
  { prop: 'measureRange', label: '量程', width: 140 },
  { prop: 'accuracy', label: '精度', width: 120 },
  { prop: 'brand', label: '品牌', width: 120 },
  { prop: 'currentStock', label: '在库', width: 80 },
  { prop: 'borrowedQty', label: '借出', width: 80 },
  { prop: 'unit', label: '单位', width: 70 },
  { prop: 'storageLocation', label: '仓位', width: 140 },
  { prop: 'status', label: '状态', width: 100, tag: (r: any) => r.status === '已启用' ? 'success' : 'info' },
]

const formFields = [
  { prop: 'gaugeName', label: '量具名称', required: true },
  { prop: 'measureRange', label: '量程', required: true, placeholder: '如 0-150mm' },
  { prop: 'accuracy', label: '精度', required: true, placeholder: '如 0.01mm' },
  { prop: 'brand', label: '品牌', placeholder: '如 三丰、马尔' },
  { prop: 'supplierName', label: '供应商' },
  { prop: 'inboundQty', label: '首次入库数量', type: 'number' as const, required: true, min: 1 },
  { prop: 'unit', label: '单位', placeholder: '把/台' },
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

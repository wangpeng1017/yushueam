<template>
  <SimpleListPage
    apiPath="/admin-api/eam/tooling-inbound/page"
    :columns="columns"
    :searchFields="[{ prop: 'inboundCode', label: '入库单号' }, { prop: 'purchaseOrderNo', label: 'PO 单号' }]"
  />
</template>

<script setup lang="ts" name="EamToolingInbound">
import SimpleListPage from '../_tooling-shared/SimpleListPage.vue'

const columns = [
  { prop: 'inboundCode', label: '入库单号', width: 180 },
  { prop: 'inboundType', label: '入库类型', width: 110, tag: (r: any) => r.inboundType === '采购入库' ? 'success' : (r.inboundType === '退库入库' ? 'warning' : 'info') },
  { prop: 'purchaseOrderNo', label: 'PO 单号', width: 180 },
  { prop: 'toolType', label: '类型', width: 80 },
  { prop: 'itemCode', label: '工器具编号', width: 220 },
  { prop: 'quantity', label: '入库数量', width: 100 },
  { prop: 'storageLocation', label: '仓位', width: 140 },
  { prop: 'operatorName', label: '入库人', width: 100 },
  { prop: 'inboundTime', label: '入库时间', width: 160 },
  { prop: 'remark', label: '备注', minWidth: 200 },
]
</script>

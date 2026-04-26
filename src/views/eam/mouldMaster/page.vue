<template>
  <SimpleListPage
    apiPath="/admin-api/eam/mould-master/page"
    :columns="columns"
    :searchFields="[
      { prop: 'mouldName', label: '模具名称' },
      { prop: 'barcode', label: '模架条码' },
    ]"
  />
</template>

<script setup lang="ts" name="EamMouldMaster">
import SimpleListPage from '../_tooling-shared/SimpleListPage.vue'

const columns = [
  { prop: 'mouldCode', label: '模具编号', width: 220 },
  { prop: 'mouldName', label: '模具名称', minWidth: 200 },
  { prop: 'barcode', label: '模架条码', width: 180 },
  { prop: 'categoryPath', label: '分类路径', minWidth: 320 },
  { prop: 'processType', label: '工艺', width: 100 },
  { prop: 'specification', label: '规格', width: 120 },
  { prop: 'currentProductionOrder', label: '当前生产订单', width: 200 },
  { prop: 'usageCount', label: '累计使用', width: 110 },
  {
    prop: 'status', label: '状态', width: 100,
    tag: (r: any) => r.status === '在用' ? 'success' : (r.status === '在库' ? 'info' : (r.status === '维修中' ? 'warning' : 'danger'))
  },
  { prop: 'storageLocation', label: '仓位', width: 140 },
]
</script>

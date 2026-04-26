<template>
  <SimpleListPage
    apiPath="/admin-api/eam/gauge-master/page"
    :columns="columns"
    :searchFields="[{ prop: 'gaugeName', label: '量具名称' }]"
  />
</template>

<script setup lang="ts" name="EamGaugeMaster">
import SimpleListPage from '../_tooling-shared/SimpleListPage.vue'

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
</script>

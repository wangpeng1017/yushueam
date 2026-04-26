<template>
  <SimpleListPage
    apiPath="/admin-api/eam/tooling-scrap/page"
    :columns="columns"
    :searchFields="[{ prop: 'scrapCode', label: '报废单号' }, { prop: 'itemCode', label: '工器具编号' }]"
  />
</template>

<script setup lang="ts" name="EamToolingScrap">
import SimpleListPage from '../_tooling-shared/SimpleListPage.vue'

const columns = [
  { prop: 'scrapCode', label: '报废单号', width: 180 },
  { prop: 'toolType', label: '类型', width: 80 },
  { prop: 'itemCode', label: '工器具编号', width: 220 },
  { prop: 'scrapQuantity', label: '报废数量', width: 100 },
  {
    prop: 'scrapReason', label: '报废原因', width: 120,
    tag: (r: any) => r.scrapReason === '损坏' ? 'danger' : (r.scrapReason === '损耗' ? 'warning' : (r.scrapReason === '丢失' ? 'danger' : 'info'))
  },
  { prop: 'reasonDetail', label: '详情', minWidth: 240 },
  { prop: 'disposalType', label: '处理方式', width: 100 },
  { prop: 'operatorName', label: '报废人', width: 100 },
  { prop: 'reviewerName', label: '审核人', width: 100 },
  { prop: 'scrapTime', label: '报废时间', width: 160 },
]
</script>

<template>
  <SimpleListPage
    apiPath="/admin-api/eam/tooling-outbound/page"
    :columns="columns"
    :searchFields="[{ prop: 'outboundCode', label: '出库单号' }, { prop: 'receiverName', label: '领用人' }]"
  />
</template>

<script setup lang="ts" name="EamToolingOutbound">
import SimpleListPage from '../_tooling-shared/SimpleListPage.vue'

const columns = [
  { prop: 'outboundCode', label: '出库单号', width: 180 },
  {
    prop: 'outboundType', label: '出库类型', width: 100,
    tag: (r: any) => {
      const t = r.outboundType
      return t === '领用' ? 'primary' : (t === '借用' ? 'warning' : (t === '调拨' ? 'info' : 'danger'))
    }
  },
  { prop: 'toolType', label: '类型', width: 80 },
  { prop: 'itemCode', label: '工器具编号', width: 220 },
  { prop: 'quantity', label: '数量', width: 80 },
  { prop: 'receiverName', label: '领用人', width: 120 },
  { prop: 'usageProcess', label: '用途/工序', minWidth: 200 },
  { prop: 'productionOrderNo', label: '生产订单', width: 200 },
  { prop: 'expectedReturnDate', label: '预计归还', width: 120 },
  { prop: 'outboundTime', label: '出库时间', width: 160 },
]
</script>

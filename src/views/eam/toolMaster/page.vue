<template>
  <SimpleListPage
    apiPath="/admin-api/eam/tool-master/page"
    :columns="columns"
    :searchFields="[
      { prop: 'toolName', label: '刀具名称' },
      { prop: 'toolCode', label: '刀具编号' },
    ]"
    :enableDetail="true"
    detailTitleProp="toolName"
  />
</template>

<script setup lang="ts" name="EamToolMaster">
import SimpleListPage from '../_tooling-shared/SimpleListPage.vue'

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
</script>

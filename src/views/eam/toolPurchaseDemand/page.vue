<template>
  <SimpleListPage
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
</template>

<script setup lang="ts" name="EamToolPurchaseDemand">
import { ElMessage } from 'element-plus'
import SimpleListPage from '../_tooling-shared/SimpleListPage.vue'

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

function handleCreate() {
  ElMessage.info('采购需求新建：开发中（mock 模式下可直接查看示例数据）')
}
</script>

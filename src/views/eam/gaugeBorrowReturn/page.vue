<template>
  <SimpleListPage
    apiPath="/admin-api/eam/gauge-borrow-return/page"
    :columns="columns"
    :searchFields="[{ prop: 'borrowerName', label: '借用人' }, { prop: 'gaugeCode', label: '量具编号' }]"
  />
</template>

<script setup lang="ts" name="EamGaugeBorrowReturn">
import SimpleListPage from '../_tooling-shared/SimpleListPage.vue'

const columns = [
  { prop: 'borrowCode', label: '借用记录号', width: 180 },
  { prop: 'gaugeCode', label: '量具编号', width: 200 },
  { prop: 'borrowerName', label: '借用人', width: 120 },
  { prop: 'borrowDate', label: '借用日期', width: 120 },
  { prop: 'expectedReturnDate', label: '预计归还', width: 120 },
  { prop: 'actualReturnDate', label: '实际归还', width: 120 },
  {
    prop: 'returnStatus', label: '归还状态', width: 100,
    tag: (r: any) => r.returnStatus === '已归还' ? 'success' : (r.returnStatus === '逾期' ? 'danger' : 'warning')
  },
  {
    prop: 'returnCondition', label: '检查结果', width: 100,
    tag: (r: any) => r.returnCondition === '完好' ? 'success' : (r.returnCondition === '损坏' ? 'danger' : (r.returnCondition === '丢失' ? 'danger' : 'info'))
  },
  { prop: 'damageRemark', label: '损坏说明', minWidth: 200 },
  { prop: 'remark', label: '备注', minWidth: 160 },
]
</script>

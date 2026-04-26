<template>
  <TreeListLayout :tree-data="treeData" @select="handleTreeSelect">
    <template #default>
      <SimpleListPage
        ref="listRef"
        apiPath="/admin-api/eam/mould-master/page"
        :columns="columns"
        :searchFields="[
          { prop: 'mouldName', label: '模具名称' },
          { prop: 'barcode', label: '模架条码' },
        ]"
        :enableCreate="true"
        :enableDetail="true"
        detailTitleProp="mouldName"
        :extraQuery="{ categoryFilter: selectedCategory }"
        @create="handleCreate"
      />
    </template>
  </TreeListLayout>
  <SimpleFormDialog
    ref="formRef"
    title="新增模具档案"
    :fields="formFields"
    apiCreate="/admin-api/eam/mould-master/create"
    @success="reloadList"
  />
</template>

<script setup lang="ts" name="EamMouldMaster">
import { ref, onMounted } from 'vue'
import request from '@/config/axios'
import SimpleListPage from '../_tooling-shared/SimpleListPage.vue'
import SimpleFormDialog from '../_tooling-shared/SimpleFormDialog.vue'
import TreeListLayout from '../_tooling-shared/TreeListLayout.vue'

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

const formFields = [
  { prop: 'mouldName', label: '模具名称', required: true },
  { prop: 'processType', label: '工艺类型', type: 'select' as const, required: true, options: [
    { label: '注塑', value: '注塑' },
    { label: '冲压', value: '冲压' },
    { label: '压铸', value: '压铸' },
    { label: '锻造', value: '锻造' },
    { label: '工装夹具', value: '工装夹具' },
  ] },
  { prop: 'specification', label: '规格', required: true, placeholder: '如 1出4 / 8工位' },
  { prop: 'mouldFrameNo', label: '模架编号', placeholder: '系统将自动生成模架条码' },
  { prop: 'productCode', label: '适用产品' },
  { prop: 'supplierName', label: '供应商' },
  { prop: 'unitPrice', label: '单价', type: 'number' as const, precision: 2 },
  { prop: 'storageLocation', label: '仓位' },
  { prop: 'remark', label: '备注', type: 'textarea' as const, span: 24 },
]

const listRef = ref()
const formRef = ref()
const selectedCategory = ref<string>('ALL')
const treeData = ref<any[]>([])
const allMoulds = ref<any[]>([])

function handleCreate() {
  formRef.value?.open()
}

function reloadList() {
  listRef.value?.loadList()
}

function handleTreeSelect(key: string) {
  selectedCategory.value = key
}

async function buildTree() {
  const listRes: any = await request.get({
    url: '/admin-api/eam/mould-master/page', params: { pageNo: 1, pageSize: 1000 }
  })
  allMoulds.value = listRes?.records || []

  const treeRes: any = await request.get({
    url: '/admin-api/eam/tool-category/tree', params: { toolType: '模具' }
  })
  const flatCats: any[] = treeRes || []

  function countItems(catName: string): number {
    return allMoulds.value.filter(t => (t.categoryPath || '').includes(catName)).length
  }

  const l1Nodes = flatCats.filter(c => c.parentId === 0)
  const tree: any[] = []
  l1Nodes.forEach(l1 => {
    const node = { key: l1.name, label: l1.name, count: countItems(l1.name), children: [] as any[] }
    const l2Children = flatCats.filter(c => c.parentId === l1.id)
    l2Children.forEach(l2 => {
      node.children.push({ key: l2.name, label: l2.name, count: countItems(l2.name) })
    })
    tree.push(node)
  })

  treeData.value = [
    { key: 'ALL', label: '全部', count: allMoulds.value.length, children: tree }
  ]
}

onMounted(() => buildTree())
</script>

<template>
  <TreeListLayout :tree-data="treeData" @select="handleTreeSelect">
    <template #default>
      <SimpleListPage
        ref="listRef"
        apiPath="/admin-api/eam/tool-master/page"
        :columns="columns"
        :searchFields="[
          { prop: 'toolName', label: '刀具名称' },
          { prop: 'toolCode', label: '刀具编号' },
        ]"
        :enableCreate="true"
        :enableDetail="true"
        detailTitleProp="toolName"
        :extraQuery="{ categoryFilter: selectedCategory }"
        @create="handleCreate"
      />
    </template>
  </TreeListLayout>
  <SimpleFormDialog
    ref="formRef"
    title="新增刀具档案"
    :fields="formFields"
    apiCreate="/admin-api/eam/tool-master/create"
    @success="reloadList"
  />
</template>

<script setup lang="ts" name="EamToolMaster">
import { ref, onMounted } from 'vue'
import request from '@/config/axios'
import SimpleListPage from '../_tooling-shared/SimpleListPage.vue'
import SimpleFormDialog from '../_tooling-shared/SimpleFormDialog.vue'
import TreeListLayout from '../_tooling-shared/TreeListLayout.vue'

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

const formFields = [
  { prop: 'toolName', label: '刀具名称', required: true },
  { prop: 'specification', label: '规格型号', required: true },
  { prop: 'material', label: '材质', type: 'select' as const, required: true, options: [
    { label: '硬质合金', value: '硬质合金' },
    { label: '高速钢', value: '高速钢' },
    { label: '陶瓷', value: '陶瓷' },
    { label: 'CBN', value: 'CBN' },
  ] },
  { prop: 'brand', label: '品牌' },
  { prop: 'supplierName', label: '供应商' },
  { prop: 'inboundQty', label: '首次入库数量', type: 'number' as const, required: true, min: 1 },
  { prop: 'unit', label: '单位', placeholder: '把' },
  { prop: 'unitPrice', label: '单价', type: 'number' as const, precision: 2 },
  { prop: 'storageLocation', label: '仓位' },
  { prop: 'remark', label: '备注', type: 'textarea' as const, span: 24 },
]

const listRef = ref()
const formRef = ref()
const selectedCategory = ref<string>('ALL')
const treeData = ref<any[]>([])
const allTools = ref<any[]>([])

function handleCreate() {
  formRef.value?.open()
}

function reloadList() {
  listRef.value?.loadList()
}

function handleTreeSelect(key: string) {
  selectedCategory.value = key
}

// 构建树数据：从 mock 拿分类树 + 列表，统计每节点数量
async function buildTree() {
  // 拉所有刀具用于统计
  const listRes: any = await request.get({
    url: '/admin-api/eam/tool-master/page', params: { pageNo: 1, pageSize: 1000 }
  })
  allTools.value = listRes?.records || []

  // 拉分类树
  const treeRes: any = await request.get({
    url: '/admin-api/eam/tool-category/tree', params: { toolType: '刀具' }
  })
  const flatCats: any[] = treeRes || []

  // 按 parentId 组装
  const map: Record<string, any> = {}
  flatCats.forEach(c => {
    map[c.id] = { key: c.name, label: c.name, count: 0, children: [] }
  })

  // 统计每个分类的工具数（包括其子分类）
  function countTools(catName: string): number {
    return allTools.value.filter(t => (t.categoryPath || '').includes(catName)).length
  }

  // 构建树（仅取 L1 + L2 两层，避免太深）
  const l1Nodes = flatCats.filter(c => c.parentId === 0)
  const tree: any[] = []
  l1Nodes.forEach(l1 => {
    const node = { key: l1.name, label: l1.name, count: countTools(l1.name), children: [] as any[] }
    const l2Children = flatCats.filter(c => c.parentId === l1.id)
    l2Children.forEach(l2 => {
      node.children.push({ key: l2.name, label: l2.name, count: countTools(l2.name) })
    })
    tree.push(node)
  })

  treeData.value = [
    { key: 'ALL', label: '全部', count: allTools.value.length, children: tree }
  ]
}

onMounted(() => buildTree())
</script>

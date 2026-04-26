<template>
  <SimpleListPage
    apiPath="/admin-api/eam/tool-category/page"
    :columns="columns"
    :searchFields="[
      { prop: 'name', label: '分类名称' },
      { prop: 'toolType', label: '适用对象' },
    ]"
  />
</template>

<script setup lang="ts" name="EamToolCategory">
import SimpleListPage from '../_tooling-shared/SimpleListPage.vue'

const columns = [
  { prop: 'code', label: '分类编号', width: 180 },
  { prop: 'name', label: '分类名称', minWidth: 200 },
  { prop: 'toolType', label: '适用对象', width: 100 },
  { prop: 'level', label: '层级', width: 80 },
  { prop: 'parentId', label: '上级分类', width: 140 },
  { prop: 'sort', label: '排序', width: 80 },
]
</script>

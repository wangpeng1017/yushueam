<template>
  <ContentWrap>
    <!-- 搜索栏 -->
    <el-form v-if="searchFields && searchFields.length"
      class="-mb-15px" :model="queryParams" :inline="true" label-width="90px">
      <el-form-item v-for="f in searchFields" :key="f.prop" :label="f.label" :prop="f.prop">
        <el-input v-model="queryParams[f.prop]" class="!w-200px" clearable
          :placeholder="`请输入${f.label}`" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" />&nbsp;搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" />&nbsp;重置
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <!-- 工具栏 -->
    <div class="mb-10px" v-if="enableCreate">
      <el-button type="primary" plain @click="$emit('create')">
        <Icon icon="ep:plus" class="mr-5px" />&nbsp;新增
      </el-button>
    </div>
    <!-- 列表 -->
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true" border>
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column v-for="col in columns" :key="col.prop"
        :label="col.label" :prop="col.prop" align="center"
        :width="col.width" :min-width="col.minWidth"
        :show-overflow-tooltip="true">
        <template v-if="col.formatter || col.tag" #default="{ row }">
          <el-tag v-if="col.tag" :type="col.tag(row)" size="small">{{ row[col.prop] }}</el-tag>
          <span v-else-if="col.formatter">{{ col.formatter(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="$slots.action" label="操作" align="center" width="160" fixed="right">
        <template #default="scope">
          <slot name="action" :row="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination class="mt-15px"
      :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="loadList" />
  </ContentWrap>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import request from '@/config/axios'

const props = defineProps<{
  apiPath: string
  columns: Array<{ prop: string; label: string; width?: string | number; minWidth?: string | number; formatter?: (row: any) => string; tag?: (row: any) => string }>
  searchFields?: Array<{ prop: string; label: string }>
  enableCreate?: boolean
}>()

defineEmits<{
  (e: 'create'): void
}>()

const loading = ref(false)
const list = ref<any[]>([])
const total = ref(0)
const queryParams = reactive<any>({ pageNo: 1, pageSize: 10 })

async function loadList() {
  loading.value = true
  try {
    const res: any = await request.get({ url: props.apiPath, params: queryParams })
    list.value = res?.records || res?.list || []
    total.value = res?.total || 0
  } catch (e) {
    console.error('Load list failed:', e)
    list.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function handleQuery() {
  queryParams.pageNo = 1
  loadList()
}

function resetQuery() {
  Object.keys(queryParams).forEach(k => {
    if (k !== 'pageNo' && k !== 'pageSize') queryParams[k] = ''
  })
  queryParams.pageNo = 1
  loadList()
}

onMounted(() => loadList())

defineExpose({ loadList, queryParams })
</script>

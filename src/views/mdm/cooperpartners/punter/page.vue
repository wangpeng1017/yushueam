<!-- Author [陈建峰],  Since 2026-01-19 16:46:12,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="80px"
    >
      <el-form-item label="货主编码" prop="shipperCode">
        <el-input
          v-model="queryParams.shipperCode"
          class="!w-200px"
          clearable
          placeholder="请输入货主编码"
        />
      </el-form-item>
      <el-form-item label="货主名称" prop="shipperName">
        <el-input
          v-model="queryParams.shipperName"
          class="!w-200px"
          clearable
          placeholder="请输入货主名称"
        />
      </el-form-item>
      <el-form-item label="货主类型" prop="shipperType">
        <el-select
          v-model="queryParams.shipperType"
          class="!w-200px"
          clearable
          placeholder="请选择货主类型"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.COOPERPARTNERS_PUNTER)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="结算方式" prop="settlementMethod">
        <el-select
          v-model="queryParams.settlementMethod"
          class="!w-200px"
          clearable
          placeholder="请选择结算方式"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.COOPERPARTNERS_PUNTER_SETTLEMENT)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon class="mr-5px" icon="ep:search" />&nbsp;搜索</el-button
        >
        <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />&nbsp;重置</el-button
        >
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div class="mb-10px">
      <el-button v-hasPermi="['']" plain type="primary" @click="openForm('create')">
        <Icon class="mr-5px" icon="ep:plus" />&nbsp;新增
      </el-button>
      <el-button
        v-hasPermi="['']"
        :loading="exportLoading"
        plain
        type="success"
        @click="handleExport"
      >
        <Icon class="mr-5px" icon="ep:download" />&nbsp;导出
      </el-button>
      <el-button
        v-hasPermi="['']"
        :disabled="checkedIds.length === 0"
        plain
        type="danger"
        @click="handleDeleteBatch"
      >
        <Icon class="mr-5px" icon="ep:delete" />&nbsp;批量删除
      </el-button>
    </div>
    <el-table v-loading="loading" :data="list" @selection-change="handleRowCheckboxChange">
      <el-table-column type="selection" width="55" />
      <el-table-column align="center" label="货主编码">
        <template #default="scope">
          <div class="flex items-center justify-center gap-1">
            <Icon icon="ep:user" />
            {{ scope.row.shipperCode }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="货主名称" prop="shipperName" />
      <el-table-column align="center" label="类型" prop="shipperType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.COOPERPARTNERS_PUNTER" :value="scope.row.shipperType" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="结算方式" prop="settlementMethod">
        <template #default="scope">
          <dict-tag
            :type="DICT_TYPE.COOPERPARTNERS_PUNTER_SETTLEMENT"
            :value="scope.row.settlementMethod"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系信息" prop="contactName">
        <template #default="scope">
          <div class="flex flex-col">
            <span>{{ scope.row.contactName }}</span>
            <span>{{ scope.row.contactPhone }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="地址" prop="deliveryAddress">
        <template #default="scope">
          <div class="flex items-center justify-center gap-1">
            <Icon icon="ep:location" />
            {{ scope.row.deliveryAddress }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="仓库" prop="defaultWarehouseName" />
      <!--      <el-table-column align="center" label="规则" prop="" />-->
      <el-table-column align="center" fixed="right" label="操作" min-width="130">
        <template #default="scope">
          <el-button
            v-hasPermi="['']"
            class="btn-edit"
            link
            @click="openForm('update', scope.row.id)"
            >&nbsp;编辑
          </el-button>
          <el-button v-hasPermi="['']" class="btn-delete" link @click="handleDelete(scope.row.id)"
            >&nbsp;删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>
  <CooperpartnersPunterForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'
import * as CooperpartnersPunterApi from '@/api/mdm/cooperpartners/punter'
import download from '@/utils/download'
import CooperpartnersPunterForm from './form.vue'

defineOptions({ name: 'CooperpartnersPunterPage' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const total = ref(0)
const list = ref([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  shipperType: '',
  settlementMethod: '',
  shipperCode: '',
  shipperName: ''
})
const queryFormRef = ref()
const exportLoading = ref(false)

/** 查询客户/货主管理列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CooperpartnersPunterApi.getCooperpartnersPunterPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await CooperpartnersPunterApi.deleteCooperpartnersPunterById(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 批量删除按钮操作 */
const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (rows: CooperpartnersPunterApi.CooperpartnersPunterDto[]) => {
  checkedIds.value = rows.map((row) => row.id)
}

const handleDeleteBatch = async () => {
  try {
    await message.delConfirm()
    // 发起批量删除
    await CooperpartnersPunterApi.deleteCooperpartnersPunterByIds(checkedIds.value)
    checkedIds.value = []
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await CooperpartnersPunterApi.exportCooperpartnersPunter(queryParams)
    download.excel(data, '客户/货主管理.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
<style lang="scss" scoped>
/* 操作栏按钮样式 */
:deep(.el-button.btn-edit) {
  color: #0097ba;
  &:hover {
    color: rgba(0, 151, 186, 0.75);
  }
}

:deep(.el-button.btn-delete) {
  color: #d54941;
  &:hover {
    color: rgba(213, 73, 65, 0.75);
  }
}

:deep(.el-button.btn-other) {
  color: #a5d867;
  &:hover {
    color: rgba(165, 216, 103, 0.75);
  }
}
</style>

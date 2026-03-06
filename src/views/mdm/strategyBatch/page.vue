<!-- Author [陈建峰],  Since 2026-01-27 10:18:01,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="80px">
      <el-form-item label="策略编码" prop="strategyCode">
        <el-input
          v-model="queryParams.strategyCode"
          class="!w-200px"
          clearable
          placeholder="请输入策略编码"
        />
      </el-form-item>
      <el-form-item label="策略名称" prop="strategyName">
        <el-input
          v-model="queryParams.strategyName"
          class="!w-200px"
          clearable
          placeholder="请输入策略名称"
        />
      </el-form-item>
      <el-form-item label="策略类型" prop="strategyType">
        <el-select
            v-model="queryParams.strategyType"
            placeholder="请选择策略类型"
            clearable
            class="!w-200px">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.STRATEGY_BATCH_STRATEGY_TYPE)"
            :key="dict.value" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          class="!w-200px">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.STRATEGY_STATUS)"
            :key="dict.value" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" />&nbsp;搜索</el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" />&nbsp;重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div class="mb-10px">
      <el-button
        v-hasPermi="['']"
        plain
        type="primary"
        @click="openForm('create')">
        <Icon class="mr-5px" icon="ep:plus" />&nbsp;新增
      </el-button>
      <!-- <el-button
        v-hasPermi="['']"
        :loading="exportLoading"
        plain
        type="success"
        @click="handleExport" >
        <Icon class="mr-5px" icon="ep:download" />&nbsp;导出
      </el-button> -->
      <el-button
        v-hasPermi="['']"
        :disabled="checkedIds.length === 0"
        plain
        type="danger"
        @click="handleDeleteBatch">
        <Icon class="mr-5px" icon="ep:delete" />&nbsp;批量删除
      </el-button>
    </div>
    <el-table v-loading="loading" :data="list" @selection-change="handleRowCheckboxChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="策略编码" align="center" prop="strategyCode" />
      <el-table-column label="策略名称" align="center" prop="strategyName" />
      <el-table-column label="生效条件-物料分类" align="center" prop="materialCategoryNames">
        <template #default="scope">
          <el-tag v-for="name in scope.row.materialCategoryNames" :key="name" class="mr-5px">
            {{ name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="策略类型" align="center" prop="strategyType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.STRATEGY_BATCH_STRATEGY_TYPE" :value="scope.row.strategyType" />
        </template>
      </el-table-column>
      <el-table-column label="前缀" align="center" prop="prefix" />
      <el-table-column label="日期格式" align="center" prop="dateFormat">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.STRATEGY_BATCH_DATE_FORMAT" :value="scope.row.dateFormat" />
        </template>
      </el-table-column>
      <el-table-column label="流水号长度" align="center" prop="snLength" />
      <el-table-column label="自动计算有效期" align="center" prop="validityPeriod">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.STRATEGY_OPEN_STATUS" :value="scope.row.validityPeriod" />
        </template>
      </el-table-column>
      <el-table-column label="保质期时长" align="center" prop="validityDuration" />
      <el-table-column label="保质期时长单位" align="center" prop="validityUnit">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.STRATEGY_BATCH_VALIDITY_UNIT" :value="scope.row.validityUnit" />
        </template>
      </el-table-column>
      <el-table-column label="入库默认状态" align="center" prop="circulationStatus">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.STRATEGY_BATCH_CIRCULATION_STATUS" :value="scope.row.circulationStatus" />
        </template>
      </el-table-column>
      <el-table-column label="临期自动冻结(天)" align="center" prop="circulationExpiration" />
      <el-table-column label="强制追溯" align="center" prop="forceTrace">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.STRATEGY_OPEN_STATUS" :value="scope.row.forceTrace" />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.STRATEGY_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="180"
          :formatter="dateFormatter"/>
      <el-table-column label="操作" align="center" min-width="130" fixed="right">
        <template #default="scope">
          <el-button
            link
            class="btn-edit"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['']">&nbsp;编辑
          </el-button>
          <el-button
            link
            class="btn-delete"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['']">&nbsp;删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
  <StrategyBatchForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'
import * as StrategyBatchApi from '@/api/mdm/strategyBatch'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import StrategyBatchForm from './form.vue'

defineOptions({ name: 'StrategyBatchPage' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const total = ref(0)
const list = ref([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  strategyType: '',
  circulationStatus: '',
  status: '',
  strategyCode: '',
  strategyName: '',
})
const queryFormRef = ref()
const exportLoading = ref(false)

/** 查询批次规则配置列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await StrategyBatchApi.getStrategyBatchPage(queryParams)
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
    await StrategyBatchApi.deleteStrategyBatchById(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 批量删除按钮操作 */
const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (rows: StrategyBatchApi.StrategyBatchDto[]) => {
  checkedIds.value = rows.map((row) => row.id)
}

const handleDeleteBatch = async () => {
  try {
    await message.delConfirm()
    // 发起批量删除
    await StrategyBatchApi.deleteStrategyBatchByIds(checkedIds.value)
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
    const data = await StrategyBatchApi.exportStrategyBatch(queryParams)
    download.excel(data, '批次规则配置.xls')
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
  color: #0097BA;
  &:hover {
    color: rgba(0, 151, 186, 0.75);
  }
}

:deep(.el-button.btn-delete) {
  color: #D54941;
  &:hover {
    color: rgba(213, 73, 65, 0.75);
  }
}

:deep(.el-button.btn-other) {
  color: #A5D867;
  &:hover {
    color: rgba(165, 216, 103, 0.75);
  }
}
</style>
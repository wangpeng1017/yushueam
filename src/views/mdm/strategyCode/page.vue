<!-- Author [陈建峰],  Since 2026-02-09 00:00:00,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="80px"
    >
      <el-form-item label="规则编号" prop="ruleCode">
        <el-input
          v-model="queryParams.ruleCode"
          class="!w-200px"
          clearable
          placeholder="请输入规则编号"
        />
      </el-form-item>
      <el-form-item label="规则名称" prop="ruleName">
        <el-input
          v-model="queryParams.ruleName"
          class="!w-200px"
          clearable
          placeholder="请输入规则名称"
        />
      </el-form-item>
      <el-form-item label="规则类型" prop="ruleType">
        <el-select
          v-model="queryParams.ruleType"
          placeholder="请选择规则类型"
          clearable
          class="!w-200px"
        >
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.STRATEGY_CODE_RULE_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-200px">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.STRATEGY_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" />&nbsp;搜索</el-button
        >
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" />&nbsp;重置</el-button
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
      <el-table-column label="规则编号" align="center" prop="ruleCode" />
      <el-table-column label="规则名称" align="center" prop="ruleName" />
      <el-table-column label="规则类型" align="center" prop="ruleType">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.STRATEGY_CODE_RULE_TYPE" :value="scope.row.ruleType" />
        </template>
      </el-table-column>
      <el-table-column label="规则结构示例" align="center" min-width="200">
        <template #default="scope">
          <template v-if="scope.row.segments && scope.row.segments.length">
            <template v-for="(seg, idx) in scope.row.segments" :key="idx">
              <span v-if="idx > 0 && scope.row.separatorCode" class="text-gray-400 mx-2px">
                {{ scope.row.separatorCode }}
              </span>
              <el-tag :type="getSegmentTagType(seg.segmentType)" size="small" class="mx-2px">
                {{ getSegmentDisplayValue(seg) }}
              </el-tag>
            </template>
          </template>
          <span v-else class="text-gray-400">-</span>
        </template>
      </el-table-column>
      <el-table-column label="重置周期" align="center" prop="resetCycle" min-width="100">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.STRATEGY_CODE_RESET_CYCLE" :value="scope.row.resetCycle" />
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.STRATEGY_STATUS" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="操作" align="center" min-width="130" fixed="right">
        <template #default="scope">
          <el-button
            link
            class="btn-edit"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['']"
            >&nbsp;编辑
          </el-button>
          <el-button link class="btn-delete" @click="handleDelete(scope.row.id)" v-hasPermi="['']"
            >&nbsp;删除
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
  <StrategyCodeForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'
import * as StrategyCodeApi from '@/api/mdm/strategyCode'
import { dateFormatter } from '@/utils/formatTime'
import StrategyCodeForm from './form.vue'

defineOptions({ name: 'StrategyCodePage' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const total = ref(0)
const list = ref([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  ruleCode: '',
  ruleName: '',
  ruleType: '',
  status: ''
})
const queryFormRef = ref()

/** 获取段类型对应的tag类型 */
const getSegmentTagType = (segmentType: string) => {
  switch (segmentType) {
    case 'FIXED':
      return ''
    case 'DATE':
      return 'success'
    case 'SEQUENCE':
      return 'warning'
    default:
      return 'info'
  }
}

/** 获取段的展示值 */
const getSegmentDisplayValue = (seg: StrategyCodeApi.StrategyCodeSegmentDto) => {
  switch (seg.segmentType) {
    case 'FIXED':
      return seg.fixedValue || '固定值'
    case 'DATE':
      return seg.dateFormat || 'YYYYMMDD'
    case 'SEQUENCE':
      return 'SEQ'
    default:
      return ''
  }
}

/** 查询编码规则配置列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await StrategyCodeApi.getStrategyCodePage(queryParams)
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
    await StrategyCodeApi.deleteStrategyCodeById(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 批量删除按钮操作 */
const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (rows: StrategyCodeApi.StrategyCodeDto[]) => {
  checkedIds.value = rows.map((row) => row.id)
}

const handleDeleteBatch = async () => {
  try {
    await message.delConfirm()
    // 发起批量删除
    await StrategyCodeApi.deleteStrategyCodeByIds(checkedIds.value)
    checkedIds.value = []
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
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
    color: rgb(0 151 186 / 75%);
  }
}

:deep(.el-button.btn-delete) {
  color: #d54941;

  &:hover {
    color: rgb(213 73 65 / 75%);
  }
}

:deep(.el-button.btn-other) {
  color: #a5d867;

  &:hover {
    color: rgb(165 216 103 / 75%);
  }
}
</style>

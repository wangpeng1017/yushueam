<!-- Author [system],  Since 2026-02-24,  Copyright (c) 2025-2026, chenjianfeng  -->
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
          class="!w-200px"
        >
          <el-option
            v-for="item in strategyTypeOptions"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-200px">
          <el-option label="启用" value="ENABLED" />
          <el-option label="禁用" value="DISABLED" />
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
      <el-button plain type="primary" @click="openForm('create')">
        <Icon class="mr-5px" icon="ep:plus" />&nbsp;新增
      </el-button>
      <el-button :disabled="checkedIds.length === 0" plain type="danger" @click="handleDeleteBatch">
        <Icon class="mr-5px" icon="ep:delete" />&nbsp;批量删除
      </el-button>
      <el-button plain type="success" @click="goToSimulate">
        <Icon class="mr-5px" icon="ep:video-play" />&nbsp;模拟执行
      </el-button>
    </div>
    <el-table v-loading="loading" :data="list" @selection-change="handleRowCheckboxChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="策略编码" align="center" prop="strategyCode" min-width="120" />
      <el-table-column label="策略名称" align="center" prop="strategyName" min-width="150" />
      <el-table-column label="策略类型" align="center" prop="strategyTypeName" min-width="100">
        <template #default="scope">
          <el-tag :type="getStrategyTypeTag(scope.row.strategyType)">
            {{ scope.row.strategyTypeName || scope.row.strategyType }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="业务场景" align="center" prop="bizScene" min-width="100" />
      <el-table-column label="当前版本" align="center" prop="currentVersionNo" min-width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.currentVersionNo" type="success">
            V{{ scope.row.currentVersionNo }}
          </el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" min-width="80">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'ENABLED' ? 'success' : 'danger'">
            {{ scope.row.statusName || (scope.row.status === 'ENABLED' ? '启用' : '禁用') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="操作" align="center" min-width="250" fixed="right">
        <template #default="scope">
          <el-button link class="btn-view" @click="goToDetail(scope.row.id)">&nbsp;详情 </el-button>
          <el-button link class="btn-other" @click="openVersionDialog(scope.row)"
            >&nbsp;版本管理
          </el-button>
          <el-button link class="btn-edit" @click="openForm('update', scope.row.id)"
            >&nbsp;编辑
          </el-button>
          <el-button
            link
            :class="scope.row.status === 'ENABLED' ? 'btn-delete' : 'btn-other'"
            @click="handleToggleStatus(scope.row)"
          >
            &nbsp;{{ scope.row.status === 'ENABLED' ? '禁用' : '启用' }}
          </el-button>
          <el-button link class="btn-delete" @click="handleDelete(scope.row.id)"
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

  <!-- 策略表单 -->
  <StrategyForm ref="formRef" @success="getList" />

  <!-- 版本管理弹窗 -->
  <StrategyVersionDialog ref="versionDialogRef" @success="getList" />
</template>

<script lang="ts" setup>
import * as StrategyApi from '@/api/mdm/strategy'
import { dateFormatter } from '@/utils/formatTime'
import StrategyForm from './form.vue'
import StrategyVersionDialog from './version/index.vue'

defineOptions({ name: 'StrategyPage' })

const router = useRouter()
const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const total = ref(0)
const list = ref([])
const strategyTypeOptions = ref<StrategyApi.EnumEntity[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  strategyCode: '',
  strategyName: '',
  strategyType: '',
  status: ''
})
const queryFormRef = ref()

/** 获取策略类型标签颜色 */
const getStrategyTypeTag = (type: string) => {
  const tagMap: Record<string, string> = {
    PUTAWAY: 'primary',
    PICKING: 'success',
    WAVE: 'warning',
    ROTATION: 'info'
  }
  return tagMap[type] || 'default'
}

/** 获取策略类型枚举列表 */
const getStrategyTypeOptions = async () => {
  try {
    strategyTypeOptions.value = await StrategyApi.getStrategyTypeList()
  } catch {
    strategyTypeOptions.value = []
  }
}

/** 查询策略列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await StrategyApi.getStrategyPage(queryParams)
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

/** 版本管理弹窗 */
const versionDialogRef = ref()
const openVersionDialog = (row: any) => {
  versionDialogRef.value.open(row)
}

/** 跳转到详情页 */
const goToDetail = (id: number) => {
  router.push(`/mdm/strategy/detail/${id}`)
}

/** 跳转到模拟执行页 */
const goToSimulate = () => {
  router.push('/mdm/strategy/simulate')
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    await message.delConfirm()
    await StrategyApi.deleteStrategyById(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

/** 批量删除按钮操作 */
const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (rows: StrategyApi.StrategyDto[]) => {
  checkedIds.value = rows.map((row) => row.id)
}

const handleDeleteBatch = async () => {
  try {
    await message.delConfirm()
    await StrategyApi.deleteStrategyByIds(checkedIds.value)
    checkedIds.value = []
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

/** 启用/禁用操作 */
const handleToggleStatus = async (row: any) => {
  try {
    const action = row.status === 'ENABLED' ? '禁用' : '启用'
    await message.confirm(`确认${action}策略【${row.strategyName}】吗？`)
    if (row.status === 'ENABLED') {
      await StrategyApi.disableStrategy(row.id)
    } else {
      await StrategyApi.enableStrategy(row.id)
    }
    message.success(`${action}成功`)
    await getList()
  } catch {}
}

/** 初始化 **/
onMounted(() => {
  getStrategyTypeOptions()
  getList()
})
</script>

<style lang="scss" scoped>
:deep(.el-button.btn-view) {
  color: #409eff;

  &:hover {
    color: rgb(64 158 255 / 75%);
  }
}

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

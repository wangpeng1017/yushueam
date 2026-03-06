<!-- Author [system],  Since 2026-02-24,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="1000px">
    <div class="version-container">
      <!-- 策略信息 -->
      <el-descriptions :column="4" border class="mb-20px">
        <el-descriptions-item label="策略编码">{{
          currentStrategy.strategyCode
        }}</el-descriptions-item>
        <el-descriptions-item label="策略名称">{{
          currentStrategy.strategyName
        }}</el-descriptions-item>
        <el-descriptions-item label="策略类型">{{
          currentStrategy.strategyTypeName
        }}</el-descriptions-item>
        <el-descriptions-item label="当前版本">
          <el-tag v-if="currentStrategy.currentVersionNo" type="success"
            >V{{ currentStrategy.currentVersionNo }}</el-tag
          >
          <span v-else>-</span>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 版本列表 -->
      <div class="mb-10px">
        <el-button type="primary" plain @click="handleCreateVersion">
          <Icon class="mr-5px" icon="ep:plus" />&nbsp;新建版本
        </el-button>
      </div>

      <el-table v-loading="loading" :data="versionList" border>
        <el-table-column label="版本号" align="center" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.publishFlag ? 'success' : 'info'">
              V{{ scope.row.versionNo }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="版本名称" align="center" prop="versionName" min-width="150" />
        <el-table-column label="版本状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="getVersionStatusTag(scope.row.versionStatus)">
              {{ scope.row.versionStatusName || scope.row.versionStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布状态" align="center" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.publishFlag ? 'success' : 'warning'">
              {{ scope.row.publishFlag ? '已发布' : '未发布' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="发布时间"
          align="center"
          prop="publishedAt"
          width="180"
          :formatter="dateFormatter"
        />
        <el-table-column label="发布人" align="center" prop="publishedBy" width="100" />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="180"
          :formatter="dateFormatter"
        />
        <el-table-column label="操作" align="center" min-width="220" fixed="right">
          <template #default="scope">
            <el-button link class="btn-other" @click="handleViewRules(scope.row)">
              &nbsp;查看规则
            </el-button>
            <el-button
              v-if="!scope.row.publishFlag"
              link
              class="btn-edit"
              @click="handleEditRules(scope.row)"
            >
              &nbsp;编辑规则
            </el-button>
            <el-button
              v-if="!scope.row.publishFlag && scope.row.versionStatus === 'DRAFT'"
              link
              class="btn-other"
              @click="handlePublish(scope.row)"
            >
              &nbsp;发布
            </el-button>
            <el-button
              v-if="scope.row.publishFlag && scope.row.versionStatus === 'ARCHIVED'"
              link
              class="btn-other"
              @click="handleRollback(scope.row)"
            >
              &nbsp;回滚
            </el-button>
            <el-button
              v-if="!scope.row.publishFlag"
              link
              class="btn-delete"
              @click="handleDelete(scope.row.id)"
            >
              &nbsp;删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getVersionList"
      />
    </div>

    <!-- 规则查看弹窗 -->
    <RuleViewDialog ref="ruleViewDialogRef" />

    <!-- 规则编辑弹窗 -->
    <RuleEditDialog ref="ruleEditDialogRef" @success="getVersionList" />
  </Dialog>
</template>

<script lang="ts" setup>
import * as StrategyApi from '@/api/mdm/strategy'
import { dateFormatter } from '@/utils/formatTime'
import RuleViewDialog from './RuleViewDialog.vue'
import RuleEditDialog from './RuleEditDialog.vue'

defineOptions({ name: 'StrategyVersionDialog' })

const router = useRouter()
const message = useMessage()
const { t } = useI18n()

const dialogVisible = ref(false)
const dialogTitle = ref('版本管理')
const loading = ref(false)
const currentStrategy = ref<any>({})
const versionList = ref([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  strategyId: undefined as number | undefined
})

/** 获取版本状态标签颜色 */
const getVersionStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    DRAFT: 'info',
    PUBLISHED: 'success',
    ARCHIVED: 'warning'
  }
  return tagMap[status] || 'default'
}

/** 打开弹窗 */
const open = async (strategy: any) => {
  dialogVisible.value = true
  currentStrategy.value = strategy
  queryParams.strategyId = strategy.id
  queryParams.pageNo = 1
  await getVersionList()
}
defineExpose({ open })

/** 获取版本列表 */
const getVersionList = async () => {
  loading.value = true
  try {
    const data = await StrategyApi.getVersionPage(queryParams)
    versionList.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 新建版本 */
const handleCreateVersion = async () => {
  try {
    await message.confirm('确认创建新版本吗？将基于当前发布版本复制规则。')
    await StrategyApi.createVersion({
      strategyId: currentStrategy.value.id,
      versionName: ''
    })
    message.success('创建成功')
    await getVersionList()
  } catch {}
}

/** 发布版本 */
const handlePublish = async (row: any) => {
  try {
    await message.confirm(`确认发布版本 V${row.versionNo} 吗？`)
    await StrategyApi.publishVersion({
      strategyId: currentStrategy.value.id,
      versionId: row.id
    })
    message.success('发布成功')
    await getVersionList()
    emit('success')
  } catch {}
}

/** 回滚版本 */
const handleRollback = async (row: any) => {
  try {
    await message.confirm(`确认回滚到版本 V${row.versionNo} 吗？`)
    await StrategyApi.rollbackVersion({
      strategyId: currentStrategy.value.id,
      targetVersionId: row.id
    })
    message.success('回滚成功')
    await getVersionList()
    emit('success')
  } catch {}
}

/** 删除版本 */
const handleDelete = async (id: number) => {
  try {
    await message.delConfirm()
    await StrategyApi.deleteVersionById(id)
    message.success(t('common.delSuccess'))
    await getVersionList()
  } catch {}
}

/** 查看规则 */
const ruleViewDialogRef = ref()
const handleViewRules = (row: any) => {
  // 跳转到版本查看页面
  router.push(`/mdm/strategy/version/${row.id}?mode=view`)
}

/** 编辑规则 */
const ruleEditDialogRef = ref()
const handleEditRules = (row: any) => {
  // 跳转到版本编辑页面
  router.push(`/mdm/strategy/version/${row.id}?mode=edit`)
}

const emit = defineEmits(['success'])
</script>

<style lang="scss" scoped>
.version-container {
  min-height: 400px;
  max-height: 65vh;
  padding-bottom: 10px;
  overflow-y: auto;
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

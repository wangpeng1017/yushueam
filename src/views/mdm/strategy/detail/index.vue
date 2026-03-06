<!-- Author [system],  Since 2026-02-24,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <div class="strategy-detail-page">
    <!-- 页头 -->
    <div class="page-header">
      <div class="header-left">
        <el-button link @click="goBack">
          <Icon icon="ep:arrow-left" class="mr-5px" />返回
        </el-button>
        <el-divider direction="vertical" />
        <span class="page-title">策略详情</span>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleEdit">
          <Icon icon="ep:edit" class="mr-5px" />编辑策略
        </el-button>
      </div>
    </div>

    <!-- 基本信息 -->
    <ContentWrap v-loading="loading">
      <el-descriptions :column="4" border>
        <el-descriptions-item label="策略编码">{{ strategy.strategyCode }}</el-descriptions-item>
        <el-descriptions-item label="策略名称">{{ strategy.strategyName }}</el-descriptions-item>
        <el-descriptions-item label="策略类型">
          <el-tag :type="getStrategyTypeTag(strategy.strategyType)">
            {{ strategy.strategyTypeName || strategy.strategyType }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="strategy.status === 'ENABLED' ? 'success' : 'danger'">
            {{ strategy.statusName || (strategy.status === 'ENABLED' ? '启用' : '禁用') }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="业务场景">{{ strategy.bizScene || '-' }}</el-descriptions-item>
        <el-descriptions-item label="当前版本">
          <el-tag v-if="strategy.currentVersionNo" type="success">
            V{{ strategy.currentVersionNo }}
          </el-tag>
          <span v-else>-</span>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ formatDate(strategy.createTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">
          {{ formatDate(strategy.updateTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="4">{{
          strategy.remark || '-'
        }}</el-descriptions-item>
      </el-descriptions>
    </ContentWrap>

    <!-- 标签页 -->
    <ContentWrap>
      <el-tabs v-model="activeTab">
        <!-- 版本管理 -->
        <el-tab-pane label="版本管理" name="version">
          <div class="tab-toolbar">
            <el-button type="primary" plain size="small" @click="handleCreateVersion">
              <Icon icon="ep:plus" class="mr-5px" />新建版本
            </el-button>
          </div>
          <el-table v-loading="versionLoading" :data="versionList" border>
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
                  {{ scope.row.publishFlag ? '当前生效' : '未发布' }}
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
            <el-table-column label="规则数" align="center" width="80">
              <template #default="scope">
                {{ scope.row.ruleCount || 0 }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="280" fixed="right">
              <template #default="scope">
                <el-button link type="primary" @click="handleViewVersion(scope.row)">
                  查看
                </el-button>
                <el-button
                  v-if="scope.row.versionStatus === 'DRAFT'"
                  link
                  type="primary"
                  @click="handleEditVersion(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-if="scope.row.versionStatus === 'DRAFT'"
                  link
                  type="success"
                  @click="handlePublish(scope.row)"
                >
                  发布
                </el-button>
                <el-button
                  v-if="scope.row.versionStatus === 'ARCHIVED'"
                  link
                  type="warning"
                  @click="handleRollback(scope.row)"
                >
                  回滚
                </el-button>
                <el-button
                  v-if="!scope.row.publishFlag"
                  link
                  type="danger"
                  @click="handleDeleteVersion(scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <Pagination
            :total="versionTotal"
            v-model:page="versionQuery.pageNo"
            v-model:limit="versionQuery.pageSize"
            @pagination="getVersionList"
          />
        </el-tab-pane>

        <!-- 执行日志 -->
        <el-tab-pane label="执行日志" name="execLog">
          <div class="tab-toolbar">
            <el-form :inline="true" :model="execLogQuery" class="-mb-15px">
              <el-form-item label="执行状态">
                <el-select
                  v-model="execLogQuery.successFlag"
                  placeholder="全部"
                  clearable
                  class="!w-120px"
                >
                  <el-option label="成功" :value="true" />
                  <el-option label="失败" :value="false" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleQueryExecLog">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-table v-loading="execLogLoading" :data="execLogList" border>
            <el-table-column
              label="执行时间"
              align="center"
              width="180"
              :formatter="dateFormatter"
              prop="createTime"
            />
            <el-table-column label="版本" align="center" width="100">
              <template #default="scope">
                <el-tag type="info">V{{ scope.row.versionNo }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="命中规则" align="center" min-width="150">
              <template #default="scope">
                {{ getHitRuleName(scope.row.hitRuleTraceJson) || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="执行状态" align="center" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.successFlag ? 'success' : 'danger'">
                  {{ scope.row.successFlag ? '成功' : '失败' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="耗时(ms)" align="center" width="100" prop="costMs" />
            <el-table-column label="业务单号" align="center" prop="bizNo" min-width="150">
              <template #default="scope">
                {{ scope.row.bizNo || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="100" fixed="right">
              <template #default="scope">
                <el-button link type="primary" @click="handleViewExecLog(scope.row)">
                  详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <Pagination
            :total="execLogTotal"
            v-model:page="execLogQuery.pageNo"
            v-model:limit="execLogQuery.pageSize"
            @pagination="getExecLogList"
          />
        </el-tab-pane>

        <!-- 发布日志 -->
        <el-tab-pane label="发布日志" name="publishLog">
          <el-table v-loading="publishLogLoading" :data="publishLogList" border>
            <el-table-column
              label="操作时间"
              align="center"
              width="180"
              :formatter="dateFormatter"
              prop="createTime"
            />
            <el-table-column label="操作类型" align="center" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.operationType === 'PUBLISH' ? 'success' : 'warning'">
                  {{ scope.row.operationTypeName || scope.row.operationType }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="版本变更" align="center" width="180">
              <template #default="scope">
                <span v-if="scope.row.fromVersionNo">V{{ scope.row.fromVersionNo }}</span>
                <span v-else>-</span>
                <Icon icon="ep:right" class="mx-5px" />
                <span v-if="scope.row.toVersionNo">V{{ scope.row.toVersionNo }}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="操作人" align="center" width="120" prop="operatorName">
              <template #default="scope">
                {{ scope.row.operatorName || scope.row.creator || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="remark" min-width="200">
              <template #default="scope">
                {{ scope.row.remark || '-' }}
              </template>
            </el-table-column>
          </el-table>
          <Pagination
            :total="publishLogTotal"
            v-model:page="publishLogQuery.pageNo"
            v-model:limit="publishLogQuery.pageSize"
            @pagination="getPublishLogList"
          />
        </el-tab-pane>
      </el-tabs>
    </ContentWrap>

    <!-- 执行日志详情抽屉 -->
    <ExecLogDetailDrawer ref="execLogDetailRef" />

    <!-- 发布确认弹窗 -->
    <PublishDialog ref="publishDialogRef" @success="getVersionList" />

    <!-- 回滚确认弹窗 -->
    <RollbackDialog ref="rollbackDialogRef" @success="getVersionList" />

    <!-- 策略编辑弹窗 -->
    <StrategyForm ref="strategyFormRef" @success="getStrategy" />
  </div>
</template>

<script lang="ts" setup>
import * as StrategyApi from '@/api/mdm/strategy'
import { dateFormatter, formatDate } from '@/utils/formatTime'
import ExecLogDetailDrawer from './ExecLogDetailDrawer.vue'
import PublishDialog from './PublishDialog.vue'
import RollbackDialog from './RollbackDialog.vue'
import StrategyForm from '../form.vue'

defineOptions({ name: 'StrategyDetailPage' })

const router = useRouter()
const route = useRoute()
const message = useMessage()
const { t } = useI18n()

const strategyId = computed(() => Number(route.params.id))

// 策略数据
const loading = ref(false)
const strategy = ref<any>({})

// 版本数据
const versionLoading = ref(false)
const versionList = ref<any[]>([])
const versionTotal = ref(0)
const versionQuery = reactive({
  pageNo: 1,
  pageSize: 10,
  strategyId: strategyId.value
})

// 执行日志数据
const execLogLoading = ref(false)
const execLogList = ref<any[]>([])
const execLogTotal = ref(0)
const execLogQuery = reactive({
  pageNo: 1,
  pageSize: 10,
  strategyId: strategyId.value,
  successFlag: undefined as boolean | undefined
})

// 发布日志数据
const publishLogLoading = ref(false)
const publishLogList = ref<any[]>([])
const publishLogTotal = ref(0)
const publishLogQuery = reactive({
  pageNo: 1,
  pageSize: 10,
  strategyId: strategyId.value
})

const activeTab = ref('version')

// 获取策略类型标签颜色
const getStrategyTypeTag = (type: string) => {
  const tagMap: Record<string, string> = {
    PUTAWAY: 'primary',
    PICKING: 'success',
    WAVE: 'warning',
    ROTATION: 'info'
  }
  return tagMap[type] || 'default'
}

// 获取版本状态标签颜色
const getVersionStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    DRAFT: 'info',
    PUBLISHED: 'success',
    ARCHIVED: 'warning'
  }
  return tagMap[status] || 'default'
}

// 从hitRuleTraceJson中提取命中规则名称
const getHitRuleName = (hitRuleTraceJson: string) => {
  if (!hitRuleTraceJson) return null
  try {
    const trace = JSON.parse(hitRuleTraceJson)
    // hitRuleTraceJson可能是数组或对象结构，提取ruleName
    if (Array.isArray(trace) && trace.length > 0) {
      return trace.map((r: any) => r.ruleName).filter(Boolean).join(', ')
    }
    if (trace.ruleName) return trace.ruleName
    if (trace.hitRule?.ruleName) return trace.hitRule.ruleName
    return null
  } catch {
    return null
  }
}

// 获取策略详情
const getStrategy = async () => {
  loading.value = true
  try {
    strategy.value = await StrategyApi.getStrategyById(strategyId.value)
  } finally {
    loading.value = false
  }
}

// 获取版本列表
const getVersionList = async () => {
  versionLoading.value = true
  try {
    const data = await StrategyApi.getVersionPage(versionQuery)
    versionList.value = data.list
    versionTotal.value = data.total
  } finally {
    versionLoading.value = false
  }
}

// 获取执行日志列表
const getExecLogList = async () => {
  execLogLoading.value = true
  try {
    const data = await StrategyApi.getExecLogPage(execLogQuery)
    execLogList.value = data.list
    execLogTotal.value = data.total
  } finally {
    execLogLoading.value = false
  }
}

// 获取发布日志列表
const getPublishLogList = async () => {
  publishLogLoading.value = true
  try {
    const data = await StrategyApi.getPublishLogPage(publishLogQuery)
    publishLogList.value = data.list
    publishLogTotal.value = data.total
  } finally {
    publishLogLoading.value = false
  }
}

// 返回
const goBack = () => {
  router.back()
}

// 编辑策略
const strategyFormRef = ref()
const handleEdit = () => {
  strategyFormRef.value?.open('update', strategyId.value)
}

// 新建版本
const handleCreateVersion = async () => {
  try {
    await message.confirm('确认创建新版本吗？将基于当前发布版本复制规则。')
    await StrategyApi.createVersion({
      strategyId: strategyId.value,
      versionName: ''
    })
    message.success('创建成功')
    await getVersionList()
  } catch {}
}

// 查看版本
const handleViewVersion = (row: any) => {
  router.push(`/mdm/strategy/version/${row.id}?mode=view`)
}

// 编辑版本
const handleEditVersion = (row: any) => {
  router.push(`/mdm/strategy/version/${row.id}?mode=edit`)
}

// 发布版本
const publishDialogRef = ref()
const handlePublish = (row: any) => {
  publishDialogRef.value?.open(strategy.value, row)
}

// 回滚版本
const rollbackDialogRef = ref()
const handleRollback = (row: any) => {
  rollbackDialogRef.value?.open(strategy.value, row)
}

// 删除版本
const handleDeleteVersion = async (row: any) => {
  try {
    await message.delConfirm()
    await StrategyApi.deleteVersionById(row.id)
    message.success(t('common.delSuccess'))
    await getVersionList()
  } catch {}
}

// 查询执行日志
const handleQueryExecLog = () => {
  execLogQuery.pageNo = 1
  getExecLogList()
}

// 查看执行日志详情
const execLogDetailRef = ref()
const handleViewExecLog = (row: any) => {
  execLogDetailRef.value?.open(row.id)
}

// 监听tab切换
watch(activeTab, (val) => {
  if (val === 'execLog' && execLogList.value.length === 0) {
    getExecLogList()
  }
  if (val === 'publishLog' && publishLogList.value.length === 0) {
    getPublishLogList()
  }
})

// 初始化
onMounted(() => {
  getStrategy()
  getVersionList()
})
</script>

<style lang="scss" scoped>
.strategy-detail-page {
  min-height: 100%;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  margin-bottom: 15px;
  background-color: #fff;
  border-radius: 4px;
}

.header-left {
  display: flex;
  align-items: center;
}

.page-title {
  font-size: 16px;
  font-weight: 500;
}

.tab-toolbar {
  margin-bottom: 15px;
}
</style>

<!-- Author [system],  Since 2026-02-24,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <div class="strategy-simulate-page">
    <!-- 页头 -->
    <div class="page-header">
      <div class="header-left">
        <el-button link @click="goBack">
          <Icon icon="ep:arrow-left" class="mr-5px" />返回
        </el-button>
        <el-divider direction="vertical" />
        <span class="page-title">策略模拟执行</span>
      </div>
    </div>

    <el-row :gutter="15" class="page-content">
      <!-- 左侧：输入区 -->
      <el-col :span="12">
        <ContentWrap>
          <div class="section-header">
            <span class="section-title">执行参数</span>
          </div>

          <el-form :model="formData" label-width="100px">
            <!-- 策略选择 -->
            <el-form-item label="策略类型" required>
              <el-select v-model="formData.strategyType" placeholder="选择策略类型" class="w-full">
                <el-option
                  v-for="item in strategyTypeOptions"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="执行模式" required>
              <el-radio-group v-model="formData.execMode">
                <el-radio value="EXECUTE">正式执行</el-radio>
                <el-radio value="SIMULATE">模拟运行</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="指定策略">
              <el-select
                v-model="formData.strategyId"
                placeholder="可选，不选则使用默认策略"
                clearable
                class="w-full"
              >
                <el-option
                  v-for="item in strategyList"
                  :key="item.id"
                  :label="`${item.strategyCode} - ${item.strategyName}`"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>

            <!-- 上架策略快捷输入 -->
            <template v-if="formData.strategyType === 'PUTAWAY'">
              <el-divider content-position="left">上架参数（快捷输入）</el-divider>

              <el-form-item label="仓库ID">
                <el-input-number
                  v-model="putawayParams.warehouseId"
                  :min="1"
                  controls-position="right"
                />
              </el-form-item>

              <el-form-item label="物料编码">
                <el-input v-model="putawayParams.materialCode" placeholder="物料编码" />
              </el-form-item>

              <el-form-item label="物料分类">
                <el-select
                  v-model="putawayParams.materialCategory"
                  placeholder="物料分类"
                  clearable
                >
                  <el-option label="原材料" value="RAW" />
                  <el-option label="半成品" value="SEMI" />
                  <el-option label="成品" value="FINISHED" />
                  <el-option label="备品备件" value="SPARE" />
                </el-select>
              </el-form-item>

              <el-form-item label="数量">
                <el-input-number v-model="putawayParams.qty" :min="1" controls-position="right" />
              </el-form-item>

              <el-form-item label="批次号">
                <el-input v-model="putawayParams.batchNo" placeholder="批次号（可选）" />
              </el-form-item>

              <el-form-item label="ASN单号">
                <el-input v-model="putawayParams.asnNo" placeholder="ASN单号（可选）" />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" plain @click="applyPutawayParams">
                  应用到业务数据
                </el-button>
              </el-form-item>
            </template>

            <!-- 业务数据JSON -->
            <el-divider content-position="left">业务数据（JSON）</el-divider>

            <el-form-item label="">
              <el-input
                v-model="formData.businessDataJson"
                type="textarea"
                :rows="12"
                placeholder="输入业务数据JSON"
                class="json-input"
              />
            </el-form-item>

            <el-form-item>
              <el-button type="success" :loading="executing" @click="handleExecute">
                <Icon icon="ep:video-play" class="mr-5px" />执行策略
              </el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </ContentWrap>
      </el-col>

      <!-- 右侧：结果区 -->
      <el-col :span="12">
        <ContentWrap>
          <div class="section-header">
            <span class="section-title">执行结果</span>
            <el-tag v-if="result" :type="result.success ? 'success' : 'danger'">
              {{ result.success ? '成功' : '失败' }}
            </el-tag>
          </div>

          <div v-if="!result" class="empty-result">
            <el-empty description="请配置参数后执行策略" />
          </div>

          <div v-else class="result-content">
            <!-- Scope校验结果 -->
            <div v-if="result.scopeMatched !== null && result.scopeMatched !== undefined" class="scope-result mb-15px">
              <el-alert
                :type="result.scopeMatched ? 'success' : 'warning'"
                :title="result.scopeMatched ? 'Scope校验通过' : 'Scope校验未通过'"
                :closable="false"
                show-icon
              >
                <template v-if="!result.scopeMatched && result.errorMessage" #default>
                  <div class="scope-fail-reason">{{ result.errorMessage }}</div>
                </template>
              </el-alert>
              <!-- Scope轨迹详情 -->
              <div v-if="result.scopeTraces?.length" class="scope-traces mt-10px">
                <div class="sub-section-title">Scope匹配轨迹</div>
                <el-table :data="result.scopeTraces" border size="small">
                  <el-table-column label="类型" prop="scopeType" width="100" align="center">
                    <template #default="scope">
                      <el-tag size="small">{{ getScopeTypeName(scope.row.scopeType) }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="范围键" prop="scopeKey" width="140" />
                  <el-table-column label="操作符" prop="scopeOperator" width="80" align="center" />
                  <el-table-column label="期望值" prop="expectedValue" min-width="100" />
                  <el-table-column label="实际值" prop="actualValue" min-width="100">
                    <template #default="scope">
                      {{ scope.row.actualValue || '(空)' }}
                    </template>
                  </el-table-column>
                  <el-table-column label="结果" width="80" align="center">
                    <template #default="scope">
                      <el-tag :type="scope.row.matched ? 'success' : 'danger'" size="small">
                        {{ scope.row.matched ? '通过' : '不通过' }}
                      </el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>

            <!-- 基本信息 -->
            <el-descriptions :column="2" border class="mb-15px">
              <el-descriptions-item label="策略编码">{{
                result.strategyCode
              }}</el-descriptions-item>
              <el-descriptions-item label="版本ID">{{ result.versionId }}</el-descriptions-item>
              <el-descriptions-item label="命中规则">{{
                result.ruleName || '-'
              }}</el-descriptions-item>
              <el-descriptions-item label="耗时">{{ result.costMs }} ms</el-descriptions-item>
              <el-descriptions-item v-if="result.errorMessage" label="错误信息" :span="2">
                <span class="error-text">{{ result.errorMessage }}</span>
              </el-descriptions-item>
            </el-descriptions>

            <!-- 推荐库位列表 -->
            <template v-if="result.locations?.length">
              <div class="sub-section-title">推荐库位</div>
              <el-table :data="result.locations" border size="small">
                <el-table-column label="排名" type="index" width="60" align="center" />
                <el-table-column label="库位编码" prop="locationCode" min-width="120" />
                <el-table-column label="库区" prop="areaCode" width="100" />
                <el-table-column label="得分" prop="score" width="80" align="center">
                  <template #default="scope">
                    <el-tag type="success">{{ scope.row.score }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="距离" prop="distance" width="80" align="center" />
                <el-table-column label="推荐原因" prop="reasonDesc" min-width="150" />
              </el-table>
            </template>

            <!-- 完整响应JSON -->
            <div class="sub-section-title">完整响应</div>
            <JsonPreview :value="result" max-height="300px" />
          </div>
        </ContentWrap>

        <!-- 执行历史 -->
        <ContentWrap class="mt-15px">
          <div class="section-header">
            <span class="section-title">本次会话执行历史</span>
            <el-button v-if="history.length" link type="danger" @click="clearHistory">
              清空
            </el-button>
          </div>

          <el-table v-if="history.length" :data="history" border size="small">
            <el-table-column label="时间" width="180">
              <template #default="scope">
                {{ scope.row.time }}
              </template>
            </el-table-column>
            <el-table-column label="策略" prop="strategyCode" width="150" />
            <el-table-column label="结果" width="80" align="center">
              <template #default="scope">
                <el-tag :type="scope.row.success ? 'success' : 'danger'" size="small">
                  {{ scope.row.success ? '成功' : '失败' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="命中规则" prop="ruleName">
              <template #default="scope">
                {{ scope.row.ruleName || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" align="center">
              <template #default="scope">
                <el-button link type="primary" @click="viewHistoryDetail(scope.row)">
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div v-else class="empty-history">暂无执行历史</div>
        </ContentWrap>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import * as StrategyApi from '@/api/mdm/strategy'
import JsonPreview from '../components/JsonPreview.vue'
import { formatDate } from '@/utils/formatTime'

defineOptions({ name: 'StrategySimulatePage' })

const router = useRouter()
const message = useMessage()

// 表单数据
const formData = reactive({
  strategyType: 'PUTAWAY',
  strategyId: undefined as number | undefined,
  execMode: 'SIMULATE',
  businessDataJson: '{}'
})

// 上架参数快捷输入
const putawayParams = reactive({
  warehouseId: 1,
  materialCode: '',
  materialCategory: '',
  qty: 100,
  batchNo: '',
  asnNo: ''
})

// 策略列表
const strategyList = ref<any[]>([])

// 策略类型枚举选项
const strategyTypeOptions = ref<StrategyApi.EnumEntity[]>([])

// 执行结果
const executing = ref(false)
const result = ref<any>(null)

// 执行历史
const history = ref<any[]>([])

// 获取策略类型枚举列表
const getStrategyTypeOptions = async () => {
  try {
    strategyTypeOptions.value = await StrategyApi.getStrategyTypeList()
  } catch {
    strategyTypeOptions.value = []
  }
}

// 获取Scope类型名称
const getScopeTypeName = (type: string) => {
  const map: Record<string, string> = {
    TENANT: '租户',
    WAREHOUSE: '仓库',
    BIZ_ATTR: '业务属性'
  }
  return map[type] || type
}

// 获取策略列表
const getStrategyList = async () => {
  try {
    const data = await StrategyApi.listOfStrategy({
      strategyType: formData.strategyType,
      status: 'ENABLED'
    })
    strategyList.value = data || []
  } catch {
    strategyList.value = []
  }
}

// 应用上架参数到业务数据
const applyPutawayParams = () => {
  const data: any = {}
  if (putawayParams.warehouseId) data.warehouseId = putawayParams.warehouseId
  if (putawayParams.materialCode) data.materialCode = putawayParams.materialCode
  if (putawayParams.materialCategory) data.materialCategory = putawayParams.materialCategory
  if (putawayParams.qty) data.qty = putawayParams.qty
  if (putawayParams.batchNo) data.batchNo = putawayParams.batchNo
  if (putawayParams.asnNo) data.asnNo = putawayParams.asnNo

  formData.businessDataJson = JSON.stringify(data, null, 2)
  message.success('已应用到业务数据')
}

// 执行策略
const handleExecute = async () => {
  // 验证
  if (!formData.strategyType) {
    message.error('请选择策略类型')
    return
  }

  let businessData: any
  try {
    businessData = JSON.parse(formData.businessDataJson || '{}')
  } catch {
    message.error('业务数据JSON格式不正确')
    return
  }

  executing.value = true
  try {
    const response = await StrategyApi.executeStrategy({
      strategyType: formData.strategyType,
      strategyId: formData.strategyId,
      execMode: formData.execMode,
      businessData
    })

    result.value = response

    // 添加到历史
    history.value.unshift({
      time: formatDate(new Date()),
      strategyCode: response.strategyCode,
      success: response.success,
      ruleName: response.ruleName,
      fullResult: response
    })

    // 保留最近20条
    if (history.value.length > 20) {
      history.value = history.value.slice(0, 20)
    }
  } catch (e: any) {
    result.value = {
      success: false,
      errorMessage: e.message || '执行失败'
    }
  } finally {
    executing.value = false
  }
}

// 重置
const handleReset = () => {
  formData.businessDataJson = '{}'
  result.value = null
  putawayParams.warehouseId = 1
  putawayParams.materialCode = ''
  putawayParams.materialCategory = ''
  putawayParams.qty = 100
  putawayParams.batchNo = ''
  putawayParams.asnNo = ''
}

// 清空历史
const clearHistory = () => {
  history.value = []
}

// 查看历史详情
const viewHistoryDetail = (item: any) => {
  if (item.fullResult) {
    result.value = item.fullResult
    // 滚动到结果区域
    nextTick(() => {
      document.querySelector('.result-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  } else {
    message.warning('无法加载执行结果详情')
  }
}

// 返回
const goBack = () => {
  router.back()
}

// 监听策略类型变化
watch(
  () => formData.strategyType,
  () => {
    formData.strategyId = undefined
    getStrategyList()
  }
)

// 初始化
onMounted(() => {
  getStrategyTypeOptions()
  getStrategyList()
})
</script>

<style lang="scss" scoped>
.strategy-simulate-page {
  min-height: 100%;
  background-color: #f5f7fa;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
}

.header-left {
  display: flex;
  align-items: center;
}

.page-title {
  font-size: 16px;
  font-weight: 500;
}

.page-content {
  padding: 15px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.sub-section-title {
  padding: 10px 0;
  margin-top: 15px;
  font-size: 13px;
  font-weight: 500;
  color: #606266;
  border-bottom: 1px solid #ebeef5;
}

.w-full {
  width: 100%;
}

.json-input {
  font-family: Monaco, Menlo, Consolas, monospace;
}

.empty-result,
.empty-history {
  padding: 40px;
  color: #909399;
  text-align: center;
}

.error-text {
  color: #f56c6c;
}

.result-content {
  min-height: 200px;
}

.scope-result {
  .scope-fail-reason {
    margin-top: 5px;
    font-size: 13px;
    color: #e6a23c;
  }
}

.scope-traces {
  .sub-section-title {
    padding: 8px 0;
    font-size: 13px;
    font-weight: 500;
    color: #606266;
  }
}
</style>

<!-- Author [system],  Since 2026-02-24,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <div class="version-edit-page">
    <!-- 页头 -->
    <div class="page-header">
      <div class="header-left">
        <el-button link @click="goBack">
          <Icon icon="ep:arrow-left" class="mr-5px" />返回
        </el-button>
        <el-divider direction="vertical" />
        <span class="page-title">{{ isViewMode ? '查看版本' : '编辑版本' }}</span>
        <el-tag v-if="versionDetail.version" type="info" class="ml-10px">
          V{{ versionDetail.version.versionNo }}
        </el-tag>
        <el-tag
          v-if="versionDetail.version"
          :type="getVersionStatusTag(versionDetail.version.versionStatus)"
          class="ml-5px"
        >
          {{ versionDetail.version.versionStatusName }}
        </el-tag>
      </div>
      <div class="header-right">
        <template v-if="!isViewMode">
          <el-button type="success" :loading="saving" @click="handleSave">
            <Icon icon="ep:check" class="mr-5px" />保存
          </el-button>
          <el-button type="primary" @click="handleValidate">
            <Icon icon="ep:finished" class="mr-5px" />校验
          </el-button>
        </template>
        <el-button @click="toggleJsonPreview">
          <Icon icon="ep:view" class="mr-5px" />{{ showJsonPreview ? '隐藏JSON' : '查看JSON' }}
        </el-button>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="page-content" v-loading="loading">
      <el-row :gutter="15">
        <!-- 左侧：规则列表 -->
        <el-col :span="showJsonPreview ? 16 : 24">
          <!-- 版本信息 -->
          <ContentWrap class="mb-15px">
            <el-descriptions :column="4" border>
              <el-descriptions-item label="策略编码">
                {{ versionDetail.version?.strategyCode }}
              </el-descriptions-item>
              <el-descriptions-item label="策略名称">
                {{ versionDetail.version?.strategyName }}
              </el-descriptions-item>
              <el-descriptions-item label="版本名称">
                <el-input
                  v-if="!isViewMode"
                  v-model="versionDetail.version.versionName"
                  placeholder="版本名称"
                  class="!w-200px"
                />
                <span v-else>{{ versionDetail.version?.versionName || '-' }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="统计">
                <span>规则: {{ versionDetail.stats?.ruleCount || 0 }}</span>
                <span class="ml-10px">启用: {{ versionDetail.stats?.enabledRuleCount || 0 }}</span>
                <span class="ml-10px">范围: {{ versionDetail.stats?.scopeCount || 0 }}</span>
              </el-descriptions-item>
            </el-descriptions>
          </ContentWrap>

          <!-- 规则列表 -->
          <ContentWrap>
            <div class="section-header">
              <span class="section-title">规则配置</span>
              <el-button
                v-if="!isViewMode"
                type="primary"
                plain
                size="small"
                @click="handleAddRule"
              >
                <Icon icon="ep:plus" class="mr-5px" />添加规则
              </el-button>
            </div>

            <el-collapse v-model="expandedRules" accordion>
              <el-collapse-item v-for="(rule, index) in rules" :key="index" :name="index">
                <template #title>
                  <div class="rule-header">
                    <div class="rule-info">
                      <el-tag size="small" type="info">优先级 {{ rule.priority }}</el-tag>
                      <span class="rule-name">{{ rule.ruleName || '未命名规则' }}</span>
                      <el-tag v-if="!rule.enabled" size="small" type="warning">已禁用</el-tag>
                    </div>
                    <div v-if="!isViewMode" class="rule-actions" @click.stop>
                      <el-button link type="danger" size="small" @click="handleRemoveRule(index)">
                        删除
                      </el-button>
                    </div>
                  </div>
                </template>

                <!-- 规则详情 -->
                <div class="rule-content">
                  <el-form :model="rule" label-width="100px" :disabled="isViewMode">
                    <el-row :gutter="15">
                      <el-col :span="8">
                        <el-form-item label="规则编码">
                          <el-input v-model="rule.ruleCode" placeholder="规则编码" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="规则名称">
                          <el-input v-model="rule.ruleName" placeholder="规则名称" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="4">
                        <el-form-item label="优先级">
                          <el-input-number
                            v-model="rule.priority"
                            :min="1"
                            :max="999"
                            controls-position="right"
                          />
                        </el-form-item>
                      </el-col>
                      <el-col :span="2">
                        <el-form-item label="启用">
                          <el-switch v-model="rule.enabled" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="2">
                        <el-form-item label="命中停止">
                          <el-switch v-model="rule.stopOnHit" />
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <!-- 条件配置 -->
                    <el-form-item label="匹配条件">
                      <ConditionTreeEditor v-model="rule.conditionJson" :fields="fieldMeta" />
                    </el-form-item>

                    <!-- 动作配置 -->
                    <el-form-item label="执行动作">
                      <ActionParamEditor v-model="rule.actionJson" :disabled="isViewMode" />
                    </el-form-item>

                    <!-- 备注 -->
                    <el-form-item label="备注">
                      <el-input
                        v-model="rule.remark"
                        type="textarea"
                        :rows="2"
                        placeholder="规则备注"
                      />
                    </el-form-item>
                  </el-form>
                </div>
              </el-collapse-item>
            </el-collapse>

            <div v-if="rules.length === 0" class="empty-rules">
              <el-empty description="暂无规则，点击上方按钮添加" />
            </div>
          </ContentWrap>

          <!-- 适用范围配置 -->
          <ContentWrap class="mt-15px">
            <div class="section-header">
              <span class="section-title">适用范围配置</span>
              <el-button
                v-if="!isViewMode"
                type="primary"
                plain
                size="small"
                @click="handleAddScope"
              >
                <Icon icon="ep:plus" class="mr-5px" />添加范围
              </el-button>
            </div>

            <el-table v-if="scopes.length > 0" :data="scopes" border size="small">
              <el-table-column label="范围类型" prop="scopeType" width="120" align="center">
                <template #default="scope">
                  <el-tag>{{ getScopeTypeName(scope.row.scopeType) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="范围键" prop="scopeKey" min-width="150" />
              <el-table-column label="操作符" prop="scopeOperator" width="100" align="center">
                <template #default="scope">
                  {{ getOperatorName(scope.row.scopeOperator) }}
                </template>
              </el-table-column>
              <el-table-column label="范围值" prop="scopeValue" min-width="150" />
              <el-table-column label="启用" prop="enabled" width="80" align="center">
                <template #default="scope">
                  <el-tag :type="scope.row.enabled ? 'success' : 'info'" size="small">
                    {{ scope.row.enabled ? '是' : '否' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="备注" prop="remark" min-width="120" />
              <el-table-column v-if="!isViewMode" label="操作" width="120" align="center" fixed="right">
                <template #default="scope">
                  <el-button link type="primary" size="small" @click="handleEditScope(scope.$index)">
                    编辑
                  </el-button>
                  <el-button link type="danger" size="small" @click="handleRemoveScope(scope.$index)">
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <div v-else class="empty-rules">
              <el-empty description="暂无适用范围配置，策略将对所有场景生效" />
            </div>
          </ContentWrap>
        </el-col>

        <!-- 右侧：JSON预览 -->
        <el-col v-if="showJsonPreview" :span="8">
          <ContentWrap class="json-preview-panel">
            <div class="section-header">
              <span class="section-title">JSON预览</span>
            </div>
            <el-tabs v-model="previewTab">
              <el-tab-pane label="当前规则" name="current">
                <JsonPreview
                  v-if="currentRuleJson"
                  :value="currentRuleJson"
                  max-height="calc(100vh - 350px)"
                />
                <div v-else class="empty-preview">请选择一个规则查看</div>
              </el-tab-pane>
              <el-tab-pane label="全部规则" name="all">
                <JsonPreview :value="allRulesJson" max-height="calc(100vh - 350px)" />
              </el-tab-pane>
            </el-tabs>
          </ContentWrap>
        </el-col>
      </el-row>
    </div>

    <!-- 校验结果弹窗 -->
    <Dialog v-model="validateDialogVisible" title="校验结果" width="500px">
      <div v-if="validationResult">
        <el-alert
          :type="validationResult.valid ? 'success' : 'error'"
          :title="validationResult.valid ? '校验通过，可以发布' : '校验未通过'"
          :closable="false"
          show-icon
        />
        <div v-if="validationResult.errors?.length" class="validation-errors">
          <div v-for="(err, idx) in validationResult.errors" :key="idx" class="error-item">
            <el-tag type="danger" size="small">{{ err.code }}</el-tag>
            <span>{{ err.message }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="validateDialogVisible = false">关闭</el-button>
      </template>
    </Dialog>

    <!-- Scope编辑弹窗 -->
    <Dialog v-model="scopeDialogVisible" :title="scopeEditIndex >= 0 ? '编辑适用范围' : '添加适用范围'" width="550px">
      <el-form :model="scopeForm" label-width="100px">
        <el-form-item label="范围类型" required>
          <el-select v-model="scopeForm.scopeType" placeholder="选择范围类型" class="w-full" @change="handleScopeTypeChange">
            <el-option label="租户" value="TENANT" />
            <el-option label="仓库" value="WAREHOUSE" />
            <el-option label="业务属性" value="BIZ_ATTR" />
          </el-select>
        </el-form-item>
        <el-form-item label="范围键" required>
          <el-select
            v-if="scopeForm.scopeType === 'WAREHOUSE'"
            v-model="scopeForm.scopeKey"
            placeholder="选择范围键"
            class="w-full"
          >
            <el-option label="仓库ID (warehouseId)" value="warehouseId" />
            <el-option label="仓库编码 (warehouseCode)" value="warehouseCode" />
          </el-select>
          <el-input
            v-else
            v-model="scopeForm.scopeKey"
            :placeholder="scopeForm.scopeType === 'TENANT' ? 'tenantId' : '如: inboundType, materialCategory'"
          />
        </el-form-item>
        <el-form-item label="操作符" required>
          <el-select v-model="scopeForm.scopeOperator" placeholder="选择操作符" class="w-full">
            <el-option label="等于 (EQ)" value="EQ" />
            <el-option label="不等于 (NEQ)" value="NEQ" />
            <el-option label="包含于 (IN)" value="IN" />
            <el-option label="不包含于 (NOT_IN)" value="NOT_IN" />
          </el-select>
        </el-form-item>
        <el-form-item label="范围值" required>
          <el-input
            v-model="scopeForm.scopeValue"
            :placeholder="scopeForm.scopeOperator === 'IN' || scopeForm.scopeOperator === 'NOT_IN' ? '多个值用逗号分隔' : '输入值'"
          />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="scopeForm.enabled" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="scopeForm.remark" type="textarea" :rows="2" placeholder="备注说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="scopeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveScope">确定</el-button>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import * as StrategyApi from '@/api/mdm/strategy'
import type { FieldMetaDto } from '@/api/mdm/strategy'
import { ConditionTreeEditor, ActionParamEditor, JsonPreview } from '../components'

defineOptions({ name: 'VersionEditPage' })

const router = useRouter()
const route = useRoute()
const message = useMessage()

const versionId = computed(() => Number(route.params.id))
const isViewMode = computed(() => route.query.mode === 'view')

// 数据
const loading = ref(false)
const saving = ref(false)
const versionDetail = ref<any>({ version: {}, stats: {} })
const rules = ref<any[]>([])
const scopes = ref<any[]>([])
const fieldMeta = ref<FieldMetaDto[]>([])

// UI状态
const expandedRules = ref<number | undefined>(0)
const showJsonPreview = ref(false)
const previewTab = ref('current')
const validateDialogVisible = ref(false)
const validationResult = ref<any>(null)

// Scope编辑相关
const scopeDialogVisible = ref(false)
const scopeEditIndex = ref(-1)
const scopeForm = ref({
  scopeType: 'WAREHOUSE',
  scopeKey: 'warehouseId',
  scopeOperator: 'EQ',
  scopeValue: '',
  enabled: true,
  remark: ''
})

// 获取版本状态标签颜色
const getVersionStatusTag = (status: string) => {
  const tagMap: Record<string, string> = {
    DRAFT: 'info',
    PUBLISHED: 'success',
    ARCHIVED: 'warning'
  }
  return tagMap[status] || 'default'
}

// 当前选中规则的JSON
const currentRuleJson = computed(() => {
  if (expandedRules.value === undefined) return null
  const rule = rules.value[expandedRules.value]
  if (!rule) return null
  return {
    ruleCode: rule.ruleCode,
    ruleName: rule.ruleName,
    priority: rule.priority,
    enabled: rule.enabled,
    stopOnHit: rule.stopOnHit,
    condition: safeParseJson(rule.conditionJson),
    action: safeParseJson(rule.actionJson)
  }
})

// 全部规则JSON
const allRulesJson = computed(() => {
  return rules.value.map((rule) => ({
    ruleCode: rule.ruleCode,
    ruleName: rule.ruleName,
    priority: rule.priority,
    enabled: rule.enabled,
    condition: safeParseJson(rule.conditionJson),
    action: safeParseJson(rule.actionJson)
  }))
})

// 安全解析JSON
const safeParseJson = (json: string) => {
  try {
    return JSON.parse(json || '{}')
  } catch {
    return {}
  }
}

// 获取版本编辑详情
const getVersionDetail = async () => {
  loading.value = true
  try {
    const data = await StrategyApi.getVersionEditorDetail(versionId.value)
    versionDetail.value = data
    rules.value = (data.rules || []).map((r: any) => ({
      ...r,
      enabled: r.enabled ?? true,
      stopOnHit: r.stopOnHit ?? true,
      conditionJson: r.conditionJson || '{}',
      actionJson: r.actionJson || '{}'
    }))
    scopes.value = (data.scopes || []).map((s: any) => ({
      ...s,
      enabled: s.enabled ?? true
    }))
  } finally {
    loading.value = false
  }
}

// 获取字段元数据
const getFieldMeta = async () => {
  try {
    const strategyType = versionDetail.value.version?.strategyType || 'PUTAWAY'
    fieldMeta.value = await StrategyApi.getFieldMeta(strategyType)
  } catch {
    // 使用默认空数组
    fieldMeta.value = []
  }
}

// 返回
const goBack = () => {
  router.back()
}

// 切换JSON预览
const toggleJsonPreview = () => {
  showJsonPreview.value = !showJsonPreview.value
}

// 添加规则
const handleAddRule = () => {
  const maxPriority = rules.value.reduce((max, r) => Math.max(max, r.priority || 0), 0)
  rules.value.push({
    id: undefined,
    strategyId: versionDetail.value.version?.strategyId,
    versionId: versionId.value,
    ruleCode: `RULE_${Date.now()}`,
    ruleName: '',
    priority: maxPriority + 10,
    enabled: true,
    stopOnHit: true,
    conditionJson: '{}',
    actionJson: '{"actionType":"PUTAWAY_RECOMMEND","mode":"NEARBY","topN":5}',
    remark: ''
  })
  expandedRules.value = rules.value.length - 1
}

// 删除规则
const handleRemoveRule = (index: number) => {
  rules.value.splice(index, 1)
  if (expandedRules.value === index) {
    expandedRules.value = undefined
  }
}

// 保存
const handleSave = async () => {
  // 验证
  for (const rule of rules.value) {
    if (!rule.ruleName) {
      message.error('规则名称不能为空')
      return
    }
  }

  saving.value = true
  try {
    // 1. 保存版本信息（版本名称）
    await StrategyApi.updateVersion({
      id: versionId.value,
      versionName: versionDetail.value.version?.versionName || '',
      remark: versionDetail.value.version?.remark
    })

    // 2. 保存规则
    const saveRules = rules.value.map((r) => ({
      strategyId: versionDetail.value.version?.strategyId,
      versionId: versionId.value,
      ruleCode: r.ruleCode,
      ruleName: r.ruleName,
      priority: r.priority,
      enabled: r.enabled,
      stopOnHit: r.stopOnHit,
      conditionJson: r.conditionJson,
      actionJson: r.actionJson,
      remark: r.remark
    }))
    await StrategyApi.batchSaveRules(versionId.value, saveRules)

    // 3. 保存适用范围
    const saveScopes = scopes.value.map((s) => ({
      strategyId: versionDetail.value.version?.strategyId,
      versionId: versionId.value,
      scopeType: s.scopeType,
      scopeKey: s.scopeKey,
      scopeOperator: s.scopeOperator,
      scopeValue: s.scopeValue,
      enabled: s.enabled,
      remark: s.remark
    }))
    await StrategyApi.batchSaveScopes(versionId.value, saveScopes)

    message.success('保存成功')
    await getVersionDetail()
  } finally {
    saving.value = false
  }
}

// ==================== Scope操作方法 ====================

// 获取范围类型名称
const getScopeTypeName = (type: string) => {
  const map: Record<string, string> = {
    TENANT: '租户',
    WAREHOUSE: '仓库',
    BIZ_ATTR: '业务属性'
  }
  return map[type] || type
}

// 获取操作符名称
const getOperatorName = (op: string) => {
  const map: Record<string, string> = {
    EQ: '等于',
    NEQ: '不等于',
    IN: '包含于',
    NOT_IN: '不包含于'
  }
  return map[op] || op
}

// 添加Scope
const handleAddScope = () => {
  scopeEditIndex.value = -1
  scopeForm.value = {
    scopeType: 'WAREHOUSE',
    scopeKey: 'warehouseId',
    scopeOperator: 'EQ',
    scopeValue: '',
    enabled: true,
    remark: ''
  }
  scopeDialogVisible.value = true
}

// 编辑Scope
const handleEditScope = (index: number) => {
  scopeEditIndex.value = index
  const scope = scopes.value[index]
  scopeForm.value = {
    scopeType: scope.scopeType,
    scopeKey: scope.scopeKey,
    scopeOperator: scope.scopeOperator,
    scopeValue: scope.scopeValue,
    enabled: scope.enabled,
    remark: scope.remark || ''
  }
  scopeDialogVisible.value = true
}

// 删除Scope
const handleRemoveScope = (index: number) => {
  scopes.value.splice(index, 1)
}

// 保存Scope（弹窗确定）
const handleSaveScope = () => {
  if (!scopeForm.value.scopeType || !scopeForm.value.scopeKey || !scopeForm.value.scopeValue) {
    message.error('请填写完整的范围配置')
    return
  }

  const scopeData = { ...scopeForm.value }

  if (scopeEditIndex.value >= 0) {
    // 编辑模式
    scopes.value[scopeEditIndex.value] = scopeData
  } else {
    // 新增模式
    scopes.value.push(scopeData)
  }

  scopeDialogVisible.value = false
}

// 范围类型变化时设置默认范围键
const handleScopeTypeChange = (type: string) => {
  if (type === 'TENANT') {
    scopeForm.value.scopeKey = 'tenantId'
  } else if (type === 'WAREHOUSE') {
    scopeForm.value.scopeKey = 'warehouseId'
  } else {
    scopeForm.value.scopeKey = ''
  }
}

// 校验
const handleValidate = async () => {
  try {
    validationResult.value = await StrategyApi.validateVersion(versionId.value)
    validateDialogVisible.value = true
  } catch {}
}

// 初始化
onMounted(async () => {
  await getVersionDetail()
  await getFieldMeta()
})
</script>

<style lang="scss" scoped>
.version-edit-page {
  min-height: 100%;
  background-color: #f5f7fa;
}

.page-header {
  position: sticky;
  top: 0;
  z-index: 10;
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

.rule-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-right: 15px;
}

.rule-info {
  display: flex;
  gap: 10px;
  align-items: center;
}

.rule-name {
  font-weight: 500;
}

.rule-content {
  padding: 15px;
  background-color: #fafafa;
}

.empty-rules {
  padding: 40px 0;
}

.json-preview-panel {
  position: sticky;
  top: 80px;
}

.empty-preview {
  padding: 40px;
  color: #909399;
  text-align: center;
}

.validation-errors {
  margin-top: 15px;
}

.error-item {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 8px 0;
  font-size: 13px;
  border-bottom: 1px dashed #e4e7ed;

  &:last-child {
    border-bottom: none;
  }
}

.w-full {
  width: 100%;
}
</style>

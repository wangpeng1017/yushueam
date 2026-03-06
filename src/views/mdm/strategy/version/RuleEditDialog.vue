<!-- Author [system],  Since 2026-02-24,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <Dialog v-model="dialogVisible" title="编辑规则" width="1100px">
    <div class="rule-edit-container">
      <!-- 工具栏 -->
      <div class="mb-10px">
        <el-button type="primary" plain @click="handleAddRule">
          <Icon class="mr-5px" icon="ep:plus" />&nbsp;添加规则
        </el-button>
        <el-button type="success" plain @click="handleSave" :loading="saving">
          <Icon class="mr-5px" icon="ep:check" />&nbsp;保存全部
        </el-button>
      </div>

      <!-- 规则列表 -->
      <el-table v-loading="loading" :data="ruleList" border row-key="id">
        <el-table-column label="优先级" align="center" width="100">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.priority"
              :min="1"
              :max="999"
              size="small"
              controls-position="right"
            />
          </template>
        </el-table-column>
        <el-table-column label="规则编码" align="center" width="130">
          <template #default="scope">
            <el-input v-model="scope.row.ruleCode" size="small" placeholder="编码" />
          </template>
        </el-table-column>
        <el-table-column label="规则名称" align="center" min-width="150">
          <template #default="scope">
            <el-input v-model="scope.row.ruleName" size="small" placeholder="名称" />
          </template>
        </el-table-column>
        <el-table-column label="启用" align="center" width="70">
          <template #default="scope">
            <el-switch v-model="scope.row.enabled" />
          </template>
        </el-table-column>
        <el-table-column label="命中停止" align="center" width="80">
          <template #default="scope">
            <el-switch v-model="scope.row.stopOnHit" />
          </template>
        </el-table-column>
        <el-table-column label="条件配置" align="center" width="120">
          <template #default="scope">
            <el-button link type="primary" @click="editCondition(scope.row, scope.$index)">
              编辑条件
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="动作配置" align="center" width="120">
          <template #default="scope">
            <el-button link type="primary" @click="editAction(scope.row, scope.$index)">
              编辑动作
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="80" fixed="right">
          <template #default="scope">
            <el-button link class="btn-delete" @click="handleRemoveRule(scope.$index)">
              &nbsp;删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- JSON编辑弹窗 -->
    <Dialog v-model="jsonEditorVisible" :title="jsonEditorTitle" width="700px">
      <el-input
        v-model="currentJson"
        type="textarea"
        :rows="15"
        placeholder="请输入JSON配置"
        class="json-editor"
      />
      <div class="mt-10px">
        <el-alert type="info" :closable="false">
          <template v-if="jsonEditorType === 'condition'">
            <div>条件JSON示例：</div>
            <pre class="example-json">{{ conditionExample }}</pre>
          </template>
          <template v-else>
            <div>动作JSON示例（上架策略）：</div>
            <pre class="example-json">{{ actionExample }}</pre>
          </template>
        </el-alert>
      </div>
      <template #footer>
        <el-button @click="jsonEditorVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveJson">确 定</el-button>
      </template>
    </Dialog>
  </Dialog>
</template>

<script lang="ts" setup>
import * as StrategyApi from '@/api/mdm/strategy'

defineOptions({ name: 'RuleEditDialog' })

const message = useMessage()

const dialogVisible = ref(false)
const loading = ref(false)
const saving = ref(false)
const currentVersion = ref<any>({})
const ruleList = ref<any[]>([])

// JSON编辑器状态
const jsonEditorVisible = ref(false)
const jsonEditorTitle = ref('')
const jsonEditorType = ref<'condition' | 'action'>('condition')
const currentJson = ref('')
const currentEditIndex = ref(-1)

// 示例JSON
const conditionExample = `{
  "and": [
    { "field": "material.materialCategory", "operator": "EQ", "value": "RAW" },
    { "field": "qty", "operator": "GT", "value": 100 }
  ]
}`

const actionExample = `{
  "mode": "FIXED_THEN_NEARBY_THEN_SAME_SKU",
  "topN": 5,
  "maxDistance": 50,
  "stopAtFirstNonEmpty": true,
  "config": {
    "locationCode": "A-01-01",
    "materialCategory": "RAW"
  }
}`

/** 打开弹窗 */
const open = async (version: any) => {
  dialogVisible.value = true
  currentVersion.value = version
  await getRules()
}
defineExpose({ open })

/** 获取规则列表 */
const getRules = async () => {
  loading.value = true
  try {
    const data = await StrategyApi.getRulesByVersionId(currentVersion.value.id)
    ruleList.value = data.map((item: any) => ({
      ...item,
      enabled: item.enabled ?? true,
      stopOnHit: item.stopOnHit ?? true
    }))
  } finally {
    loading.value = false
  }
}

/** 添加规则 */
const handleAddRule = () => {
  const maxPriority = ruleList.value.reduce((max, item) => Math.max(max, item.priority || 0), 0)
  ruleList.value.push({
    id: undefined,
    strategyId: currentVersion.value.strategyId,
    versionId: currentVersion.value.id,
    ruleCode: '',
    ruleName: '',
    priority: maxPriority + 10,
    enabled: true,
    stopOnHit: true,
    conditionJson: '{}',
    actionJson: '{}'
  })
}

/** 删除规则 */
const handleRemoveRule = (index: number) => {
  ruleList.value.splice(index, 1)
}

/** 编辑条件 */
const editCondition = (row: any, index: number) => {
  jsonEditorTitle.value = '编辑条件'
  jsonEditorType.value = 'condition'
  currentEditIndex.value = index
  try {
    currentJson.value = JSON.stringify(JSON.parse(row.conditionJson || '{}'), null, 2)
  } catch {
    currentJson.value = row.conditionJson || '{}'
  }
  jsonEditorVisible.value = true
}

/** 编辑动作 */
const editAction = (row: any, index: number) => {
  jsonEditorTitle.value = '编辑动作'
  jsonEditorType.value = 'action'
  currentEditIndex.value = index
  try {
    currentJson.value = JSON.stringify(JSON.parse(row.actionJson || '{}'), null, 2)
  } catch {
    currentJson.value = row.actionJson || '{}'
  }
  jsonEditorVisible.value = true
}

/** 保存JSON */
const saveJson = () => {
  try {
    // 验证JSON格式
    JSON.parse(currentJson.value)
    if (jsonEditorType.value === 'condition') {
      ruleList.value[currentEditIndex.value].conditionJson = currentJson.value
    } else {
      ruleList.value[currentEditIndex.value].actionJson = currentJson.value
    }
    jsonEditorVisible.value = false
  } catch (e) {
    message.error('JSON格式不正确，请检查')
  }
}

/** 保存全部规则 */
const emit = defineEmits(['success'])
const handleSave = async () => {
  // 验证规则
  for (const rule of ruleList.value) {
    if (!rule.ruleName) {
      message.error('规则名称不能为空')
      return
    }
    try {
      JSON.parse(rule.conditionJson || '{}')
      JSON.parse(rule.actionJson || '{}')
    } catch {
      message.error(`规则【${rule.ruleName}】的JSON配置格式不正确`)
      return
    }
  }

  saving.value = true
  try {
    const rules = ruleList.value.map((item) => ({
      strategyId: currentVersion.value.strategyId,
      versionId: currentVersion.value.id,
      ruleCode: item.ruleCode,
      ruleName: item.ruleName,
      priority: item.priority,
      enabled: item.enabled,
      stopOnHit: item.stopOnHit,
      conditionJson: item.conditionJson,
      actionJson: item.actionJson,
      remark: item.remark
    }))
    await StrategyApi.batchSaveRules(currentVersion.value.id, rules)
    message.success('保存成功')
    emit('success')
    dialogVisible.value = false
  } finally {
    saving.value = false
  }
}
</script>

<style lang="scss" scoped>
.rule-edit-container {
  min-height: 400px;
}

.json-editor {
  font-family: 'Courier New', monospace;
}

.example-json {
  padding: 10px;
  margin-top: 5px;
  font-size: 12px;
  word-wrap: break-word;
  white-space: pre-wrap;
  background-color: #f5f5f5;
  border-radius: 4px;
}

:deep(.el-button.btn-delete) {
  color: #d54941;

  &:hover {
    color: rgb(213 73 65 / 75%);
  }
}
</style>

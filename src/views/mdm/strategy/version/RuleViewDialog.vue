<!-- Author [system],  Since 2026-02-24,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <Dialog v-model="dialogVisible" title="规则详情" width="900px">
    <el-table v-loading="loading" :data="ruleList" border>
      <el-table-column label="优先级" align="center" prop="priority" width="80" />
      <el-table-column label="规则编码" align="center" prop="ruleCode" width="120" />
      <el-table-column label="规则名称" align="center" prop="ruleName" min-width="150" />
      <el-table-column label="启用" align="center" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.enabled ? 'success' : 'danger'">
            {{ scope.row.enabled ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="命中停止" align="center" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.stopOnHit ? 'warning' : 'info'">
            {{ scope.row.stopOnHit ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="条件" align="center" min-width="200">
        <template #default="scope">
          <el-button link type="primary" @click="showJson('条件', scope.row.conditionJson)">
            查看条件
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="动作" align="center" min-width="200">
        <template #default="scope">
          <el-button link type="primary" @click="showJson('动作', scope.row.actionJson)">
            查看动作
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- JSON查看弹窗 -->
    <Dialog v-model="jsonDialogVisible" :title="jsonDialogTitle" width="600px">
      <pre class="json-content">{{ formattedJson }}</pre>
    </Dialog>
  </Dialog>
</template>

<script lang="ts" setup>
import * as StrategyApi from '@/api/mdm/strategy'

defineOptions({ name: 'RuleViewDialog' })

const dialogVisible = ref(false)
const loading = ref(false)
const currentVersion = ref<any>({})
const ruleList = ref([])

const jsonDialogVisible = ref(false)
const jsonDialogTitle = ref('')
const formattedJson = ref('')

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
    ruleList.value = await StrategyApi.getRulesByVersionId(currentVersion.value.id)
  } finally {
    loading.value = false
  }
}

/** 显示JSON */
const showJson = (title: string, json: string) => {
  jsonDialogTitle.value = title
  try {
    formattedJson.value = JSON.stringify(JSON.parse(json), null, 2)
  } catch {
    formattedJson.value = json
  }
  jsonDialogVisible.value = true
}
</script>

<style lang="scss" scoped>
.json-content {
  max-height: 400px;
  padding: 15px;
  overflow: auto;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  word-wrap: break-word;
  white-space: pre-wrap;
  background-color: #f5f5f5;
  border-radius: 4px;
}
</style>

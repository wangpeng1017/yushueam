<!-- Author [system],  Since 2026-02-24,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <Dialog v-model="dialogVisible" title="发布版本" width="500px">
    <div v-loading="validating" class="publish-dialog">
      <!-- 版本信息 -->
      <el-descriptions :column="2" border class="mb-15px">
        <el-descriptions-item label="策略">{{ strategy.strategyName }}</el-descriptions-item>
        <el-descriptions-item label="待发布版本">V{{ version.versionNo }}</el-descriptions-item>
      </el-descriptions>

      <!-- 校验结果 -->
      <div v-if="validationResult" class="validation-result">
        <el-alert
          :type="validationResult.valid ? 'success' : 'error'"
          :title="validationResult.valid ? '校验通过' : '校验未通过'"
          :closable="false"
          show-icon
        >
          <template v-if="validationResult.stats">
            <div class="stats-info">
              规则数：{{ validationResult.stats.ruleCount }}， 启用规则：{{
                validationResult.stats.enabledRuleCount
              }}， 作用域：{{ validationResult.stats.scopeCount }}
            </div>
          </template>
        </el-alert>

        <div v-if="validationResult.errors?.length" class="error-list">
          <div class="error-title">校验错误：</div>
          <div v-for="(err, idx) in validationResult.errors" :key="idx" class="error-item">
            <el-tag type="danger" size="small">{{ err.code }}</el-tag>
            <span class="error-message">{{ err.message }}</span>
            <span v-if="err.ruleName" class="error-rule">（{{ err.ruleName }}）</span>
          </div>
        </div>
      </div>

      <!-- 发布备注 -->
      <el-form v-if="validationResult?.valid" :model="formData" label-width="80px" class="mt-15px">
        <el-form-item label="发布备注">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入发布备注（可选）"
          />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button
        v-if="!validationResult"
        type="primary"
        :loading="validating"
        @click="handleValidate"
      >
        校验版本
      </el-button>
      <el-button
        v-if="validationResult?.valid"
        type="success"
        :loading="publishing"
        @click="handlePublish"
      >
        确认发布
      </el-button>
      <el-button
        v-if="validationResult && !validationResult.valid"
        type="warning"
        @click="handleRevalidate"
      >
        重新校验
      </el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import * as StrategyApi from '@/api/mdm/strategy'

defineOptions({ name: 'PublishDialog' })

const message = useMessage()
const emit = defineEmits(['success'])

const dialogVisible = ref(false)
const validating = ref(false)
const publishing = ref(false)
const strategy = ref<any>({})
const version = ref<any>({})
const validationResult = ref<any>(null)
const formData = reactive({
  remark: ''
})

// 打开弹窗
const open = (strategyData: any, versionData: any) => {
  strategy.value = strategyData
  version.value = versionData
  validationResult.value = null
  formData.remark = ''
  dialogVisible.value = true
}
defineExpose({ open })

// 校验版本
const handleValidate = async () => {
  validating.value = true
  try {
    validationResult.value = await StrategyApi.validateVersion(version.value.id)
  } finally {
    validating.value = false
  }
}

// 重新校验
const handleRevalidate = () => {
  validationResult.value = null
  handleValidate()
}

// 确认发布
const handlePublish = async () => {
  publishing.value = true
  try {
    await StrategyApi.publishVersion({
      strategyId: strategy.value.id,
      versionId: version.value.id,
      remark: formData.remark
    })
    message.success('发布成功')
    dialogVisible.value = false
    emit('success')
  } finally {
    publishing.value = false
  }
}
</script>

<style lang="scss" scoped>
.publish-dialog {
  min-height: 150px;
}

.validation-result {
  margin-top: 10px;
}

.stats-info {
  margin-top: 5px;
  font-size: 13px;
}

.error-list {
  padding: 10px;
  margin-top: 15px;
  background-color: #fef0f0;
  border-radius: 4px;
}

.error-title {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #f56c6c;
}

.error-item {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 5px 0;
  font-size: 13px;
}

.error-message {
  color: #606266;
}

.error-rule {
  color: #909399;
}
</style>

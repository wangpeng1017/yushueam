<!-- Author [system],  Since 2026-02-24,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <Dialog v-model="dialogVisible" title="回滚版本" width="500px">
    <div class="rollback-dialog">
      <!-- 警告提示 -->
      <el-alert type="warning" title="回滚操作提示" :closable="false" show-icon class="mb-15px">
        <div>回滚后，当前生效版本将被归档，目标版本将成为新的生效版本。</div>
        <div>此操作不可逆，请确认后操作。</div>
      </el-alert>

      <!-- 版本信息 -->
      <el-descriptions :column="1" border>
        <el-descriptions-item label="策略">{{ strategy.strategyName }}</el-descriptions-item>
        <el-descriptions-item label="当前生效版本">
          <el-tag type="success">V{{ strategy.currentVersionNo }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="回滚目标版本">
          <el-tag type="warning">V{{ version.versionNo }}</el-tag>
          <span class="version-name">{{ version.versionName }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="目标版本发布时间">
          {{ formatDate(version.publishedAt) }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 回滚备注 -->
      <el-form :model="formData" label-width="80px" class="mt-15px">
        <el-form-item label="回滚原因">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入回滚原因（建议填写）"
          />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="warning" :loading="submitting" @click="handleRollback"> 确认回滚 </el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import * as StrategyApi from '@/api/mdm/strategy'
import { formatDate } from '@/utils/formatTime'

defineOptions({ name: 'RollbackDialog' })

const message = useMessage()
const emit = defineEmits(['success'])

const dialogVisible = ref(false)
const submitting = ref(false)
const strategy = ref<any>({})
const version = ref<any>({})
const formData = reactive({
  remark: ''
})

// 打开弹窗
const open = (strategyData: any, versionData: any) => {
  strategy.value = strategyData
  version.value = versionData
  formData.remark = ''
  dialogVisible.value = true
}
defineExpose({ open })

// 确认回滚
const handleRollback = async () => {
  submitting.value = true
  try {
    await StrategyApi.rollbackVersion({
      strategyId: strategy.value.id,
      targetVersionId: version.value.id,
      remark: formData.remark
    })
    message.success('回滚成功')
    dialogVisible.value = false
    emit('success')
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
.rollback-dialog {
  min-height: 150px;
}

.version-name {
  margin-left: 10px;
  color: #606266;
}
</style>

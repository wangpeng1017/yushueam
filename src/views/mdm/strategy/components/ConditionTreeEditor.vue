<!-- Author [system],  Since 2026-02-24,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <div class="condition-tree-editor">
    <ConditionGroup
      v-if="conditionData"
      :group="conditionData"
      :fields="fields"
      :depth="0"
      :max-depth="maxDepth"
      @update="handleUpdate"
      @remove="handleRemoveRoot"
    />
    <div v-else class="empty-condition">
      <el-button type="primary" plain size="small" @click="initCondition">
        <Icon icon="ep:plus" class="mr-5px" />添加条件
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FieldMetaDto } from '@/api/mdm/strategy'
import ConditionGroup from './ConditionGroup.vue'

defineOptions({ name: 'ConditionTreeEditor' })

interface ConditionItem {
  field?: string
  operator?: string
  value?: any
}

interface ConditionGroupData {
  operator: 'AND' | 'OR'
  conditions: (ConditionItem | ConditionGroupData)[]
}

const props = defineProps<{
  modelValue: string
  fields: FieldMetaDto[]
  maxDepth?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const maxDepth = computed(() => props.maxDepth ?? 2)

const conditionData = ref<ConditionGroupData | null>(null)

// 解析JSON为条件数据
const parseCondition = (json: string): ConditionGroupData | null => {
  if (!json || json === '{}' || json === 'null') return null
  try {
    const parsed = JSON.parse(json)
    if (!parsed || Object.keys(parsed).length === 0) return null
    // 检查是否有operator字段
    if (parsed.operator && Array.isArray(parsed.conditions)) {
      return parsed as ConditionGroupData
    }
    return null
  } catch {
    return null
  }
}

// 序列化条件数据为JSON
const serializeCondition = (data: ConditionGroupData | null): string => {
  if (!data) return '{}'
  return JSON.stringify(data)
}

// 初始化条件
const initCondition = () => {
  conditionData.value = {
    operator: 'AND',
    conditions: []
  }
  emitUpdate()
}

// 处理更新
const handleUpdate = (newData: ConditionGroupData) => {
  conditionData.value = newData
  emitUpdate()
}

// 处理删除根节点
const handleRemoveRoot = () => {
  conditionData.value = null
  emitUpdate()
}

// 发送更新事件
const emitUpdate = () => {
  emit('update:modelValue', serializeCondition(conditionData.value))
}

// 监听外部值变化
watch(
  () => props.modelValue,
  (newVal) => {
    const parsed = parseCondition(newVal)
    conditionData.value = parsed
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.condition-tree-editor {
  min-height: 100px;
  padding: 10px;
  background-color: #fafafa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.empty-condition {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  color: #909399;
}
</style>

<!-- Author [system],  Since 2026-02-24,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <div class="condition-group" :class="{ 'nested-group': depth > 0 }">
    <!-- 组头部：操作符选择和操作按钮 -->
    <div class="group-header">
      <el-radio-group v-model="localOperator" size="small" @change="handleOperatorChange">
        <el-radio-button value="AND">且 (AND)</el-radio-button>
        <el-radio-button value="OR">或 (OR)</el-radio-button>
      </el-radio-group>
      <div class="group-actions">
        <el-button type="primary" link size="small" @click="addCondition">
          <Icon icon="ep:plus" class="mr-3px" />条件
        </el-button>
        <el-button v-if="depth < maxDepth" type="success" link size="small" @click="addGroup">
          <Icon icon="ep:folder-add" class="mr-3px" />条件组
        </el-button>
        <el-button type="danger" link size="small" @click="handleRemove">
          <Icon icon="ep:delete" class="mr-3px" />删除组
        </el-button>
      </div>
    </div>

    <!-- 条件列表 -->
    <div class="conditions-list">
      <div v-for="(item, index) in localConditions" :key="index" class="condition-item">
        <!-- 嵌套组 -->
        <template v-if="isGroup(item)">
          <ConditionGroup
            :group="item"
            :fields="fields"
            :depth="depth + 1"
            :max-depth="maxDepth"
            @update="(data) => updateCondition(index, data)"
            @remove="removeCondition(index)"
          />
        </template>
        <!-- 单个条件 -->
        <template v-else>
          <ConditionRow
            :condition="item"
            :fields="fields"
            @update="(data) => updateCondition(index, data)"
            @remove="removeCondition(index)"
          />
        </template>
      </div>

      <div v-if="localConditions.length === 0" class="empty-tip"> 点击上方按钮添加条件 </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FieldMetaDto } from '@/api/mdm/strategy'
import ConditionRow from './ConditionRow.vue'

defineOptions({ name: 'ConditionGroup' })

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
  group: ConditionGroupData
  fields: FieldMetaDto[]
  depth: number
  maxDepth: number
}>()

const emit = defineEmits<{
  (e: 'update', data: ConditionGroupData): void
  (e: 'remove'): void
}>()

const localOperator = ref<'AND' | 'OR'>(props.group.operator || 'AND')
const localConditions = ref<(ConditionItem | ConditionGroupData)[]>([...props.group.conditions])

// 判断是否为条件组
const isGroup = (item: ConditionItem | ConditionGroupData): item is ConditionGroupData => {
  return 'operator' in item && 'conditions' in item
}

// 处理操作符变化
const handleOperatorChange = () => {
  emitUpdate()
}

// 添加单个条件
const addCondition = () => {
  localConditions.value.push({
    field: '',
    operator: 'EQ',
    value: ''
  })
  emitUpdate()
}

// 添加条件组
const addGroup = () => {
  localConditions.value.push({
    operator: 'AND',
    conditions: []
  })
  emitUpdate()
}

// 更新条件
const updateCondition = (index: number, data: ConditionItem | ConditionGroupData) => {
  localConditions.value[index] = data
  emitUpdate()
}

// 删除条件
const removeCondition = (index: number) => {
  localConditions.value.splice(index, 1)
  emitUpdate()
}

// 删除本组
const handleRemove = () => {
  emit('remove')
}

// 发送更新事件
const emitUpdate = () => {
  emit('update', {
    operator: localOperator.value,
    conditions: localConditions.value
  })
}

// 监听外部变化
watch(
  () => props.group,
  (newVal) => {
    localOperator.value = newVal.operator || 'AND'
    localConditions.value = [...newVal.conditions]
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
.condition-group {
  padding: 10px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;

  &.nested-group {
    margin-top: 8px;
    background-color: #f5f7fa;
    border-color: #c0c4cc;
  }
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px dashed #e4e7ed;
}

.group-actions {
  display: flex;
  gap: 5px;
}

.conditions-list {
  min-height: 40px;
}

.condition-item {
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
}

.empty-tip {
  padding: 15px;
  font-size: 12px;
  color: #909399;
  text-align: center;
}
</style>

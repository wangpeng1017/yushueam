<!-- Author [system],  Since 2026-02-24,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <div class="condition-row">
    <!-- 字段选择 -->
    <el-select
      v-model="localField"
      placeholder="选择字段"
      filterable
      class="field-select"
      @change="handleFieldChange"
    >
      <el-option-group
        v-for="(groupFields, domain) in fieldsByDomain"
        :key="domain"
        :label="domainLabels[domain] || domain"
      >
        <el-option
          v-for="field in groupFields"
          :key="field.fieldKey"
          :label="field.fieldName"
          :value="field.fieldKey"
        >
          <span>{{ field.fieldName }}</span>
          <span class="field-key-hint">{{ field.fieldKey }}</span>
        </el-option>
      </el-option-group>
    </el-select>

    <!-- 操作符选择 -->
    <el-select
      v-model="localOperator"
      placeholder="操作符"
      class="operator-select"
      @change="handleOperatorChange"
    >
      <el-option
        v-for="op in availableOperators"
        :key="op"
        :label="operatorLabels[op] || op"
        :value="op"
      />
    </el-select>

    <!-- 值输入 -->
    <template v-if="!isNoValueOperator">
      <!-- 枚举类型：下拉选择 -->
      <el-select
        v-if="currentField?.dataType === 'ENUM'"
        v-model="localValue"
        placeholder="选择值"
        :multiple="isMultiValueOperator"
        class="value-input"
        @change="handleValueChange"
      >
        <el-option
          v-for="enumVal in currentField?.enumValues || []"
          :key="enumVal.value"
          :label="enumVal.label"
          :value="enumVal.value"
        />
      </el-select>
      <!-- 布尔类型：开关 -->
      <el-select
        v-else-if="currentField?.dataType === 'BOOLEAN'"
        v-model="localValue"
        placeholder="选择值"
        class="value-input"
        @change="handleValueChange"
      >
        <el-option label="是" :value="true" />
        <el-option label="否" :value="false" />
      </el-select>
      <!-- 数字类型 -->
      <el-input-number
        v-else-if="currentField?.dataType === 'NUMBER'"
        v-model="localValue"
        placeholder="输入数值"
        class="value-input"
        controls-position="right"
        @change="handleValueChange"
      />
      <!-- IN/NOT_IN 多值输入 -->
      <el-select
        v-else-if="isMultiValueOperator"
        v-model="localValue"
        multiple
        filterable
        allow-create
        default-first-option
        placeholder="输入多个值，回车确认"
        class="value-input multi-value"
        @change="handleValueChange"
      />
      <!-- 默认文本输入 -->
      <el-input
        v-else
        v-model="localValue"
        placeholder="输入值"
        class="value-input"
        @input="handleValueChange"
      />
    </template>

    <!-- 删除按钮 -->
    <el-button type="danger" link class="remove-btn" @click="handleRemove">
      <Icon icon="ep:close" />
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import type { FieldMetaDto } from '@/api/mdm/strategy'

defineOptions({ name: 'ConditionRow' })

interface ConditionItem {
  field?: string
  operator?: string
  value?: any
}

const props = defineProps<{
  condition: ConditionItem
  fields: FieldMetaDto[]
}>()

const emit = defineEmits<{
  (e: 'update', data: ConditionItem): void
  (e: 'remove'): void
}>()

// 本地状态
const localField = ref(props.condition.field || '')
const localOperator = ref(props.condition.operator || 'EQ')
const localValue = ref<any>(props.condition.value ?? '')

// 域名标签
const domainLabels: Record<string, string> = {
  asn_head: 'ASN单头',
  asn_item: 'ASN明细',
  material: '物料信息',
  runtime: '运行时'
}

// 操作符标签
const operatorLabels: Record<string, string> = {
  EQ: '等于',
  NE: '不等于',
  GT: '大于',
  GE: '大于等于',
  LT: '小于',
  LE: '小于等于',
  IN: '在列表中',
  NOT_IN: '不在列表中',
  LIKE: '包含',
  NOT_LIKE: '不包含',
  IS_NULL: '为空',
  IS_NOT_NULL: '不为空',
  BETWEEN: '范围内'
}

// 按域分组字段
const fieldsByDomain = computed(() => {
  const grouped: Record<string, FieldMetaDto[]> = {}
  for (const field of props.fields) {
    const domain = field.domain || 'default'
    if (!grouped[domain]) {
      grouped[domain] = []
    }
    grouped[domain].push(field)
  }
  return grouped
})

// 当前选中的字段
const currentField = computed(() => {
  return props.fields.find((f) => f.fieldKey === localField.value)
})

// 可用的操作符
const availableOperators = computed(() => {
  if (currentField.value?.operators?.length) {
    return currentField.value.operators
  }
  // 默认操作符
  return ['EQ', 'NE', 'GT', 'GE', 'LT', 'LE', 'IN', 'NOT_IN', 'LIKE', 'IS_NULL', 'IS_NOT_NULL']
})

// 是否为无值操作符
const isNoValueOperator = computed(() => {
  return ['IS_NULL', 'IS_NOT_NULL'].includes(localOperator.value)
})

// 是否为多值操作符
const isMultiValueOperator = computed(() => {
  return ['IN', 'NOT_IN'].includes(localOperator.value)
})

// 字段变化处理
const handleFieldChange = () => {
  // 重置操作符和值
  if (!availableOperators.value.includes(localOperator.value)) {
    localOperator.value = availableOperators.value[0] || 'EQ'
  }
  localValue.value = isMultiValueOperator.value ? [] : ''
  emitUpdate()
}

// 操作符变化处理
const handleOperatorChange = () => {
  // 多值操作符需要数组
  if (isMultiValueOperator.value && !Array.isArray(localValue.value)) {
    localValue.value = localValue.value ? [localValue.value] : []
  } else if (!isMultiValueOperator.value && Array.isArray(localValue.value)) {
    localValue.value = localValue.value[0] || ''
  }
  emitUpdate()
}

// 值变化处理
const handleValueChange = () => {
  emitUpdate()
}

// 删除处理
const handleRemove = () => {
  emit('remove')
}

// 发送更新
const emitUpdate = () => {
  emit('update', {
    field: localField.value,
    operator: localOperator.value,
    value: isNoValueOperator.value ? undefined : localValue.value
  })
}

// 监听外部变化
watch(
  () => props.condition,
  (newVal) => {
    localField.value = newVal.field || ''
    localOperator.value = newVal.operator || 'EQ'
    localValue.value = newVal.value ?? ''
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
.condition-row {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}

.field-select {
  width: 180px;
}

.operator-select {
  width: 120px;
}

.value-input {
  flex: 1;
  min-width: 150px;

  &.multi-value {
    min-width: 200px;
  }
}

.remove-btn {
  flex-shrink: 0;
}

.field-key-hint {
  float: right;
  font-size: 12px;
  color: #909399;
}
</style>

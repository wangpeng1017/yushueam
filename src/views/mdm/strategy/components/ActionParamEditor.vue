<!-- Author [system],  Since 2026-02-24,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <div class="action-param-editor">
    <el-form :model="actionData" :disabled="props.disabled" label-width="120px" size="default">
      <!-- 动作类型 -->
      <el-form-item label="动作类型">
        <el-select v-model="actionData.actionType" placeholder="选择动作类型" class="w-full">
          <el-option label="上架推荐" value="PUTAWAY_RECOMMEND" />
        </el-select>
      </el-form-item>

      <!-- 推荐模式 -->
      <el-form-item label="推荐模式">
        <el-select v-model="actionData.mode" placeholder="选择推荐模式" class="w-full">
          <el-option-group label="单一模式">
            <el-option label="固定库位" value="FIXED" />
            <el-option label="就近推荐" value="NEARBY" />
            <el-option label="同SKU推荐" value="SAME_SKU" />
            <el-option label="同品类推荐" value="SAME_CATEGORY" />
          </el-option-group>
          <el-option-group label="组合模式（优先级递减）">
            <el-option label="固定 → 就近" value="FIXED_THEN_NEARBY" />
            <el-option label="固定 → 同SKU" value="FIXED_THEN_SAME_SKU" />
            <el-option label="固定 → 同品类" value="FIXED_THEN_SAME_CATEGORY" />
            <el-option label="就近 → 同SKU" value="NEARBY_THEN_SAME_SKU" />
            <el-option label="就近 → 同品类" value="NEARBY_THEN_SAME_CATEGORY" />
            <el-option label="同SKU → 同品类" value="SAME_SKU_THEN_SAME_CATEGORY" />
            <el-option label="固定 → 就近 → 同SKU" value="FIXED_THEN_NEARBY_THEN_SAME_SKU" />
            <el-option label="固定 → 就近 → 同品类" value="FIXED_THEN_NEARBY_THEN_SAME_CATEGORY" />
            <el-option
              label="就近 → 同SKU → 同品类"
              value="NEARBY_THEN_SAME_SKU_THEN_SAME_CATEGORY"
            />
          </el-option-group>
        </el-select>
      </el-form-item>

      <!-- 通用参数 -->
      <el-divider content-position="left">通用参数</el-divider>

      <el-form-item label="推荐数量(TopN)">
        <el-input-number v-model="actionData.topN" :min="1" :max="20" controls-position="right" />
        <span class="param-hint">最多推荐的库位数量</span>
      </el-form-item>

      <el-form-item label="最大距离">
        <el-input-number
          v-model="actionData.maxDistance"
          :min="0"
          :max="9999"
          controls-position="right"
        />
        <span class="param-hint">就近推荐时的最大距离限制（米）</span>
      </el-form-item>

      <el-form-item label="首非空停止">
        <el-switch v-model="actionData.stopAtFirstNonEmpty" />
        <span class="param-hint">组合模式下，某策略有结果时是否停止</span>
      </el-form-item>

      <!-- 固定库位配置 -->
      <template v-if="showFixedConfig">
        <el-divider content-position="left">固定库位配置</el-divider>

        <el-form-item label="指定库位">
          <el-input
            v-model="actionData.config.locationCode"
            placeholder="如：A-01-01"
            class="w-300px"
          />
        </el-form-item>

        <el-form-item label="指定库区">
          <el-input v-model="actionData.config.areaCode" placeholder="如：AREA-A" class="w-300px" />
        </el-form-item>
      </template>

      <!-- 品类配置 -->
      <template v-if="showCategoryConfig">
        <el-divider content-position="left">品类配置</el-divider>

        <el-form-item label="物料分类">
          <el-select
            v-model="actionData.config.materialCategory"
            placeholder="选择物料分类"
            class="w-300px"
          >
            <el-option label="原材料" value="RAW" />
            <el-option label="半成品" value="SEMI" />
            <el-option label="成品" value="FINISHED" />
            <el-option label="备品备件" value="SPARE" />
          </el-select>
        </el-form-item>
      </template>

      <!-- 就近推荐配置 -->
      <template v-if="showNearbyConfig">
        <el-divider content-position="left">就近推荐配置</el-divider>

        <el-form-item label="起始位置">
          <el-input
            v-model="actionData.config.startLocationCode"
            placeholder="计算距离的起始库位"
            class="w-300px"
          />
        </el-form-item>

        <el-form-item label="优先空库位">
          <el-switch v-model="actionData.config.preferEmpty" />
          <span class="param-hint">优先推荐空库位</span>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'ActionParamEditor' })

interface ActionConfig {
  locationCode?: string
  areaCode?: string
  materialCategory?: string
  startLocationCode?: string
  preferEmpty?: boolean
}

interface ActionData {
  actionType: string
  mode: string
  topN: number
  maxDistance: number
  stopAtFirstNonEmpty: boolean
  config: ActionConfig
}

const props = defineProps<{
  modelValue: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// 默认动作数据
const defaultActionData = (): ActionData => ({
  actionType: 'PUTAWAY_RECOMMEND',
  mode: 'NEARBY',
  topN: 5,
  maxDistance: 100,
  stopAtFirstNonEmpty: true,
  config: {}
})

const actionData = reactive<ActionData>(defaultActionData())

// 解析JSON
const parseAction = (json: string): ActionData => {
  if (!json || json === '{}' || json === 'null') return defaultActionData()
  try {
    const parsed = JSON.parse(json)
    return {
      actionType: parsed.actionType || 'PUTAWAY_RECOMMEND',
      mode: parsed.mode || 'NEARBY',
      topN: parsed.topN ?? 5,
      maxDistance: parsed.maxDistance ?? 100,
      stopAtFirstNonEmpty: parsed.stopAtFirstNonEmpty ?? true,
      config: parsed.config || {}
    }
  } catch {
    return defaultActionData()
  }
}

// 序列化JSON
const serializeAction = (data: ActionData): string => {
  const result: any = {
    actionType: data.actionType,
    mode: data.mode,
    topN: data.topN,
    maxDistance: data.maxDistance,
    stopAtFirstNonEmpty: data.stopAtFirstNonEmpty
  }
  // 只添加非空的config
  if (Object.keys(data.config).some((k) => data.config[k as keyof ActionConfig])) {
    result.config = {}
    for (const [key, value] of Object.entries(data.config)) {
      if (value !== undefined && value !== '' && value !== null) {
        result.config[key] = value
      }
    }
    if (Object.keys(result.config).length === 0) {
      delete result.config
    }
  }
  return JSON.stringify(result)
}

// 是否显示固定库位配置
const showFixedConfig = computed(() => {
  return actionData.mode?.includes('FIXED')
})

// 是否显示品类配置
const showCategoryConfig = computed(() => {
  return actionData.mode?.includes('CATEGORY')
})

// 是否显示就近推荐配置
const showNearbyConfig = computed(() => {
  return actionData.mode?.includes('NEARBY')
})

// 监听数据变化，更新外部值
watch(
  actionData,
  () => {
    emit('update:modelValue', serializeAction(actionData))
  },
  { deep: true }
)

// 监听外部值变化
watch(
  () => props.modelValue,
  (newVal) => {
    const parsed = parseAction(newVal)
    Object.assign(actionData, parsed)
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.action-param-editor {
  padding: 20px;
  background-color: #fafafa;
  border: 1px solid #e4e7ed;
  border-radius: 4px;

  :deep(.el-form-item) {
    margin-bottom: 22px;
  }

  :deep(.el-divider) {
    margin: 24px 0 20px;
  }

  :deep(.el-divider__text) {
    padding: 0 12px;
    font-size: 13px;
    font-weight: 500;
    color: #606266;
    background-color: #fafafa;
  }
}

.param-hint {
  display: inline-block;
  margin-left: 12px;
  font-size: 12px;
  line-height: 32px;
  color: #909399;
}

.w-full {
  width: 100%;
}

.w-300px {
  width: 300px;
}
</style>

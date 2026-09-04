<template>
  <div class="tree-list-layout">
    <!-- 左侧树：固定 240px（与设备履历一致，2026-06-11 王老师拍板） -->
    <div class="tll-tree">
      <el-card shadow="never" style="height: calc(100vh - 180px); overflow: auto">
        <el-input
          v-model="treeFilterText"
          placeholder="搜索分类"
          clearable
          class="mb-10px"
          prefix-icon="Search"
        />
        <el-tree
          ref="treeRef"
          :data="treeData"
          :props="{ label: 'label', children: 'children' }"
          node-key="key"
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
          highlight-current
          :default-expanded-keys="defaultExpanded"
          @node-click="handleNodeClick"
        >
          <template #default="{ data }">
            <span class="custom-tree-node">
              <span class="custom-tree-node__label">
                <span>{{ data.label }}</span>
                <el-tag
                  v-if="data.count !== undefined"
                  size="small"
                  type="info"
                  round
                  style="margin-left: 6px; height: 18px; line-height: 16px; padding: 0 6px"
                >
                  {{ data.count }}
                </el-tag>
              </span>
              <span v-if="$slots['node-actions']" class="custom-tree-node__actions" @click.stop>
                <slot name="node-actions" :data="data"></slot>
              </span>
            </span>
          </template>
        </el-tree>
      </el-card>
    </div>

    <!-- 右侧主区 -->
    <div class="tll-main">
      <slot :selected-key="selectedKey" :selected-node="selectedNode"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, nextTick } from 'vue'

const props = defineProps<{
  /** 树数据：{ key, label, children?, count? } */
  treeData: any[]
  /** 默认选中节点 key */
  defaultKey?: string
  /** 默认展开的 key 数组 */
  defaultExpandedKeys?: string[]
  /** 外部受控的当前选中 key（面包屑跳转/删除后选父级等场景同步树高亮） */
  currentKey?: string
}>()

const emit = defineEmits<{
  (e: 'select', key: string, node: any): void
}>()

const treeRef = ref()
const treeFilterText = ref('')
const selectedKey = ref<string>(props.defaultKey || 'ALL')
const selectedNode = ref<any>(null)

const defaultExpanded = computed(() => {
  if (props.defaultExpandedKeys) return props.defaultExpandedKeys
  // 默认展开根节点 + 第一层
  return ['ALL', ...(props.treeData || []).map(t => t.key)]
})

watch(treeFilterText, (val) => {
  treeRef.value?.filter(val)
})

function filterNode(value: string, data: any) {
  if (!value) return true
  return (data.label || '').includes(value)
}

function handleNodeClick(data: any) {
  selectedKey.value = data.key
  selectedNode.value = data
  emit('select', data.key, data)
}

onMounted(() => {
  // 默认选中第一个节点（"全部"）
  if (props.treeData && props.treeData.length > 0) {
    const firstKey = props.defaultKey || props.treeData[0].key
    selectedKey.value = firstKey
    selectedNode.value = props.treeData[0]
    emit('select', firstKey, props.treeData[0])
  }
})

watch(
  () => props.currentKey,
  (key) => {
    if (!key || key === selectedKey.value) return
    selectedKey.value = key
    nextTick(() => treeRef.value?.setCurrentKey(key))
  }
)

defineExpose({ selectedKey })
</script>

<style scoped>
.tree-list-layout {
  display: flex;
  gap: 16px;
}

.tll-tree {
  flex-shrink: 0;
  width: 240px;
}

.tll-main {
  flex: 1;
  min-width: 0;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  font-size: 14px;
}

.custom-tree-node__label {
  display: flex;
  align-items: center;
  min-width: 0;
}

.custom-tree-node__actions {
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.15s;
}

:deep(.el-tree-node__content:hover) .custom-tree-node__actions {
  opacity: 1;
}

:deep(.el-tree-node.is-current > .el-tree-node__content .custom-tree-node__actions) {
  opacity: 1;
}
</style>

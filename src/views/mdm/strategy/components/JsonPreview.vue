<!-- Author [system],  Since 2026-02-24,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <div class="json-preview" :class="{ 'json-preview--collapsed': collapsed }">
    <div v-if="title || collapsible" class="json-preview-header">
      <span v-if="title" class="json-preview-title">{{ title }}</span>
      <div class="json-preview-actions">
        <el-button v-if="copyable" type="primary" link size="small" @click="handleCopy">
          <Icon icon="ep:document-copy" class="mr-3px" />复制
        </el-button>
        <el-button v-if="collapsible" type="info" link size="small" @click="collapsed = !collapsed">
          <Icon :icon="collapsed ? 'ep:arrow-down' : 'ep:arrow-up'" class="mr-3px" />
          {{ collapsed ? '展开' : '收起' }}
        </el-button>
      </div>
    </div>
    <div v-show="!collapsed" class="json-preview-content">
      <pre><code v-html="highlightedJson"></code></pre>
    </div>
    <div v-if="collapsed" class="json-preview-collapsed-hint">
      {{ collapsedHint }}
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'JsonPreview' })

const props = withDefaults(
  defineProps<{
    value: string | object
    title?: string
    collapsible?: boolean
    copyable?: boolean
    maxHeight?: string
  }>(),
  {
    collapsible: false,
    copyable: true,
    maxHeight: '400px'
  }
)

const message = useMessage()

const collapsed = ref(false)

// 格式化JSON
const formattedJson = computed(() => {
  try {
    if (typeof props.value === 'string') {
      if (!props.value || props.value === '{}' || props.value === 'null') {
        return '{}'
      }
      return JSON.stringify(JSON.parse(props.value), null, 2)
    }
    return JSON.stringify(props.value, null, 2)
  } catch {
    return String(props.value)
  }
})

// 折叠时的提示
const collapsedHint = computed(() => {
  try {
    const parsed = typeof props.value === 'string' ? JSON.parse(props.value) : props.value
    if (Array.isArray(parsed)) {
      return `[Array: ${parsed.length} 项]`
    }
    if (typeof parsed === 'object' && parsed !== null) {
      const keys = Object.keys(parsed)
      return `{Object: ${keys.length} 个属性}`
    }
    return '...'
  } catch {
    return '...'
  }
})

// 语法高亮
const highlightedJson = computed(() => {
  return syntaxHighlight(formattedJson.value)
})

// 简单的JSON语法高亮
const syntaxHighlight = (json: string): string => {
  if (!json) return ''
  // 转义HTML
  let escaped = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // 正则匹配
  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = 'json-number'
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key'
        } else {
          cls = 'json-string'
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean'
      } else if (/null/.test(match)) {
        cls = 'json-null'
      }
      return `<span class="${cls}">${match}</span>`
    }
  )
}

// 复制到剪贴板
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(formattedJson.value)
    message.success('已复制到剪贴板')
  } catch {
    message.error('复制失败')
  }
}
</script>

<style lang="scss" scoped>
.json-preview {
  overflow: hidden;
  font-family: Monaco, Menlo, Consolas, 'Courier New', monospace;
  font-size: 13px;
  background-color: #1e1e1e;
  border-radius: 4px;
}

.json-preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: #2d2d2d;
  border-bottom: 1px solid #3d3d3d;
}

.json-preview-title {
  font-size: 12px;
  font-weight: 500;
  color: #e0e0e0;
}

.json-preview-actions {
  display: flex;
  gap: 8px;
}

.json-preview-content {
  max-height: v-bind(maxheight);
  padding: 12px;
  overflow: auto;

  pre {
    margin: 0;
    line-height: 1.5;
  }

  code {
    color: #d4d4d4;
  }
}

.json-preview-collapsed-hint {
  padding: 12px;
  font-size: 12px;
  color: #808080;
}

// 语法高亮样式
:deep(.json-key) {
  color: #9cdcfe;
}

:deep(.json-string) {
  color: #ce9178;
}

:deep(.json-number) {
  color: #b5cea8;
}

:deep(.json-boolean) {
  color: #569cd6;
}

:deep(.json-null) {
  color: #569cd6;
}
</style>

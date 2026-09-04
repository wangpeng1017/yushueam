<template>
  <Dialog v-model="visible" :title="title" width="640px">
    <el-alert v-if="requiredDocs.length" type="info" :closable="false" show-icon class="mb-12px">
      <template #title>
        <div class="required-docs">
          <span
            v-for="name in requiredDocs"
            :key="name"
            class="required-doc-item"
            :class="{ 'is-done': isUploaded(name) }"
          >
            <Icon :icon="isUploaded(name) ? 'ep:circle-check-filled' : 'ep:circle'" class="mr-3px" />{{ name }}
          </span>
        </div>
      </template>
    </el-alert>

    <el-upload
      drag
      multiple
      :auto-upload="false"
      :show-file-list="false"
      :on-change="onChange"
      class="upload-drag"
    >
      <Icon icon="ep:upload-filled" class="upload-icon" />
      <div class="el-upload__text">将文件拖到此处，或点击选择</div>
      <div class="upload-sub-text">演示环境仅记录文件名和大小，不真实存储</div>
    </el-upload>

    <el-table v-if="pendingFiles.length" :data="pendingFiles" size="small" border class="mt-12px">
      <el-table-column label="文件名" min-width="200">
        <template #default="{ row }">{{ row?.name ?? '-' }}</template>
      </el-table-column>
      <el-table-column label="大小(KB)" width="100" align="center">
        <template #default="{ row }">{{ row?.size ? Math.ceil(row.size / 1024) : 0 }}</template>
      </el-table-column>
      <el-table-column label="操作" width="80" align="center">
        <template #default="{ $index }">
          <el-button link type="danger" @click="removeFile($index)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-empty v-else description="尚未选择文件" :image-size="60" />

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="!pendingFiles.length" @click="handleConfirm">确定上传</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface PendingFile { name: string; size: number; type: string }

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    requiredDocs?: string[]
    existingDocs?: { name: string }[]
  }>(),
  {
    requiredDocs: () => [],
    existingDocs: () => []
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm', files: PendingFile[]): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
})

const pendingFiles = ref<PendingFile[]>([])

watch(
  () => props.modelValue,
  (v) => {
    if (v) pendingFiles.value = []
  }
)

function isUploaded(requiredName: string): boolean {
  return props.existingDocs.some((d) => d?.name?.includes(requiredName))
}

function onChange(uploadFile: any) {
  const raw = uploadFile?.raw || uploadFile
  const name = uploadFile?.name || raw?.name || '未命名文件'
  const size = uploadFile?.size ?? raw?.size ?? 0
  const type = name.includes('.') ? name.slice(name.lastIndexOf('.') + 1) : ''
  pendingFiles.value = [...pendingFiles.value, { name, size, type }]
}

function removeFile(index: number) {
  pendingFiles.value = pendingFiles.value.filter((_, i) => i !== index)
}

function handleConfirm() {
  if (!pendingFiles.value.length) return
  emit('confirm', [...pendingFiles.value])
  visible.value = false
}
</script>

<style scoped>
.required-docs { display: flex; flex-wrap: wrap; gap: 12px; }
.required-doc-item { color: #8C8C8C; font-size: 13px; display: inline-flex; align-items: center; }
.required-doc-item.is-done { color: #52C41A; }
.upload-drag { width: 100%; }
.upload-drag :deep(.el-upload-dragger) { width: 100%; }
.upload-icon { font-size: 40px; color: #1677FF; }
.upload-sub-text { font-size: 12px; color: #8C8C8C; margin-top: 4px; }
</style>

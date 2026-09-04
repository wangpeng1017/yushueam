<template>
  <TreeListLayout :tree-data="treeData" default-key="kb-root-project" @select="handleTreeSelect">
    <template #node-actions="{ data }">
      <Icon icon="ep:folder-add" class="tree-action-icon" title="新建子文件夹" @click="handleAddFolder(data)" />
      <Icon v-if="!data.readonly" icon="ep:edit" class="tree-action-icon" title="重命名" @click="handleRenameFolder(data)" />
      <Icon v-if="!data.readonly" icon="ep:delete" class="tree-action-icon tree-action-icon--danger" title="删除" @click="handleDeleteFolder(data)" />
    </template>

    <template #default>
      <div class="kb-toolbar">
        <el-upload :show-file-list="false" :auto-upload="false" :disabled="!selectedFolderId || selectedFolder?.readonly" :on-change="handleUpload">
          <el-button type="primary" :disabled="!selectedFolderId || selectedFolder?.readonly">
            <Icon icon="ep:upload" class="mr-5px" />上传文件
          </el-button>
        </el-upload>
        <el-button type="primary" plain :disabled="!selectedFolderId || selectedFolder?.readonly" @click="handleAddFolderForCurrent">
          <Icon icon="ep:folder-add" class="mr-5px" />新建文件夹
        </el-button>
        <el-input v-model="searchKeyword" clearable placeholder="按文件名搜索当前文件夹" class="kb-search" @keyup.enter="() => {}">
          <template #prefix><Icon icon="ep:search" /></template>
        </el-input>
        <span v-if="selectedFolder?.readonly" class="kb-readonly-tip">
          <Icon icon="ep:warning" class="mr-3px" />系统只读目录，文件由阶段推进自动归档，不支持手工上传/删除
        </span>
      </div>

      <ListPage :total="filteredFiles.length" v-model:page="pageParams.pageNo" v-model:limit="pageParams.pageSize">
        <el-table :data="pagedFiles" :stripe="true" :show-overflow-tooltip="true">
          <el-table-column label="名称" prop="name" min-width="220" />
          <el-table-column label="类型" width="80" align="center">
            <template #default="{ row }">{{ row?.type || '-' }}</template>
          </el-table-column>
          <el-table-column label="大小" width="100">
            <template #default="{ row }">{{ formatSize(row?.size) }}</template>
          </el-table-column>
          <el-table-column label="所在文件夹" width="160">
            <template #default="{ row }">{{ folderName(row) }}</template>
          </el-table-column>
          <el-table-column label="来源项目" width="160">
            <template #default="{ row }">{{ sourceProject(row) }}</template>
          </el-table-column>
          <el-table-column label="来源阶段" width="140">
            <template #default="{ row }">{{ sourceStage(row) }}</template>
          </el-table-column>
          <el-table-column label="上传人" prop="uploader" width="100" align="center" />
          <el-table-column label="上传时间" prop="uploadedAt" width="120" align="center" />
          <el-table-column label="操作" width="90" align="center" fixed="right">
            <template #default="{ row }">
              <el-button
                v-if="!selectedFolder?.readonly"
                link type="danger" @click="handleDeleteFile(row)"
              >删除</el-button>
              <span v-else class="text-12px text-gray-400">—</span>
            </template>
          </el-table-column>
        </el-table>
      </ListPage>
    </template>
  </TreeListLayout>
</template>

<script setup lang="ts" name="EamNpiKnowledge">
import { ref, reactive, computed } from 'vue'
import { useNpiStore } from '@/store/modules/npi'
import { useUserStore } from '@/store/modules/user'
import type { KbFile } from '@/mock-data/eam-npi'
import TreeListLayout from '../../_tooling-shared/TreeListLayout.vue'

const npiStore = useNpiStore()
const userStore = useUserStore()
const message = useMessage()

npiStore.load() // 须在 setup 同步加载，TreeListLayout 挂载时才有树数据以触发 default-key 选中

// ==================== 左树 ====================
interface KbTreeNode {
  key: string
  label: string
  count: number
  readonly: boolean
  children?: KbTreeNode[]
}

function countFiles(folderId: string): number {
  const direct = npiStore.files.filter((f) => f.folderId === folderId).length
  const childFolders = npiStore.folders.filter((f) => f.parentId === folderId)
  return direct + childFolders.reduce((sum, cf) => sum + countFiles(cf.id), 0)
}

function buildNode(folderId: string, name: string, readonly: boolean): KbTreeNode {
  const children = npiStore.folders.filter((f) => f.parentId === folderId)
  return {
    key: folderId,
    label: name,
    count: countFiles(folderId),
    readonly,
    children: children.length ? children.map((c) => buildNode(c.id, c.name, c.readonly)) : undefined
  }
}

const treeData = computed<KbTreeNode[]>(() =>
  npiStore.folders.filter((f) => f.parentId === null).map((f) => buildNode(f.id, f.name, f.readonly))
)

const selectedFolderId = ref<string>('kb-root-project')
const selectedFolder = computed(() => npiStore.folders.find((f) => f.id === selectedFolderId.value))

function handleTreeSelect(key: string) {
  selectedFolderId.value = key
  pageParams.pageNo = 1
}

// ==================== 文件列表 ====================
const searchKeyword = ref('')
const pageParams = reactive({ pageNo: 1, pageSize: 10 })

function collectDescendantFolderIds(folderId: string): string[] {
  const childIds = npiStore.folders.filter((f) => f.parentId === folderId).map((f) => f.id)
  return [folderId, ...childIds.flatMap((id) => collectDescendantFolderIds(id))]
}

const selectedFolderIds = computed(() => {
  if (!selectedFolderId.value) return []
  return collectDescendantFolderIds(selectedFolderId.value)
})

const filteredFiles = computed(() => {
  if (!selectedFolderId.value) return []
  const folderIds = new Set(selectedFolderIds.value)
  return npiStore.files.filter((f) => {
    if (!folderIds.has(f.folderId)) return false
    if (searchKeyword.value && !f.name.includes(searchKeyword.value)) return false
    return true
  })
})

function folderName(file?: KbFile): string {
  if (!file?.folderId) return '-'
  return npiStore.folders.find((f) => f.id === file.folderId)?.name ?? '-'
}
const pagedFiles = computed(() => {
  const start = (pageParams.pageNo - 1) * pageParams.pageSize
  return filteredFiles.value.slice(start, start + pageParams.pageSize)
})

function sourceProject(file?: KbFile): string {
  if (!file?.projectId) return '-'
  return npiStore.projects.find((p) => p.id === file.projectId)?.projectName ?? '-'
}
function sourceStage(file?: KbFile): string {
  if (!file?.projectId || file.stageIdx === undefined) return '-'
  const project = npiStore.projects.find((p) => p.id === file.projectId)
  return project?.stages.find((s) => s.idx === file.stageIdx)?.name ?? '-'
}
function formatSize(bytes?: number): string {
  if (!bytes) return '-'
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

// ==================== 上传 / 删除文件 ====================
function handleUpload(uploadFile: any) {
  if (!selectedFolderId.value) return
  const name = uploadFile?.name || uploadFile?.raw?.name || '未命名文件'
  const size = uploadFile?.size ?? uploadFile?.raw?.size ?? 0
  const type = name.includes('.') ? name.slice(name.lastIndexOf('.') + 1) : ''
  try {
    npiStore.addFile(selectedFolderId.value, { name, size, type, uploader: userStore.getUser.nickname || '管理员' })
    message.success('文件已上传')
  } catch (e: any) {
    message.error(e?.message || '上传失败')
  }
}

async function handleDeleteFile(row: KbFile) {
  try {
    await message.delConfirm(`确认删除文件「${row.name}」？`)
  } catch {
    return
  }
  try {
    npiStore.removeFile(row.id)
    message.success('文件已删除')
  } catch (e: any) {
    message.error(e?.message || '删除失败')
  }
}

// ==================== 文件夹新建 / 重命名 / 删除 ====================
function handleAddFolderForCurrent() {
  if (!selectedFolderId.value || selectedFolder.value?.readonly) return
  handleAddFolder({ key: selectedFolderId.value, label: selectedFolder.value?.name ?? '', count: 0, readonly: false })
}

async function handleAddFolder(node: KbTreeNode) {
  let value = ''
  try {
    const res = await message.prompt('请输入文件夹名称', '新建子文件夹')
    value = (res as any)?.value || ''
  } catch {
    return
  }
  if (!value.trim()) return
  try {
    npiStore.addFolder(node.key, value.trim())
    message.success('文件夹已创建')
  } catch (e: any) {
    message.error(e?.message || '创建失败')
  }
}

async function handleRenameFolder(node: KbTreeNode) {
  let value = ''
  try {
    const res = await message.prompt('请输入新的文件夹名称', '重命名文件夹')
    value = (res as any)?.value || ''
  } catch {
    return
  }
  if (!value.trim()) return
  try {
    npiStore.renameFolder(node.key, value.trim())
    message.success('已重命名')
  } catch (e: any) {
    message.error(e?.message || '重命名失败')
  }
}

async function handleDeleteFolder(node: KbTreeNode) {
  try {
    await message.delConfirm(`确认删除文件夹「${node.label}」？`)
  } catch {
    return
  }
  try {
    npiStore.removeFolder(node.key)
    message.success('文件夹已删除')
    if (selectedFolderId.value === node.key) selectedFolderId.value = ''
  } catch (e: any) {
    message.error(e?.message || '删除失败')
  }
}
</script>

<style scoped>
.tree-action-icon { font-size: 14px; color: #909399; cursor: pointer; }
.tree-action-icon:hover { color: #1677FF; }
.tree-action-icon--danger:hover { color: #FF4D4F; }

.kb-toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.kb-search { width: 240px; }
.kb-readonly-tip { font-size: 12px; color: #FA8C16; display: flex; align-items: center; }
</style>

<template>
  <TreeListLayout :tree-data="treeData" default-key="kb-root-project" :current-key="selectedFolderId" @select="handleTreeSelect">
    <template #node-actions="{ data }">
      <Icon icon="ep:folder-add" class="tree-action-icon" title="新建子文件夹" @click="handleAddFolder(data)" />
      <Icon icon="ep:edit" class="tree-action-icon" title="重命名" @click="handleRenameFolder(data)" />
      <Icon v-if="!data.isRoot" icon="ep:delete" class="tree-action-icon tree-action-icon--danger" title="删除" @click="handleDeleteFolder(data)" />
    </template>

    <template #default>
      <div class="kb-toolbar">
        <el-button type="primary" :disabled="!selectedFolderId" @click="uploadVisible = true">
          <Icon icon="ep:upload" class="mr-5px" />上传文件
        </el-button>
        <el-button type="primary" plain :disabled="!selectedFolderId" @click="handleAddFolderForCurrent">
          <Icon icon="ep:folder-add" class="mr-5px" />新建子文件夹
        </el-button>
        <el-button plain :disabled="!selectedFolderId" @click="handleRenameFolderForCurrent">
          <Icon icon="ep:edit" class="mr-5px" />重命名
        </el-button>
        <el-button
          type="danger"
          plain
          :disabled="isRootSelected"
          :title="isRootSelected ? '根目录不能删除' : ''"
          @click="handleDeleteFolderForCurrent"
        >
          <Icon icon="ep:delete" class="mr-5px" />删除文件夹
        </el-button>
        <el-input v-model="searchKeyword" clearable placeholder="按文件名搜索当前文件夹" class="kb-search">
          <template #prefix><Icon icon="ep:search" /></template>
        </el-input>
      </div>

      <el-breadcrumb separator="/" class="kb-breadcrumb">
        <el-breadcrumb-item v-for="f in breadcrumbPath" :key="f.id">
          <span class="kb-breadcrumb__link" @click="selectedFolderId = f.id">{{ f.name }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>

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
          <el-table-column label="操作" width="140" align="center" fixed="right">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleDownloadFile(row)">下载</el-button>
              <el-button link type="danger" @click="handleDeleteFile(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </ListPage>
    </template>
  </TreeListLayout>

  <UploadDocDialog
    v-model="uploadVisible"
    :title="uploadDialogTitle"
    :required-docs="[]"
    :existing-docs="[]"
    @confirm="handleUploadConfirm"
  />
</template>

<script setup lang="ts" name="EamNpiKnowledge">
import { ref, reactive, computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useNpiStore } from '@/store/modules/npi'
import { useUserStore } from '@/store/modules/user'
import type { KbFile, KbFolder } from '@/mock-data/eam-npi'
import TreeListLayout from '../../_tooling-shared/TreeListLayout.vue'
import UploadDocDialog from '../project/UploadDocDialog.vue'

const npiStore = useNpiStore()
const userStore = useUserStore()
const message = useMessage()

npiStore.load() // 须在 setup 同步加载，TreeListLayout 挂载时才有树数据以触发 default-key 选中

// ==================== 左树 ====================
interface KbTreeNode {
  key: string
  label: string
  count: number
  isRoot: boolean
  parentId: string | null
  children?: KbTreeNode[]
}

function countFiles(folderId: string): number {
  const direct = npiStore.files.filter((f) => f.folderId === folderId).length
  const childFolders = npiStore.folders.filter((f) => f.parentId === folderId)
  return direct + childFolders.reduce((sum, cf) => sum + countFiles(cf.id), 0)
}

function buildNode(folderId: string, name: string, parentId: string | null): KbTreeNode {
  const children = npiStore.folders.filter((f) => f.parentId === folderId)
  return {
    key: folderId,
    label: name,
    count: countFiles(folderId),
    isRoot: parentId === null,
    parentId,
    children: children.length ? children.map((c) => buildNode(c.id, c.name, folderId)) : undefined
  }
}

const treeData = computed<KbTreeNode[]>(() =>
  npiStore.folders.filter((f) => f.parentId === null).map((f) => buildNode(f.id, f.name, null))
)

const selectedFolderId = ref<string>('kb-root-project')
const selectedFolder = computed(() => npiStore.folders.find((f) => f.id === selectedFolderId.value))
const isRootSelected = computed(() => !selectedFolder.value || selectedFolder.value.parentId === null)

function handleTreeSelect(key: string) {
  selectedFolderId.value = key
  pageParams.pageNo = 1
}

// ==================== 面包屑 ====================
function folderPath(folderId: string): KbFolder[] {
  const path: KbFolder[] = []
  let cur = npiStore.folders.find((f) => f.id === folderId)
  while (cur) {
    path.unshift(cur)
    const parentId: string | null = cur.parentId
    cur = parentId ? npiStore.folders.find((f) => f.id === parentId) : undefined
  }
  return path
}
const breadcrumbPath = computed(() => (selectedFolderId.value ? folderPath(selectedFolderId.value) : []))

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

// ==================== 上传 / 下载 / 删除文件 ====================
const uploadVisible = ref(false)
const uploadDialogTitle = computed(() => `上传到 · ${selectedFolder.value?.name ?? ''}`)

function handleUploadConfirm(files: { name: string; size: number; type: string }[]) {
  if (!selectedFolderId.value) return
  try {
    files.forEach((f) =>
      npiStore.addFile(selectedFolderId.value, { ...f, uploader: userStore.getUser.nickname || '管理员' })
    )
    message.success(`已上传 ${files.length} 个文件`)
  } catch (e: any) {
    message.error(e?.message || '上传失败')
  }
}

function handleDownloadFile(_row: KbFile) {
  message.info('演示环境不存储文件内容，正式环境此处下载原文件')
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
  if (!selectedFolderId.value) return
  handleAddFolder({
    key: selectedFolderId.value,
    label: selectedFolder.value?.name ?? '',
    count: 0,
    isRoot: isRootSelected.value,
    parentId: selectedFolder.value?.parentId ?? null
  })
}

function handleRenameFolderForCurrent() {
  if (!selectedFolderId.value || !selectedFolder.value) return
  handleRenameFolder({
    key: selectedFolderId.value,
    label: selectedFolder.value.name,
    count: 0,
    isRoot: isRootSelected.value,
    parentId: selectedFolder.value.parentId
  })
}

function handleDeleteFolderForCurrent() {
  if (!selectedFolderId.value || !selectedFolder.value || isRootSelected.value) return
  handleDeleteFolder({
    key: selectedFolderId.value,
    label: selectedFolder.value.name,
    count: 0,
    isRoot: false,
    parentId: selectedFolder.value.parentId
  })
}

async function handleAddFolder(node: KbTreeNode) {
  let value = ''
  try {
    const res = await ElMessageBox.prompt('请输入文件夹名称', '新建子文件夹', {
      inputValue: '',
      inputValidator: (v: string) => !!v?.trim() || '名称不能为空'
    })
    value = res.value
  } catch {
    return
  }
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
    const res = await ElMessageBox.prompt('请输入新的文件夹名称', '重命名文件夹', {
      inputValue: node.label,
      inputValidator: (v: string) => !!v?.trim() || '名称不能为空'
    })
    value = res.value
  } catch {
    return
  }
  try {
    npiStore.renameFolder(node.key, value.trim())
    message.success('已重命名')
  } catch (e: any) {
    message.error(e?.message || '重命名失败')
  }
}

async function handleDeleteFolder(node: KbTreeNode) {
  if (node.isRoot || node.parentId === null) return
  const descendantIds = collectDescendantFolderIds(node.key)
  const folderCount = descendantIds.length - 1
  const fileCount = npiStore.files.filter((f) => descendantIds.includes(f.folderId)).length
  try {
    await message.delConfirm(`将删除「${node.label}」及其 ${folderCount} 个子文件夹、${fileCount} 个文件，确认？`)
  } catch {
    return
  }
  try {
    const result = npiStore.removeFolder(node.key)
    message.success(`文件夹已删除（含 ${result.folders} 个子文件夹、${result.files} 个文件）`)
    if (descendantIds.includes(selectedFolderId.value)) {
      selectedFolderId.value = node.parentId as string
    }
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

.kb-breadcrumb { margin-bottom: 12px; font-size: 13px; }
.kb-breadcrumb__link { cursor: pointer; color: #606266; }
.kb-breadcrumb__link:hover { color: #1677FF; }
</style>

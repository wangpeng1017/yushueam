<template>
  <div class="npi-project-detail">
    <ContentWrap v-if="project">
      <div class="detail-header">
        <el-button @click="emit('back')">
          <Icon icon="ep:arrow-left" class="mr-5px" />返回列表
        </el-button>
        <div class="detail-title">
          <span class="detail-title-text">{{ project.projectCode }} · {{ project.projectName }}</span>
          <el-tag size="small" :type="statusTag(project.status)">{{ statusText(project.status) }}</el-tag>
        </div>
      </div>

      <el-descriptions :column="4" border size="small" class="mb-15px">
        <el-descriptions-item label="项目编号">{{ project.projectCode }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ project.owner }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag size="small" :type="statusTag(project.status)">{{ statusText(project.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="当前阶段">{{ project.currentStage }}. {{ currentStage?.name ?? '-' }}</el-descriptions-item>
        <el-descriptions-item label="计划开始">{{ project.planStart }}</el-descriptions-item>
        <el-descriptions-item label="计划结束">{{ project.planEnd }}</el-descriptions-item>
        <el-descriptions-item label="项目说明" :span="2">{{ project.description || '-' }}</el-descriptions-item>
      </el-descriptions>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="阶段管理" name="stage">
          <el-steps :active="project.currentStage - 1" finish-status="success" align-center class="mb-15px">
            <el-step v-for="s in project.stages" :key="s.idx" :title="s.name" :description="s.owner" />
          </el-steps>

          <el-table :data="project.stages" size="small" border :show-overflow-tooltip="true">
            <el-table-column label="阶段" width="50" align="center">
              <template #default="{ row }">{{ row?.idx ?? '-' }}</template>
            </el-table-column>
            <el-table-column label="阶段名称" min-width="140">
              <template #default="{ row }">
                <el-input :model-value="row?.name" size="small" @change="(v: string) => editStage(row.idx, { name: v })" />
              </template>
            </el-table-column>
            <el-table-column label="责任人" width="100">
              <template #default="{ row }">
                <el-input :model-value="row?.owner" size="small" @change="(v: string) => editStage(row.idx, { owner: v })" />
              </template>
            </el-table-column>
            <el-table-column label="计划开始" width="150">
              <template #default="{ row }">
                <el-date-picker
                  :model-value="row?.planStart" type="date" value-format="YYYY-MM-DD" size="small" style="width:100%"
                  @update:model-value="(v: string) => editStage(row.idx, { planStart: v })"
                />
              </template>
            </el-table-column>
            <el-table-column label="计划结束" width="150">
              <template #default="{ row }">
                <el-date-picker
                  :model-value="row?.planEnd" type="date" value-format="YYYY-MM-DD" size="small" style="width:100%"
                  @update:model-value="(v: string) => editStage(row.idx, { planEnd: v })"
                />
              </template>
            </el-table-column>
            <el-table-column label="进度" width="120">
              <template #default="{ row }">
                <el-input-number
                  :model-value="row?.progress" size="small" :min="0" :max="100" style="width:100%"
                  @change="(v: number | undefined) => editStage(row.idx, { progress: v ?? 0 })"
                />
              </template>
            </el-table-column>
            <el-table-column label="状态" width="90" align="center">
              <template #default="{ row }">
                <el-tag size="small" :type="stageStatusTag(row)">{{ stageStatusText(row) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="资料" width="70" align="center">
              <template #default="{ row }">{{ row?.docs?.length ?? 0 }}/{{ row?.requiredDocs?.length ?? 0 }}</template>
            </el-table-column>
            <el-table-column label="操作" width="140" align="center" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="openUpload(row)">上传资料</el-button>
                <el-tooltip content="在此行下方插入一个阶段" placement="top">
                  <el-button link type="primary" class="ml-6px" @click="handleInsertStage(row.idx)">
                    <Icon icon="ep:plus" />
                  </el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>

          <div class="advance-bar">
            <el-tag v-if="project.status === 'delivered'" type="success" size="large">项目已交付</el-tag>
            <el-button v-else type="primary" @click="handleAdvance">
              推进到下一阶段{{ nextStageLabel ? `（${nextStageLabel}）` : '' }}
            </el-button>
          </div>

          <div class="section-title mt-15px">阶段日志</div>
          <el-timeline v-if="allLogs.length">
            <el-timeline-item v-for="(log, i) in allLogs" :key="i" :timestamp="log.time" :type="logType(log.action)">
              <b>{{ log.stageName }}</b> · {{ log.operator }} {{ logActionText(log.action) }} — {{ log.remark }}
            </el-timeline-item>
          </el-timeline>
          <el-empty v-else description="暂无日志" :image-size="60" />
        </el-tab-pane>

        <el-tab-pane label="异常履历" name="issue">
          <IssueTab :project-id="project.id" />
        </el-tab-pane>

      </el-tabs>
    </ContentWrap>
    <ContentWrap v-else>
      <el-empty description="项目不存在或已被删除" :image-size="80">
        <el-button @click="emit('back')">返回列表</el-button>
      </el-empty>
    </ContentWrap>

    <Dialog v-model="forceVisible" title="资料未齐全，是否强制推进" width="520px">
      <p class="force-tip">当前阶段以下必传资料尚未上传：</p>
      <ul class="missing-list">
        <li v-for="m in missingDocs" :key="m">{{ m }}</li>
      </ul>
      <el-input v-model="forceReason" type="textarea" :rows="3" placeholder="请填写强制推进理由" />
      <template #footer>
        <el-button @click="forceVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmForceAdvance">确认强推</el-button>
      </template>
    </Dialog>

    <UploadDocDialog
      v-model="uploadVisible"
      :title="uploadDialogTitle"
      :required-docs="uploadStage?.requiredDocs ?? []"
      :existing-docs="uploadStage?.docs ?? []"
      @confirm="handleUploadConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'
import { useNpiStore } from '@/store/modules/npi'
import type { NpiStage, ProjectStatus } from '@/mock-data/eam-npi'
import IssueTab from './IssueTab.vue'
import UploadDocDialog from './UploadDocDialog.vue'

const props = defineProps<{ projectId: string }>()
const emit = defineEmits<{ (e: 'back'): void }>()

const npiStore = useNpiStore()
const message = useMessage()

const project = computed(() => npiStore.projects.find((p) => p.id === props.projectId) || null)
const currentStage = computed(() => project.value?.stages.find((s) => s.idx === project.value?.currentStage))

const activeTab = ref('stage')
watch(() => props.projectId, () => { activeTab.value = 'stage' })

const nextStageLabel = computed(() => {
  if (!project.value) return ''
  // 阶段总数可由「插入阶段」变动，以实际长度为准
  if (project.value.currentStage >= project.value.stages.length) return '完成交付'
  return project.value.stages.find((s) => s.idx === project.value!.currentStage + 1)?.name || ''
})

function statusTag(status: ProjectStatus): any {
  return status === 'delivered' ? 'success' : status === 'in_progress' ? 'warning' : 'info'
}
function statusText(status: ProjectStatus): string {
  return status === 'delivered' ? '已交付' : status === 'in_progress' ? '进行中' : '未开始'
}
function stageStatusTag(row?: NpiStage): any {
  if (!row) return 'info'
  if (row.status === 'completed') return 'success'
  if (row.status === 'pending') return 'info'
  const daysLeft = dayjs(row.planEnd).diff(dayjs().startOf('day'), 'day')
  if (daysLeft < 0) return 'danger'
  if (daysLeft <= 2) return 'warning'
  return 'primary'
}
function stageStatusText(row?: NpiStage): string {
  if (!row) return '-'
  return row.status === 'completed' ? '已完成' : row.status === 'in_progress' ? '进行中' : '待开始'
}

function editStage(idx: number, patch: Partial<Pick<NpiStage, 'name' | 'owner' | 'planStart' | 'planEnd' | 'progress'>>) {
  if (!project.value) return
  npiStore.updateStage(project.value.id, idx, patch)
}

function handleInsertStage(afterIdx: number) {
  if (!project.value) return
  const stage = npiStore.insertStageAfter(project.value.id, afterIdx)
  if (!stage) {
    message.error('插入阶段失败：未找到该阶段')
    return
  }
  message.success(`已在第 ${afterIdx} 阶段后插入新阶段，当前共 ${project.value.stages.length} 个阶段`)
}

// ==================== 上传资料 ====================
const uploadVisible = ref(false)
const uploadStageIdx = ref<number | null>(null)
const uploadStage = computed(() => project.value?.stages.find((s) => s.idx === uploadStageIdx.value) ?? null)
const uploadDialogTitle = computed(() => `上传阶段资料 · ${uploadStage.value?.name ?? ''}`)

function openUpload(row: NpiStage) {
  uploadStageIdx.value = row.idx
  uploadVisible.value = true
}

function handleUploadConfirm(files: { name: string; size: number; type: string }[]) {
  if (!project.value || uploadStageIdx.value === null) return
  files.forEach((f) => npiStore.addStageDoc(project.value!.id, uploadStageIdx.value!, f))
  message.success(`已上传 ${files.length} 个文件`)
}

// ==================== 推进 / 强推 ====================
const forceVisible = ref(false)
const missingDocs = ref<string[]>([])
const forceReason = ref('')

function handleAdvance() {
  if (!project.value) return
  const res = npiStore.advanceStage(project.value.id)
  if (res.ok) {
    message.success(project.value.status === 'delivered' ? '最后阶段已完成，项目已交付' : '已推进到下一阶段')
    return
  }
  missingDocs.value = res.missing
  forceReason.value = ''
  forceVisible.value = true
}

function confirmForceAdvance() {
  if (!project.value) return
  if (!forceReason.value.trim()) {
    message.warning('请填写强制推进理由')
    return
  }
  const res = npiStore.advanceStage(project.value.id, true, forceReason.value.trim())
  if (res.ok) {
    message.success('已强制推进到下一阶段')
    forceVisible.value = false
  }
}

// ==================== 日志 ====================
const allLogs = computed(() => {
  if (!project.value) return []
  return project.value.stages
    .flatMap((s) => s.logs.map((l) => ({ ...l, stageName: s.name })))
    .sort((a, b) => (a.time < b.time ? 1 : -1))
})

function logType(action: string): any {
  if (action === 'advance') return 'success'
  if (action === 'force_advance') return 'warning'
  return 'primary'
}
function logActionText(action: string): string {
  return action === 'advance' ? '推进' : action === 'force_advance' ? '强制推进' : '编辑'
}

</script>

<style scoped>
.detail-header { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
.detail-title { display: flex; align-items: center; gap: 10px; }
.detail-title-text { font-size: 16px; font-weight: 600; color: #303133; }
.advance-bar { margin-top: 12px; display: flex; justify-content: center; }
.section-title { font-size: 14px; font-weight: 600; color: #303133; margin-bottom: 8px; padding-left: 8px; border-left: 3px solid #1677FF; }
.force-tip { color: #606266; margin: 0 0 6px; }
.missing-list { margin: 0 0 12px; padding-left: 18px; color: #FF4D4F; }
</style>

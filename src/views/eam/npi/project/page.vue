<template>
  <div class="npi-project-page" v-if="!detailProjectId">
    <QueryForm :model="queryParams" :cols="4" @search="handleQuery" @reset="resetQuery">
      <QueryItem label="项目编号">
        <el-input v-model="queryParams.projectCode" clearable placeholder="如 CIP045" />
      </QueryItem>
      <QueryItem label="项目名称">
        <el-input v-model="queryParams.projectName" clearable placeholder="请输入项目名称" />
      </QueryItem>
      <QueryItem label="负责人">
        <el-input v-model="queryParams.owner" clearable placeholder="请输入负责人" />
      </QueryItem>
      <QueryItem label="状态">
        <el-select v-model="queryParams.status" clearable placeholder="全部">
          <el-option label="未开始" value="not_started" />
          <el-option label="进行中" value="in_progress" />
          <el-option label="已交付" value="delivered" />
        </el-select>
      </QueryItem>
    </QueryForm>

    <el-alert v-if="reminderTotal > 0" type="warning" show-icon :closable="false" class="mb-10px">
      <template #title>
        <span>2 天内到期 {{ reminders.dueSoon.length }} 个阶段 · 已逾期 {{ reminders.overdue.length }} 个</span>
        <el-button link type="warning" class="ml-10px" @click="reminderVisible = true">查看</el-button>
      </template>
    </el-alert>

    <ContentWrap>
      <div class="toolbar">
        <el-button type="primary" @click="openCreate">
          <Icon icon="ep:plus" class="mr-5px" />新增项目
        </el-button>
        <el-button plain @click="handleResetSeed">
          <Icon icon="ep:refresh-left" class="mr-5px" />重置演示数据
        </el-button>
      </div>

      <el-tabs v-model="viewMode">
        <el-tab-pane label="甘特图" name="gantt">
          <GanttChart :projects="filteredProjects" @row-click="openDetail" />
        </el-tab-pane>

        <el-tab-pane label="列表" name="list">
          <ListPage
            :total="filteredProjects.length"
            v-model:page="pageParams.pageNo"
            v-model:limit="pageParams.pageSize"
          >
            <el-table :data="pagedProjects" :stripe="true" :show-overflow-tooltip="true">
              <el-table-column label="编号" prop="projectCode" width="100" align="center" />
              <el-table-column label="名称" prop="projectName" min-width="180" />
              <el-table-column label="负责人" prop="owner" width="90" align="center" />
              <el-table-column label="计划开始" prop="planStart" width="110" align="center" />
              <el-table-column label="计划结束" prop="planEnd" width="110" align="center" />
              <el-table-column label="当前阶段" width="170" align="center">
                <template #default="{ row }">{{ row?.currentStage ?? '-' }}. {{ stageName(row) }}</template>
              </el-table-column>
              <el-table-column label="整体进度" width="150">
                <template #default="{ row }">
                  <el-progress :percentage="overallProgress(row)" :status="row?.status === 'delivered' ? 'success' : undefined" />
                </template>
              </el-table-column>
              <el-table-column label="状态" width="90" align="center">
                <template #default="{ row }">
                  <el-tag size="small" :type="statusTag(row?.status)">{{ statusText(row?.status) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120" align="center" fixed="right">
                <template #default="{ row }">
                  <RowActions
                    :row="row"
                    :on-detail="openDetail"
                    :on-delete="handleDelete"
                    delete-confirm-text="确认删除该项目？删除后不可恢复"
                  />
                </template>
              </el-table-column>
            </el-table>
          </ListPage>
        </el-tab-pane>
      </el-tabs>
    </ContentWrap>

    <!-- 到期提醒 Dialog -->
    <Dialog v-model="reminderVisible" title="到期提醒" width="720px">
      <el-table :data="reminderRows" @row-click="(row: any) => { reminderVisible = false; openDetail(row.project) }" style="cursor:pointer">
        <el-table-column label="项目" min-width="200">
          <template #default="{ row }">{{ row?.project?.projectCode }} · {{ row?.project?.projectName }}</template>
        </el-table-column>
        <el-table-column label="阶段" width="140">
          <template #default="{ row }">{{ row?.stage?.name ?? '-' }}</template>
        </el-table-column>
        <el-table-column label="责任人" width="100">
          <template #default="{ row }">{{ row?.stage?.owner ?? '-' }}</template>
        </el-table-column>
        <el-table-column label="计划结束" width="110">
          <template #default="{ row }">{{ row?.stage?.planEnd ?? '-' }}</template>
        </el-table-column>
        <el-table-column label="剩余天数" width="130">
          <template #default="{ row }">
            <el-tag size="small" :type="row?.daysLeft < 0 ? 'danger' : 'warning'">
              {{ row?.daysLeft < 0 ? `已逾期 ${-row.daysLeft} 天` : `剩 ${row?.daysLeft} 天` }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="reminderVisible = false">关闭</el-button>
      </template>
    </Dialog>

    <!-- 新增项目 Dialog -->
    <Dialog v-model="createVisible" title="新增项目" width="560px">
      <el-form ref="createFormRef" :model="createForm" :rules="createRules" label-width="100px">
        <el-form-item label="项目编号" prop="projectCode">
          <el-input v-model="createForm.projectCode" placeholder="如 CIP0xx" />
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="createForm.projectName" />
        </el-form-item>
        <el-form-item label="负责人" prop="owner">
          <el-input v-model="createForm.owner" />
        </el-form-item>
        <el-form-item label="计划开始" prop="planStart">
          <el-date-picker v-model="createForm.planStart" type="date" value-format="YYYY-MM-DD" style="width:100%" />
        </el-form-item>
        <el-form-item label="计划结束" prop="planEnd">
          <el-date-picker v-model="createForm.planEnd" type="date" value-format="YYYY-MM-DD" style="width:100%" />
        </el-form-item>
        <el-form-item label="项目说明">
          <el-input v-model="createForm.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCreate">确定</el-button>
      </template>
    </Dialog>
  </div>

  <ProjectDetail v-else :project-id="detailProjectId" @back="handleBack" />
</template>

<script setup lang="ts" name="EamNpiProject">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useNpiStore } from '@/store/modules/npi'
import type { NpiProject, ProjectStatus } from '@/mock-data/eam-npi'
import GanttChart from './GanttChart.vue'
import ProjectDetail from './ProjectDetail.vue'

const npiStore = useNpiStore()
const message = useMessage()

onMounted(() => npiStore.load())

// ==================== 搜索 ====================
const queryParams = reactive({
  projectCode: '', projectName: '', owner: '', status: undefined as ProjectStatus | undefined
})
const pageParams = reactive({ pageNo: 1, pageSize: 10 })

function handleQuery() {
  pageParams.pageNo = 1
}
function resetQuery() {
  Object.assign(queryParams, { projectCode: '', projectName: '', owner: '', status: undefined })
  pageParams.pageNo = 1
}

const filteredProjects = computed(() => {
  return npiStore.projects.filter((p) => {
    if (queryParams.projectCode && !p.projectCode.includes(queryParams.projectCode)) return false
    if (queryParams.projectName && !p.projectName.includes(queryParams.projectName)) return false
    if (queryParams.owner && !p.owner.includes(queryParams.owner)) return false
    if (queryParams.status && p.status !== queryParams.status) return false
    return true
  })
})

const pagedProjects = computed(() => {
  const start = (pageParams.pageNo - 1) * pageParams.pageSize
  return filteredProjects.value.slice(start, start + pageParams.pageSize)
})

// ==================== 提醒 ====================
const reminders = computed(() => npiStore.reminders)
const reminderTotal = computed(() => reminders.value.dueSoon.length + reminders.value.overdue.length)
const reminderRows = computed(() => [...reminders.value.dueSoon, ...reminders.value.overdue])
const reminderVisible = ref(false)

// ==================== 视图切换 ====================
const viewMode = ref<'gantt' | 'list'>('gantt')

// ==================== 列表展示辅助 ====================
function stageName(row?: NpiProject): string {
  if (!row) return '-'
  return row.stages.find((s) => s.idx === row.currentStage)?.name ?? '-'
}
function overallProgress(row?: NpiProject): number {
  if (!row || !row.stages.length) return 0
  const sum = row.stages.reduce((acc, s) => acc + (s.progress || 0), 0)
  return Math.round(sum / row.stages.length)
}
function statusTag(status?: ProjectStatus): any {
  return status === 'delivered' ? 'success' : status === 'in_progress' ? 'warning' : 'info'
}
function statusText(status?: ProjectStatus): string {
  return status === 'delivered' ? '已交付' : status === 'in_progress' ? '进行中' : '未开始'
}

// ==================== 详情 ====================
const detailProjectId = ref<string | null>(null)

function scrollContentToTop() {
  const container = document.querySelector('.app-main')
  if (container) container.scrollTo(0, 0)
  window.scrollTo(0, 0)
}

function openDetail(project?: NpiProject) {
  if (!project) return
  detailProjectId.value = project.id
  nextTick(scrollContentToTop)
}

function handleBack() {
  detailProjectId.value = null
  nextTick(scrollContentToTop)
}

// ==================== 删除 / 重置演示数据 ====================
function handleDelete(row: NpiProject) {
  npiStore.removeProject(row.id)
  message.success('项目已删除')
}

async function handleResetSeed() {
  try {
    await message.confirm('重置将清空当前所有演示数据并恢复初始种子，确认继续？')
    npiStore.resetSeed()
    message.success('演示数据已重置')
  } catch {
    // 用户取消
  }
}

// ==================== 新增项目 ====================
const createVisible = ref(false)
const createFormRef = ref<FormInstance>()
const createForm = reactive({ projectCode: '', projectName: '', owner: '', planStart: '', planEnd: '', description: '' })
const createRules: FormRules = {
  projectCode: [{ required: true, message: '请输入项目编号', trigger: 'blur' }],
  projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  owner: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
  planStart: [{ required: true, message: '请选择计划开始日期', trigger: 'change' }],
  planEnd: [{ required: true, message: '请选择计划结束日期', trigger: 'change' }]
}

function openCreate() {
  Object.assign(createForm, { projectCode: '', projectName: '', owner: '', planStart: '', planEnd: '', description: '' })
  createVisible.value = true
}

async function submitCreate() {
  const valid = await createFormRef.value?.validate().catch(() => false)
  if (!valid) return
  if (createForm.planEnd < createForm.planStart) {
    message.warning('计划结束日期不能早于计划开始日期')
    return
  }
  const project = npiStore.addProject({ ...createForm })
  createVisible.value = false
  message.success('项目已创建')
  openDetail(project)
}
</script>

<style scoped>
.npi-project-page { display: flex; flex-direction: column; }
.toolbar { display: flex; gap: 10px; margin-bottom: 12px; }
</style>

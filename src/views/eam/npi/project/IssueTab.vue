<template>
  <div class="issue-tab">
    <div class="stage-summary">
      <span v-for="s in project?.stages || []" :key="s.idx" class="summary-item">
        {{ s.name }} {{ s.progress ?? 0 }}%
      </span>
    </div>

    <div class="toolbar">
      <el-button type="primary" @click="openAdd()">
        <Icon icon="ep:plus" class="mr-5px" />新增异常
      </el-button>
    </div>

    <el-table :data="issues" :stripe="true" :show-overflow-tooltip="true" empty-text="暂无异常记录">
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column label="所属阶段" width="120" align="center">
        <template #default="{ row }">{{ stageName(row?.stageIdx) }}</template>
      </el-table-column>
      <el-table-column label="问题及改善项" prop="problem" min-width="160" />
      <el-table-column label="原因" prop="cause" min-width="140" />
      <el-table-column label="临时措施" prop="tempMeasure" min-width="140" />
      <el-table-column label="长期措施" prop="longMeasure" min-width="140" />
      <el-table-column label="异常类型" width="100" align="center">
        <template #default="{ row }">
          <el-tag size="small" :type="issueTypeTag(row?.issueType)">{{ row?.issueType ?? '-' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="责任人" prop="owner" width="90" align="center" />
      <el-table-column label="发生日期" prop="occurDate" width="100" align="center" />
      <el-table-column label="计划完成" prop="planDoneDate" width="100" align="center" />
      <el-table-column label="实际完成" width="100" align="center">
        <template #default="{ row }">{{ row?.actualDoneDate || '-' }}</template>
      </el-table-column>
      <el-table-column label="状态" width="80" align="center">
        <template #default="{ row }">
          <el-tag size="small" :type="row?.status === 'closed' ? 'success' : 'warning'">
            {{ row?.status === 'closed' ? '已结案' : '进行中' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="130">
        <template #default="{ row }">
          <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          <el-button v-if="row?.status !== 'closed'" link type="success" @click="handleClose(row)">结案</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Dialog v-model="formVisible" :title="formTitle" width="640px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="所属阶段" prop="stageIdx">
          <el-select v-model="form.stageIdx" placeholder="请选择阶段" style="width:100%">
            <el-option v-for="s in project?.stages || []" :key="s.idx" :label="`${s.idx}. ${s.name}`" :value="s.idx" />
          </el-select>
        </el-form-item>
        <el-form-item label="异常类型" prop="issueType">
          <el-select v-model="form.issueType" placeholder="请选择异常类型" style="width:100%">
            <el-option v-for="t in ISSUE_TYPES" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="问题" prop="problem">
          <el-input v-model="form.problem" type="textarea" :rows="2" placeholder="问题及改善项" />
        </el-form-item>
        <el-form-item label="原因" prop="cause">
          <el-input v-model="form.cause" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="临时措施">
          <el-input v-model="form.tempMeasure" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="长期措施">
          <el-input v-model="form.longMeasure" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="责任人" prop="owner">
          <el-input v-model="form.owner" />
        </el-form-item>
        <el-form-item label="发生日期" prop="occurDate">
          <el-date-picker v-model="form.occurDate" type="date" value-format="YYYY-MM-DD" style="width:100%" />
        </el-form-item>
        <el-form-item label="计划完成" prop="planDoneDate">
          <el-date-picker v-model="form.planDoneDate" type="date" value-format="YYYY-MM-DD" style="width:100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useNpiStore } from '@/store/modules/npi'
import type { IssueType } from '@/mock-data/eam-npi'

const props = defineProps<{ projectId: string }>()

const npiStore = useNpiStore()
const message = useMessage()

const ISSUE_TYPES: IssueType[] = ['结构设计', '电气问题', '装配问题', '软件调试', '品质异常', '其他']

const project = computed(() => npiStore.projects.find((p) => p.id === props.projectId) || null)
const issues = computed(() => npiStore.issues.filter((i) => i.projectId === props.projectId).sort((a, b) => a.seq - b.seq))

function stageName(idx?: number): string {
  return project.value?.stages.find((s) => s.idx === idx)?.name ?? '-'
}

function issueTypeTag(type?: string): any {
  const map: Record<string, string> = {
    '结构设计': 'primary', '电气问题': 'danger', '装配问题': 'warning',
    '软件调试': 'info', '品质异常': 'danger', '其他': 'info'
  }
  return map[type ?? ''] ?? 'info'
}

// ==================== 新增 / 编辑 ====================
const formVisible = ref(false)
const formRef = ref<FormInstance>()
const editingId = ref<string | null>(null)
const formTitle = computed(() => (editingId.value ? '编辑异常' : '新增异常'))

const form = reactive({
  stageIdx: 1, issueType: '其他' as IssueType, problem: '', cause: '',
  tempMeasure: '', longMeasure: '', owner: '', occurDate: '', planDoneDate: ''
})

const rules: FormRules = {
  stageIdx: [{ required: true, message: '请选择所属阶段', trigger: 'change' }],
  issueType: [{ required: true, message: '请选择异常类型', trigger: 'change' }],
  problem: [{ required: true, message: '请填写问题', trigger: 'blur' }],
  cause: [{ required: true, message: '请填写原因', trigger: 'blur' }],
  owner: [{ required: true, message: '请填写责任人', trigger: 'blur' }],
  occurDate: [{ required: true, message: '请选择发生日期', trigger: 'change' }],
  planDoneDate: [{ required: true, message: '请选择计划完成日期', trigger: 'change' }]
}

function openAdd() {
  editingId.value = null
  Object.assign(form, {
    stageIdx: project.value?.currentStage ?? 1, issueType: '其他', problem: '', cause: '',
    tempMeasure: '', longMeasure: '', owner: '', occurDate: '', planDoneDate: ''
  })
  formVisible.value = true
}

function openEdit(row: any) {
  editingId.value = row.id
  Object.assign(form, {
    stageIdx: row.stageIdx, issueType: row.issueType, problem: row.problem, cause: row.cause,
    tempMeasure: row.tempMeasure, longMeasure: row.longMeasure, owner: row.owner,
    occurDate: row.occurDate, planDoneDate: row.planDoneDate
  })
  formVisible.value = true
}

async function submitForm() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  if (editingId.value) {
    npiStore.updateIssue(editingId.value, { ...form })
    message.success('异常记录已更新')
  } else {
    npiStore.addIssue({ projectId: props.projectId, ...form })
    message.success('异常记录已新增')
  }
  formVisible.value = false
}

function handleClose(row: any) {
  npiStore.closeIssue(row.id)
  message.success('异常已结案')
}
</script>

<style scoped>
.stage-summary { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 10px; font-size: 12px; color: #606266; }
.summary-item { padding: 2px 8px; background: #F5F7FA; border-radius: 3px; }
.toolbar { margin-bottom: 10px; }
</style>

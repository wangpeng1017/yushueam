<template>
  <div class="issue-tab">
    <div class="stage-summary">
      <span v-for="s in project?.stages || []" :key="s.idx" class="summary-item">
        {{ s.name }} {{ s.progress ?? 0 }}%
      </span>
    </div>

    <div class="toolbar">
      <div class="toolbar-left">
        <el-button type="primary" @click="openAdd()">
          <Icon icon="ep:plus" class="mr-5px" />新增异常
        </el-button>
        <el-button @click="typeDictVisible = true">
          <Icon icon="ep:setting" class="mr-5px" />异常类型维护
        </el-button>
      </div>
      <div class="status-filter">
        <span
          class="filter-chip" :class="{ active: statusFilter === 'all' }"
          @click="statusFilter = 'all'"
        >全部 {{ allIssues.length }}</span>
        <span
          v-for="st in STATUS_ORDER" :key="st"
          class="filter-chip" :class="[`chip-${st}`, { active: statusFilter === st }]"
          @click="statusFilter = st"
        >{{ ISSUE_STATUS_TEXT[st] }} {{ statusCount[st] }}</span>
      </div>
    </div>

    <el-table :data="issues" :stripe="true" :show-overflow-tooltip="true" empty-text="暂无异常记录">
      <el-table-column type="expand">
        <template #default="{ row }">
          <div class="flow-panel">
            <div class="flow-title">流转记录</div>
            <el-timeline>
              <el-timeline-item
                v-for="(f, i) in row.flow || []" :key="i"
                :timestamp="f.time" :type="flowDotType(f.action)"
              >
                <b>{{ ISSUE_ACTION_TEXT[f.action] }}</b> · {{ f.operator }}
                <div class="flow-remark">{{ f.remark || '—' }}</div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column label="所属阶段" width="120" align="center">
        <template #default="{ row }">{{ stageName(row?.stageIdx) }}</template>
      </el-table-column>
      <el-table-column label="问题及改善项" prop="problem" min-width="160" />
      <el-table-column label="原因" prop="cause" min-width="140" />
      <el-table-column label="临时措施" min-width="140">
        <template #default="{ row }">{{ row?.tempMeasure || '—' }}</template>
      </el-table-column>
      <el-table-column label="长期措施" min-width="140">
        <template #default="{ row }">{{ row?.longMeasure || '—' }}</template>
      </el-table-column>
      <el-table-column label="异常类型" width="100" align="center">
        <template #default="{ row }">
          <el-tag size="small" :type="issueTypeTag(row?.issueType)">{{ row?.issueType ?? '-' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="阶段责任人" prop="owner" width="100" align="center" />
      <el-table-column label="处理人" width="90" align="center">
        <template #default="{ row }">{{ row?.handler || '-' }}</template>
      </el-table-column>
      <el-table-column label="发生日期" prop="occurDate" width="100" align="center" />
      <el-table-column label="计划完成" prop="planDoneDate" width="100" align="center" />
      <el-table-column label="实际完成" width="100" align="center">
        <template #default="{ row }">{{ row?.actualDoneDate || '-' }}</template>
      </el-table-column>
      <el-table-column label="状态" width="110" align="center">
        <template #default="{ row }">
          <el-tag size="small" :type="statusTag(row?.status)">{{ ISSUE_STATUS_TEXT[row?.status] ?? '-' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="210">
        <template #default="{ row }">
          <!-- 按钮由 ISSUE_ALLOWED_ACTIONS 驱动，与 store 校验同一份数据源 -->
          <el-button v-if="can(row, 'handle')" link type="primary" @click="openAction(row, 'handle')">处理</el-button>
          <el-button v-if="can(row, 'optimize')" link type="warning" @click="openAction(row, 'optimize')">优化</el-button>
          <el-button v-if="can(row, 'close')" link type="success" @click="handleCloseIssue(row)">结案</el-button>
          <el-button v-if="can(row, 'reject')" link type="danger" @click="openAction(row, 'reject')">打回</el-button>
          <el-button v-if="row?.status !== 'closed'" link type="info" @click="openEdit(row)">编辑</el-button>
          <span v-if="row?.status === 'closed'" class="closed-hint">已闭环</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新建 / 编辑：只登记问题本身，措施由处理 / 优化环节填写 -->
    <Dialog v-model="formVisible" :title="formTitle" width="640px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="所属阶段" prop="stageIdx">
          <el-select v-model="form.stageIdx" placeholder="请选择阶段" style="width:100%">
            <el-option v-for="s in project?.stages || []" :key="s.idx" :label="`${s.idx}. ${s.name}`" :value="s.idx" />
          </el-select>
        </el-form-item>
        <el-form-item label="异常类型" prop="issueType">
          <el-select v-model="form.issueType" placeholder="请选择异常类型" style="width:100%">
            <el-option v-for="t in issueTypes" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="问题" prop="problem">
          <el-input v-model="form.problem" type="textarea" :rows="2" placeholder="问题及改善项" />
        </el-form-item>
        <el-form-item label="原因" prop="cause">
          <el-input v-model="form.cause" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="阶段责任人" prop="owner">
          <el-input v-model="form.owner" disabled placeholder="由所属阶段自动带出" />
        </el-form-item>
        <el-form-item label="处理人" prop="handler">
          <el-select
            v-model="form.handler" filterable allow-create default-first-option
            placeholder="请选择处理人（可直接输入新人员）" style="width:100%"
          >
            <el-option v-for="n in handlerOptions" :key="n" :label="n" :value="n" />
          </el-select>
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

    <!-- 处理 / 优化 / 打回：三个动作共用一个弹窗，字段按动作显示 -->
    <Dialog v-model="actionVisible" :title="actionTitle" width="600px">
      <el-descriptions v-if="actionRow" :column="2" border size="small" class="mb-15px">
        <el-descriptions-item label="所属阶段">{{ stageName(actionRow.stageIdx) }}</el-descriptions-item>
        <el-descriptions-item label="异常类型">{{ actionRow.issueType }}</el-descriptions-item>
        <el-descriptions-item label="问题" :span="2">{{ actionRow.problem }}</el-descriptions-item>
        <el-descriptions-item label="原因" :span="2">{{ actionRow.cause }}</el-descriptions-item>
      </el-descriptions>

      <el-form ref="actionFormRef" :model="actionForm" :rules="actionRules" label-width="90px">
        <template v-if="actionType !== 'reject'">
          <el-form-item label="临时措施" prop="tempMeasure">
            <el-input v-model="actionForm.tempMeasure" type="textarea" :rows="3" placeholder="现场如何先把问题压住" />
          </el-form-item>
          <el-form-item v-if="actionType === 'optimize'" label="长期措施" prop="longMeasure">
            <el-input v-model="actionForm.longMeasure" type="textarea" :rows="3" placeholder="根因层面的改善方案，防止再发" />
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="已填措施">
            <div class="reject-preview">
              <div>临时措施：{{ actionRow?.tempMeasure || '—' }}</div>
              <div>长期措施：{{ actionRow?.longMeasure || '—' }}</div>
            </div>
          </el-form-item>
          <el-form-item label="打回理由" prop="reason">
            <el-input v-model="actionForm.reason" type="textarea" :rows="3" placeholder="哪里不认可，需要处理人补什么" />
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <el-button @click="actionVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAction">保存</el-button>
      </template>
    </Dialog>

    <Dialog v-model="typeDictVisible" title="异常类型维护" width="480px">
      <div class="dict-add">
        <el-input v-model="newTypeName" placeholder="输入新的异常类型" maxlength="20" @keyup.enter="handleAddType" />
        <el-button type="primary" @click="handleAddType">新增</el-button>
      </div>
      <el-table :data="issueTypes.map((t) => ({ name: t }))" size="small" border empty-text="暂无异常类型">
        <el-table-column label="类型名称" prop="name" />
        <el-table-column label="已引用" width="80" align="center">
          <template #default="{ row }">{{ typeUsage(row.name) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleRenameType(row.name)">改名</el-button>
            <el-button link type="danger" @click="handleRemoveType(row.name)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button type="primary" @click="typeDictVisible = false">关闭</el-button>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useNpiStore } from '@/store/modules/npi'
import {
  ISSUE_ALLOWED_ACTIONS,
  ISSUE_STATUS_TEXT,
  ISSUE_ACTION_TEXT,
  type NpiIssue,
  type IssueStatus,
  type IssueFlowAction
} from '@/mock-data/eam-npi'

const props = defineProps<{ projectId: string }>()

const npiStore = useNpiStore()
const message = useMessage()

/** 异常类型来自 store 字典（用户可维护），不再写死常量 */
const issueTypes = computed(() => npiStore.issueTypes)

const STATUS_ORDER: IssueStatus[] = ['pending', 'handled', 'optimized', 'closed']

const project = computed(() => npiStore.projects.find((p) => p.id === props.projectId) || null)
const allIssues = computed(() =>
  npiStore.issues.filter((i) => i.projectId === props.projectId).sort((a, b) => a.seq - b.seq)
)

const statusFilter = ref<IssueStatus | 'all'>('all')
const issues = computed(() =>
  statusFilter.value === 'all' ? allIssues.value : allIssues.value.filter((i) => i.status === statusFilter.value)
)
const statusCount = computed(() => {
  const base = { pending: 0, handled: 0, optimized: 0, closed: 0 } as Record<IssueStatus, number>
  allIssues.value.forEach((i) => { base[i.status] += 1 })
  return base
})

function stageName(idx?: number): string {
  return project.value?.stages.find((s) => s.idx === idx)?.name ?? '-'
}

/** 处理人候选：项目负责人 + 各阶段责任人 + 历史填过的处理人，去重；下拉仍允许直接输入新人员 */
const handlerOptions = computed(() => {
  const names = [
    project.value?.owner,
    ...(project.value?.stages ?? []).map((s) => s.owner),
    ...allIssues.value.map((i) => i.handler)
  ].filter((n): n is string => !!n)
  return [...new Set(names)]
})

function issueTypeTag(type?: string): any {
  const map: Record<string, string> = {
    '结构设计': 'primary', '电气问题': 'danger', '装配问题': 'warning',
    '软件调试': 'info', '品质异常': 'danger', '其他': 'info'
  }
  return map[type ?? ''] ?? 'info'
}

function statusTag(status?: IssueStatus): any {
  const map: Record<IssueStatus, string> = {
    pending: 'info', handled: 'warning', optimized: 'primary', closed: 'success'
  }
  return map[status ?? 'pending']
}

function flowDotType(action: IssueFlowAction): any {
  const map: Record<IssueFlowAction, string> = {
    create: 'info', handle: 'warning', optimize: 'primary', reject: 'danger', close: 'success'
  }
  return map[action] ?? 'info'
}

/** 某条异常当前是否允许某个动作 —— 与 store 校验共用 ISSUE_ALLOWED_ACTIONS */
function can(row: NpiIssue | undefined, action: IssueFlowAction): boolean {
  if (!row?.status) return false
  return ISSUE_ALLOWED_ACTIONS[row.status].includes(action)
}

// ==================== 新建 / 编辑 ====================
const formVisible = ref(false)
const formRef = ref<FormInstance>()
const editingId = ref<string | null>(null)
const formTitle = computed(() => (editingId.value ? '编辑异常' : '新增异常'))

const form = reactive({
  stageIdx: 1, issueType: '其他', problem: '', cause: '',
  owner: '', handler: '', occurDate: '', planDoneDate: ''
})

// 阶段责任人随所属阶段自动带出，用户不直接编辑
watch(() => form.stageIdx, (idx) => {
  form.owner = project.value?.stages.find((s) => s.idx === idx)?.owner ?? ''
})

const rules: FormRules = {
  stageIdx: [{ required: true, message: '请选择所属阶段', trigger: 'change' }],
  issueType: [{ required: true, message: '请选择异常类型', trigger: 'change' }],
  problem: [{ required: true, message: '请填写问题', trigger: 'blur' }],
  cause: [{ required: true, message: '请填写原因', trigger: 'blur' }],
  owner: [{ required: true, message: '所属阶段暂无责任人，请先在阶段管理中补充', trigger: 'change' }],
  handler: [{ required: true, message: '请选择处理人', trigger: 'change' }],
  occurDate: [{ required: true, message: '请选择发生日期', trigger: 'change' }],
  planDoneDate: [{ required: true, message: '请选择计划完成日期', trigger: 'change' }]
}

function openAdd() {
  editingId.value = null
  const stageIdx = project.value?.currentStage ?? 1
  Object.assign(form, {
    stageIdx, issueType: '其他', problem: '', cause: '',
    owner: project.value?.stages.find((s) => s.idx === stageIdx)?.owner ?? '',
    handler: '', occurDate: '', planDoneDate: ''
  })
  formVisible.value = true
}

function openEdit(row: NpiIssue) {
  editingId.value = row.id
  Object.assign(form, {
    stageIdx: row.stageIdx, issueType: row.issueType, problem: row.problem, cause: row.cause,
    owner: row.owner, handler: row.handler ?? '', occurDate: row.occurDate, planDoneDate: row.planDoneDate
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
    message.success('异常记录已新增，等待处理人处理')
  }
  formVisible.value = false
}

// ==================== 闭环流转：处理 / 优化 / 打回 / 结案 ====================
const actionVisible = ref(false)
const actionFormRef = ref<FormInstance>()
const actionRow = ref<NpiIssue | null>(null)
const actionType = ref<IssueFlowAction>('handle')
const actionForm = reactive({ tempMeasure: '', longMeasure: '', reason: '' })

const actionTitle = computed(() => {
  const name = ISSUE_ACTION_TEXT[actionType.value]
  return `${name}异常 · 序号 ${actionRow.value?.seq ?? ''}`
})

const actionRules = computed<FormRules>(() => ({
  tempMeasure: actionType.value === 'reject' ? [] : [{ required: true, message: '请填写临时措施', trigger: 'blur' }],
  longMeasure: actionType.value === 'optimize' ? [{ required: true, message: '请填写长期措施', trigger: 'blur' }] : [],
  reason: actionType.value === 'reject' ? [{ required: true, message: '请填写打回理由', trigger: 'blur' }] : []
}))

function openAction(row: NpiIssue, type: IssueFlowAction) {
  actionRow.value = row
  actionType.value = type
  // 优化 / 打回时预填已有措施，处理人在原基础上改，不用重打
  Object.assign(actionForm, {
    tempMeasure: row.tempMeasure ?? '',
    longMeasure: row.longMeasure ?? '',
    reason: ''
  })
  actionVisible.value = true
}

async function submitAction() {
  const valid = await actionFormRef.value?.validate().catch(() => false)
  if (!valid || !actionRow.value) return
  try {
    npiStore.transitionIssue(actionRow.value.id, actionType.value, {
      tempMeasure: actionType.value === 'reject' ? undefined : actionForm.tempMeasure,
      longMeasure: actionType.value === 'optimize' ? actionForm.longMeasure : undefined,
      reason: actionForm.reason
    })
    message.success(`已${ISSUE_ACTION_TEXT[actionType.value]}`)
    actionVisible.value = false
  } catch (e: any) {
    message.warning(e?.message ?? '操作失败')
  }
}

async function handleCloseIssue(row: NpiIssue) {
  try {
    await ElMessageBox.confirm(
      `以阶段责任人 ${row.owner || '（未指定）'} 的身份确认本条异常结案？`,
      '确认结案',
      { type: 'success', confirmButtonText: '确认结案', cancelButtonText: '取消' }
    )
  } catch {
    return
  }
  try {
    npiStore.transitionIssue(row.id, 'close')
    message.success('异常已结案')
  } catch (e: any) {
    message.warning(e?.message ?? '结案失败')
  }
}

// ==================== 异常类型字典维护 ====================
const typeDictVisible = ref(false)
const newTypeName = ref('')

function typeUsage(name: string): number {
  return npiStore.issues.filter((i) => i.issueType === name).length
}

function handleAddType() {
  try {
    npiStore.addIssueType(newTypeName.value)
    newTypeName.value = ''
    message.success('已新增异常类型')
  } catch (e: any) {
    message.warning(e?.message ?? '新增失败')
  }
}

async function handleRenameType(oldName: string) {
  try {
    const { value } = await ElMessageBox.prompt('请输入新的类型名称', `重命名「${oldName}」`, {
      inputValue: oldName,
      inputValidator: (v: string) => (v && v.trim() ? true : '名称不能为空')
    })
    npiStore.renameIssueType(oldName, value)
    message.success('已重命名，引用该类型的异常记录同步更新')
  } catch (e: any) {
    if (e === 'cancel' || e === 'close') return
    message.warning(e?.message ?? '重命名失败')
  }
}

function handleRemoveType(name: string) {
  const res = npiStore.removeIssueType(name)
  if (!res.ok) {
    message.warning(`该类型已被 ${res.usedBy} 条异常记录引用，不能删除`)
    return
  }
  message.success('已删除异常类型')
}
</script>

<style scoped>
.stage-summary { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 10px; font-size: 12px; color: #606266; }
.summary-item { padding: 2px 8px; background: #F5F7FA; border-radius: 3px; }
.toolbar { margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.toolbar-left { display: flex; gap: 8px; }
.dict-add { display: flex; gap: 8px; margin-bottom: 10px; }

.status-filter { display: flex; gap: 8px; flex-wrap: wrap; }
.filter-chip {
  cursor: pointer; padding: 3px 10px; border-radius: 12px; font-size: 12px;
  background: #F5F7FA; color: #606266; border: 1px solid transparent;
}
.filter-chip:hover { background: #ECF5FF; }
.filter-chip.active { border-color: #1677FF; color: #1677FF; background: #ECF5FF; font-weight: 600; }
.chip-pending { color: #909399; }
.chip-handled { color: #FA8C16; }
.chip-optimized { color: #1677FF; }
.chip-closed { color: #52C41A; }

.flow-panel { padding: 8px 20px 0 40px; }
.flow-title { font-size: 13px; font-weight: 600; color: #303133; margin-bottom: 10px; }
.flow-remark { color: #606266; font-size: 12px; margin-top: 2px; line-height: 1.6; }
.reject-preview { color: #606266; font-size: 12px; line-height: 1.8; }
.closed-hint { color: #909399; font-size: 12px; }
</style>

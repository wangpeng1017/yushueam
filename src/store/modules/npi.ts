/**
 * EM-06 非标设备研制（NPI）改版 — Pinia store
 * 纯前端 demo：数据落地 localStorage（key: eam-npi-store-v2），不经后端接口。
 * 2026-09-04 设计文档：docs/plans/2026-09-04-npi-project-management-design.md
 * 2026-09-04 修正：知识库去「只读目录」概念，改为自由文件夹/文件管理（根目录仅禁删除）。
 */
import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import {
  buildSeed,
  DEFAULT_ISSUE_TYPES,
  ISSUE_ALLOWED_ACTIONS,
  ISSUE_ACTION_TEXT,
  STAGE_TEMPLATE,
  type NpiProject,
  type NpiStage,
  type NpiIssue,
  type NpiIssueFlow,
  type IssueFlowAction,
  type IssueStatus,
  type KbFolder,
  type KbFile,
  type NpiDoc,
  type ProjectStatus
} from '@/mock-data/eam-npi'

const STORAGE_KEY = 'eam-npi-store-v2'

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function today(): string {
  return dayjs().format('YYYY-MM-DD')
}

/** 文件夹 id 自身 + 全部子孙文件夹 id（用于级联删除/统计） */
function collectDescendantFolderIds(folders: KbFolder[], id: string): string[] {
  const childIds = folders.filter((f) => f.parentId === id).map((f) => f.id)
  return [id, ...childIds.flatMap((cid) => collectDescendantFolderIds(folders, cid))]
}

/** 从项目某阶段的 docs 中移除同名记录（知识库文件与项目阶段资料按 name 对应，id 各自独立生成） */
function pruneStageDocByName(projects: NpiProject[], projectId: string, stageIdx: number, docName: string): NpiProject[] {
  return projects.map((p) => {
    if (p.id !== projectId) return p
    return {
      ...p,
      stages: p.stages.map((s) => (s.idx === stageIdx ? { ...s, docs: s.docs.filter((d) => d.name !== docName) } : s))
    }
  })
}

/** 新建项目：按 8 阶段模板等分计划区间生成 stages，第一阶段直接进入进行中 */
function buildNewStages(planStart: string, planEnd: string, owner: string): NpiStage[] {
  const s = dayjs(planStart)
  const e = dayjs(planEnd)
  const totalDays = Math.max(e.diff(s, 'day'), 7)
  const n = STAGE_TEMPLATE.length
  return STAGE_TEMPLATE.map((tpl, i) => {
    const segStart = s.add(Math.round((totalDays * i) / n), 'day')
    const segEndRaw = i === n - 1 ? e : s.add(Math.round((totalDays * (i + 1)) / n) - 1, 'day')
    const segEnd = segEndRaw.isBefore(segStart) ? segStart : segEndRaw
    return {
      idx: tpl.idx,
      name: tpl.name,
      owner,
      planStart: segStart.format('YYYY-MM-DD'),
      planEnd: segEnd.format('YYYY-MM-DD'),
      progress: 0,
      status: i === 0 ? 'in_progress' : 'pending',
      requiredDocs: tpl.requiredDocs,
      docs: [],
      logs: []
    } as NpiStage
  })
}

export interface AddProjectPayload {
  projectCode: string
  projectName: string
  owner: string
  planStart: string
  planEnd: string
  description: string
}

export interface AddIssuePayload {
  projectId: string
  stageIdx: number
  problem: string
  cause: string
  /** 措施由处理 / 优化环节填写，新建时不传 */
  tempMeasure?: string
  longMeasure?: string
  issueType: NpiIssue['issueType']
  owner: string
  handler: string
  occurDate: string
  planDoneDate: string
}

/** 流转入参：处理/优化带措施，打回带理由，结案无附加字段 */
export interface IssueTransitionPayload {
  tempMeasure?: string
  longMeasure?: string
  reason?: string
  /** 操作人；不传则按动作取处理人（处理/优化）或阶段责任人（打回/结案） */
  operator?: string
}

/** 动作 → 流转后状态。与 ISSUE_ALLOWED_ACTIONS 一起构成状态机的全部规则 */
const ACTION_TARGET: Record<IssueFlowAction, IssueStatus> = {
  create: 'pending',
  handle: 'handled',
  optimize: 'optimized',
  reject: 'pending',
  close: 'closed'
}

/**
 * 旧存档兼容：早期 issue 是 open/closed 两态、无 flow/handler。
 * 读档时统一补齐，避免页面上出现空状态标签或空流转记录。
 */
function normalizeIssue(raw: any): NpiIssue {
  const legacyStatus: Record<string, IssueStatus> = { open: 'pending', closed: 'closed' }
  const status: IssueStatus = legacyStatus[raw?.status] ?? raw?.status ?? 'pending'
  const flow: NpiIssueFlow[] = Array.isArray(raw?.flow) && raw.flow.length
    ? raw.flow
    : [{ time: `${raw?.occurDate ?? today()} 00:00`, action: 'create' as const, operator: raw?.owner ?? '', remark: '新建异常' }]
  return { ...raw, handler: raw?.handler ?? '', status, flow }
}

export interface AdvanceResult {
  ok: boolean
  missing: string[]
}

export const useNpiStore = defineStore('npi', {
  state: () => ({
    projects: [] as NpiProject[],
    issues: [] as NpiIssue[],
    folders: [] as KbFolder[],
    files: [] as KbFile[],
    /** 异常类型字典：用户可自维护，随其余数据一起落 localStorage */
    issueTypes: [...DEFAULT_ISSUE_TYPES] as string[],
    loaded: false
  }),

  getters: {
    /** 2 天内到期 / 已逾期的进行中阶段提醒 */
    reminders: (state) => {
      const dueSoon: { project: NpiProject; stage: NpiStage; daysLeft: number }[] = []
      const overdue: { project: NpiProject; stage: NpiStage; daysLeft: number }[] = []
      const todayStart = dayjs().startOf('day')
      state.projects.forEach((project) => {
        project.stages.forEach((stage) => {
          if (stage.status !== 'in_progress') return
          const daysLeft = dayjs(stage.planEnd).diff(todayStart, 'day')
          if (daysLeft >= 0 && daysLeft <= 2) dueSoon.push({ project, stage, daysLeft })
          else if (daysLeft < 0) overdue.push({ project, stage, daysLeft })
        })
      })
      return { dueSoon, overdue }
    }
  },

  actions: {
    // ==================== 持久化 ====================
    load() {
      if (this.loaded) return
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const data = JSON.parse(raw)
          this.projects = data.projects || []
          this.issues = (data.issues || []).map(normalizeIssue)
          this.folders = data.folders || []
          this.files = data.files || []
          // 旧版本存档没有 issueTypes，回落默认字典
          this.issueTypes = data.issueTypes?.length ? data.issueTypes : [...DEFAULT_ISSUE_TYPES]
          this.loaded = true
          return
        }
      } catch (e) {
        console.error('NPI store load failed, fallback to seed:', e)
      }
      this.resetSeed()
      this.loaded = true
    },

    persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          projects: this.projects, issues: this.issues, folders: this.folders,
          files: this.files, issueTypes: this.issueTypes
        }))
      } catch (e) {
        console.error('NPI store persist failed:', e)
      }
    },

    resetSeed() {
      const seed = buildSeed()
      this.projects = seed.projects
      this.issues = seed.issues
      this.folders = seed.folders
      this.files = seed.files
      this.issueTypes = [...DEFAULT_ISSUE_TYPES]
      this.persist()
    },

    // ==================== 项目 ====================
    addProject(payload: AddProjectPayload): NpiProject {
      const project: NpiProject = {
        id: uid('p'),
        projectCode: payload.projectCode,
        projectName: payload.projectName,
        owner: payload.owner,
        planStart: payload.planStart,
        planEnd: payload.planEnd,
        status: 'in_progress',
        currentStage: 1,
        stages: buildNewStages(payload.planStart, payload.planEnd, payload.owner),
        description: payload.description
      }
      this.projects = [...this.projects, project]

      // 同步在「项目资料」根下创建该项目的文件夹（已存在同 projectId 的不重复建）
      const projFolderId = `kb-proj-${project.id}`
      if (!this.folders.find((f) => f.projectId === project.id && f.parentId === 'kb-root-project')) {
        this.folders = [...this.folders, { id: projFolderId, parentId: 'kb-root-project', name: project.projectName, projectId: project.id }]
      }

      this.persist()
      return project
    },

    updateProject(id: string, patch: Partial<Pick<NpiProject, 'projectCode' | 'projectName' | 'owner' | 'planStart' | 'planEnd' | 'description' | 'status'>>) {
      this.projects = this.projects.map((p) => (p.id === id ? { ...p, ...patch } : p))
      this.persist()
    },

    /** 删除项目：级联删除该项目在知识库下的文件夹树与文件 */
    removeProject(id: string) {
      const projFolderId = `kb-proj-${id}`
      if (this.folders.find((f) => f.id === projFolderId)) {
        const idSet = new Set(collectDescendantFolderIds(this.folders, projFolderId))
        this.files = this.files.filter((f) => !idSet.has(f.folderId))
        this.folders = this.folders.filter((f) => !idSet.has(f.id))
      }
      this.projects = this.projects.filter((p) => p.id !== id)
      this.persist()
    },

    // ==================== 阶段 ====================
    updateStage(projectId: string, stageIdx: number, patch: Partial<Pick<NpiStage, 'name' | 'owner' | 'planStart' | 'planEnd' | 'progress'>>) {
      const project = this.projects.find((p) => p.id === projectId)
      if (!project) return
      project.stages = project.stages.map((s) => {
        if (s.idx !== stageIdx) return s
        const logs = [...s.logs, {
          time: `${today()} ${dayjs().format('HH:mm')}`,
          action: 'edit' as const,
          operator: patch.owner || s.owner,
          remark: '手工编辑阶段信息'
        }]
        return { ...s, ...patch, logs }
      })
      this.projects = [...this.projects]
      this.persist()
    },

    /**
     * 在第 afterIdx 个阶段之后插入一个新阶段（新增阶段的唯一入口）。
     * 阶段 idx 是「位置序号」不是稳定 ID，插入后整表重排，因此必须同步位移全部引用点：
     * project.currentStage、issues.stageIdx、知识库 folders/files.stageIdx。
     * 新增出口时务必接这个入口，不要在别处自行拼 stages 数组。
     */
    insertStageAfter(projectId: string, afterIdx: number): NpiStage | null {
      const project = this.projects.find((p) => p.id === projectId)
      if (!project) return null
      const pos = project.stages.findIndex((s) => s.idx === afterIdx)
      if (pos < 0) return null

      const prev = project.stages[pos]
      const start = dayjs(prev.planEnd).add(1, 'day')
      const newStage: NpiStage = {
        idx: afterIdx + 1,
        name: '新阶段',
        owner: prev.owner,
        planStart: start.format('YYYY-MM-DD'),
        planEnd: start.add(2, 'day').format('YYYY-MM-DD'),
        progress: 0,
        status: 'pending',
        requiredDocs: [],
        docs: [],
        logs: [{
          time: `${today()} ${dayjs().format('HH:mm')}`,
          action: 'edit' as const,
          operator: prev.owner,
          remark: `在「${prev.name}」之后新增阶段`
        }]
      }

      const merged = [...project.stages.slice(0, pos + 1), newStage, ...project.stages.slice(pos + 1)]
      project.stages = merged.map((s, i) => ({ ...s, idx: i + 1 }))
      if (project.currentStage > afterIdx) project.currentStage += 1
      this.projects = [...this.projects]

      const shift = (idx: number | undefined) => (idx !== undefined && idx > afterIdx ? idx + 1 : idx)
      this.issues = this.issues.map((i) =>
        i.projectId === projectId ? { ...i, stageIdx: shift(i.stageIdx)! } : i
      )
      this.folders = this.folders.map((f) =>
        f.projectId === projectId ? { ...f, stageIdx: shift(f.stageIdx) } : f
      )
      this.files = this.files.map((f) =>
        f.projectId === projectId ? { ...f, stageIdx: shift(f.stageIdx) } : f
      )

      this.persist()
      return newStage
    },

    /** 推进到下一阶段；force=true 时忽略缺失资料强推，reason 记入阶段日志 */
    advanceStage(projectId: string, force = false, reason = ''): AdvanceResult {
      const project = this.projects.find((p) => p.id === projectId)
      if (!project) return { ok: false, missing: [] }
      const stage = project.stages.find((s) => s.idx === project.currentStage)
      if (!stage) return { ok: false, missing: [] }

      const missing = stage.requiredDocs.filter((docName) => !stage.docs.some((d) => d.name.includes(docName)))
      if (missing.length > 0 && !force) {
        return { ok: false, missing }
      }

      const logEntry = {
        time: `${today()} ${dayjs().format('HH:mm')}`,
        action: (missing.length > 0 ? 'force_advance' : 'advance') as 'force_advance' | 'advance',
        operator: stage.owner,
        remark: missing.length > 0
          ? `资料缺失强制推进（缺：${missing.join('、')}）；理由：${reason || '未填写'}`
          : '资料齐全，正常推进下一阶段'
      }

      // 阶段总数可由「插入阶段」变动，不能写死 8
      const isLast = stage.idx >= project.stages.length
      project.stages = project.stages.map((s) => {
        if (s.idx === stage.idx) {
          return { ...s, status: 'completed', progress: 100, logs: [...s.logs, logEntry] }
        }
        if (!isLast && s.idx === stage.idx + 1) {
          return { ...s, status: 'in_progress' }
        }
        return s
      })
      project.currentStage = isLast ? stage.idx : stage.idx + 1
      project.status = (isLast ? 'delivered' : 'in_progress') as ProjectStatus

      this.projects = [...this.projects]
      this.persist()
      return { ok: true, missing: [] }
    },

    /** 阶段上传资料：写入阶段 docs，并自动归档到知识库 项目资料/项目名/阶段名 */
    addStageDoc(projectId: string, stageIdx: number, doc: { name: string; size: number; type: string }) {
      const project = this.projects.find((p) => p.id === projectId)
      if (!project) return
      const stage = project.stages.find((s) => s.idx === stageIdx)
      if (!stage) return

      const newDoc: NpiDoc = {
        id: uid('doc'),
        name: doc.name,
        size: doc.size,
        type: doc.type,
        uploadedAt: today(),
        uploader: stage.owner
      }
      project.stages = project.stages.map((s) => (s.idx === stageIdx ? { ...s, docs: [...s.docs, newDoc] } : s))
      this.projects = [...this.projects]

      // 归档到知识库：项目资料/项目名/阶段名
      const projFolderId = `kb-proj-${project.id}`
      if (!this.folders.find((f) => f.id === projFolderId)) {
        this.folders = [...this.folders, {
          id: projFolderId, parentId: 'kb-root-project', name: project.projectName, projectId: project.id
        }]
      }
      // 阶段文件夹按 projectId + stageIdx 字段定位（不能靠 id 拼 -s{idx}）：
      // 插入阶段会重排序号，folder.id 必须保持稳定，否则旧夹认不出来会重复建夹
      let stageFolder = this.folders.find((f) => f.projectId === project.id && f.stageIdx === stageIdx)
      if (!stageFolder) {
        stageFolder = { id: uid('kbfolder'), parentId: projFolderId, name: stage.name, projectId: project.id, stageIdx }
        this.folders = [...this.folders, stageFolder]
      }
      this.files = [...this.files, { ...newDoc, id: uid('kbfile'), folderId: stageFolder.id, projectId: project.id, stageIdx }]

      this.persist()
    },

    // ==================== 异常履历 ====================
    addIssue(payload: AddIssuePayload) {
      const seq = this.issues.filter((i) => i.projectId === payload.projectId).length + 1
      const issue: NpiIssue = {
        id: uid('iss'),
        projectId: payload.projectId,
        stageIdx: payload.stageIdx,
        seq,
        problem: payload.problem,
        cause: payload.cause,
        tempMeasure: payload.tempMeasure ?? '',
        longMeasure: payload.longMeasure ?? '',
        issueType: payload.issueType,
        owner: payload.owner,
        handler: payload.handler,
        occurDate: payload.occurDate,
        planDoneDate: payload.planDoneDate,
        actualDoneDate: '',
        status: 'pending',
        flow: [{
          time: `${today()} ${dayjs().format('HH:mm')}`,
          action: 'create',
          operator: payload.owner,
          remark: `新建异常，指定处理人：${payload.handler || '未指定'}`
        }]
      }
      this.issues = [...this.issues, issue]
      this.persist()
    },

    updateIssue(id: string, patch: Partial<NpiIssue>) {
      this.issues = this.issues.map((i) => (i.id === id ? { ...i, ...patch } : i))
      this.persist()
    },

    /**
     * 异常闭环流转的唯一入口：处理 / 优化 / 打回 / 结案全部走这里。
     * 集中做「合法性校验 → 写措施字段 → 追加流转记录 → 持久化」，
     * 页面按钮不得自行 updateIssue 改 status，否则流转记录会缺条。
     * 合法性以 ISSUE_ALLOWED_ACTIONS 为准，与操作列按钮同一份数据源。
     */
    transitionIssue(id: string, action: IssueFlowAction, payload: IssueTransitionPayload = {}) {
      const issue = this.issues.find((i) => i.id === id)
      if (!issue) throw new Error('异常记录不存在')
      if (!ISSUE_ALLOWED_ACTIONS[issue.status].includes(action)) {
        throw new Error(`当前状态「${issue.status}」不允许执行「${ISSUE_ACTION_TEXT[action]}」`)
      }

      const operator = payload.operator
        || (action === 'handle' || action === 'optimize' ? issue.handler : issue.owner)
      const nextStatus = ACTION_TARGET[action]

      const remark = action === 'reject'
        ? `打回理由：${payload.reason ?? ''}`
        : action === 'close'
          ? '结案：确认处理结果有效'
          : [
              payload.tempMeasure ? `临时措施：${payload.tempMeasure}` : '',
              payload.longMeasure ? `长期措施：${payload.longMeasure}` : ''
            ].filter(Boolean).join('；')

      const entry: NpiIssueFlow = {
        time: `${today()} ${dayjs().format('HH:mm')}`,
        action,
        operator,
        remark
      }

      this.issues = this.issues.map((i) => {
        if (i.id !== id) return i
        return {
          ...i,
          // 打回不清空已填措施：处理人在原基础上改
          tempMeasure: payload.tempMeasure ?? i.tempMeasure,
          longMeasure: payload.longMeasure ?? i.longMeasure,
          status: nextStatus,
          actualDoneDate: action === 'close' ? today() : i.actualDoneDate,
          flow: [...i.flow, entry]
        }
      })
      this.persist()
    },

    // ==================== 异常类型字典（用户自维护） ====================
    /** 新增一个异常类型；重名直接抛错，由调用方提示 */
    addIssueType(name: string) {
      const value = name.trim()
      if (!value) throw new Error('类型名称不能为空')
      if (this.issueTypes.includes(value)) throw new Error('该类型已存在')
      this.issueTypes = [...this.issueTypes, value]
      this.persist()
    },

    /** 重命名异常类型：同步改写已引用该类型的异常记录，避免出现悬空取值 */
    renameIssueType(oldName: string, newName: string) {
      const value = newName.trim()
      if (!value) throw new Error('类型名称不能为空')
      if (value === oldName) return
      if (this.issueTypes.includes(value)) throw new Error('该类型已存在')
      this.issueTypes = this.issueTypes.map((t) => (t === oldName ? value : t))
      this.issues = this.issues.map((i) => (i.issueType === oldName ? { ...i, issueType: value } : i))
      this.persist()
    },

    /** 删除异常类型：已被异常记录引用时拒绝删除（返回引用条数供提示） */
    removeIssueType(name: string): { ok: boolean; usedBy: number } {
      const usedBy = this.issues.filter((i) => i.issueType === name).length
      if (usedBy > 0) return { ok: false, usedBy }
      this.issueTypes = this.issueTypes.filter((t) => t !== name)
      this.persist()
      return { ok: true, usedBy: 0 }
    },

    // ==================== 知识库（自由文件夹/文件管理，根目录仅禁删除） ====================
    addFolder(parentId: string, name: string) {
      const parent = this.folders.find((f) => f.id === parentId)
      if (!parent) throw new Error('父目录不存在')
      this.folders = [...this.folders, { id: uid('kbfolder'), parentId, name }]
      this.persist()
    },

    renameFolder(id: string, name: string) {
      const folder = this.folders.find((f) => f.id === id)
      if (!folder) throw new Error('文件夹不存在')
      this.folders = this.folders.map((f) => (f.id === id ? { ...f, name } : f))
      this.persist()
    },

    /** 级联删除文件夹：递归删除所有子孙文件夹与其中文件；被删文件若带 projectId/stageIdx，同步从项目阶段 docs 移除同名记录 */
    removeFolder(id: string): { folders: number; files: number } {
      const folder = this.folders.find((f) => f.id === id)
      if (!folder) throw new Error('文件夹不存在')
      if (folder.parentId === null) throw new Error('根目录不能删除')

      const idSet = new Set(collectDescendantFolderIds(this.folders, id))
      const removedFiles = this.files.filter((f) => idSet.has(f.folderId))

      let projects = this.projects
      removedFiles.forEach((f) => {
        if (f.projectId && f.stageIdx !== undefined) {
          projects = pruneStageDocByName(projects, f.projectId, f.stageIdx, f.name)
        }
      })
      this.projects = projects

      this.files = this.files.filter((f) => !idSet.has(f.folderId))
      this.folders = this.folders.filter((f) => !idSet.has(f.id))
      this.persist()

      return { folders: idSet.size - 1, files: removedFiles.length }
    },

    addFile(folderId: string, file: { name: string; size: number; type: string; uploader: string }) {
      const folder = this.folders.find((f) => f.id === folderId)
      if (!folder) throw new Error('文件夹不存在')
      const newFile: KbFile = {
        id: uid('kbfile'), name: file.name, size: file.size, type: file.type,
        uploadedAt: today(), uploader: file.uploader, folderId
      }
      this.files = [...this.files, newFile]
      this.persist()
    },

    /** 删除文件：若带 projectId/stageIdx，同步从项目阶段 docs 移除同名记录 */
    removeFile(id: string) {
      const file = this.files.find((f) => f.id === id)
      if (!file) throw new Error('文件不存在')
      if (file.projectId && file.stageIdx !== undefined) {
        this.projects = pruneStageDocByName(this.projects, file.projectId, file.stageIdx, file.name)
      }
      this.files = this.files.filter((f) => f.id !== id)
      this.persist()
    }
  }
})

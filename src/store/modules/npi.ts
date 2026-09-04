/**
 * EM-06 非标设备研制（NPI）改版 — Pinia store
 * 纯前端 demo：数据落地 localStorage（key: eam-npi-store-v1），不经后端接口。
 * 2026-09-04 设计文档：docs/plans/2026-09-04-npi-project-management-design.md
 */
import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import {
  buildSeed,
  STAGE_TEMPLATE,
  type NpiProject,
  type NpiStage,
  type NpiIssue,
  type KbFolder,
  type KbFile,
  type NpiDoc,
  type ProjectStatus
} from '@/mock-data/eam-npi'

const STORAGE_KEY = 'eam-npi-store-v1'

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function today(): string {
  return dayjs().format('YYYY-MM-DD')
}

/** 新建项目：按 8 阶段模板等分计划区间生成 stages，第一阶段直接进入进行中 */
function buildNewStages(planStart: string, planEnd: string, owner: string): NpiStage[] {
  const s = dayjs(planStart)
  const e = dayjs(planEnd)
  const totalDays = Math.max(e.diff(s, 'day'), 7)
  return STAGE_TEMPLATE.map((tpl, i) => {
    const segStart = s.add(Math.round((totalDays * i) / 8), 'day')
    const segEndRaw = i === 7 ? e : s.add(Math.round((totalDays * (i + 1)) / 8) - 1, 'day')
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
  tempMeasure: string
  longMeasure: string
  issueType: NpiIssue['issueType']
  owner: string
  occurDate: string
  planDoneDate: string
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
          this.issues = data.issues || []
          this.folders = data.folders || []
          this.files = data.files || []
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
          projects: this.projects, issues: this.issues, folders: this.folders, files: this.files
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
      this.persist()
      return project
    },

    updateProject(id: string, patch: Partial<Pick<NpiProject, 'projectCode' | 'projectName' | 'owner' | 'planStart' | 'planEnd' | 'description' | 'status'>>) {
      this.projects = this.projects.map((p) => (p.id === id ? { ...p, ...patch } : p))
      this.persist()
    },

    removeProject(id: string) {
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

      const isLast = stage.idx >= 8
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

    /** 阶段上传资料：写入阶段 docs，并自动归档到知识库 项目资料/项目名/阶段名（只读） */
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

      // 归档到知识库：项目资料/项目名（只读）/阶段名（只读）
      const projFolderId = `kb-proj-${project.id}`
      if (!this.folders.find((f) => f.id === projFolderId)) {
        this.folders = [...this.folders, {
          id: projFolderId, parentId: 'kb-root-project', name: project.projectName, readonly: true, projectId: project.id
        }]
      }
      const stageFolderId = `${projFolderId}-s${stageIdx}`
      if (!this.folders.find((f) => f.id === stageFolderId)) {
        this.folders = [...this.folders, {
          id: stageFolderId, parentId: projFolderId, name: stage.name, readonly: true, projectId: project.id, stageIdx
        }]
      }
      this.files = [...this.files, { ...newDoc, id: uid('kbfile'), folderId: stageFolderId, projectId: project.id, stageIdx }]

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
        tempMeasure: payload.tempMeasure,
        longMeasure: payload.longMeasure,
        issueType: payload.issueType,
        owner: payload.owner,
        occurDate: payload.occurDate,
        planDoneDate: payload.planDoneDate,
        actualDoneDate: '',
        status: 'open'
      }
      this.issues = [...this.issues, issue]
      this.persist()
    },

    updateIssue(id: string, patch: Partial<NpiIssue>) {
      this.issues = this.issues.map((i) => (i.id === id ? { ...i, ...patch } : i))
      this.persist()
    },

    closeIssue(id: string) {
      this.issues = this.issues.map((i) => (i.id === id ? { ...i, status: 'closed', actualDoneDate: today() } : i))
      this.persist()
    },

    // ==================== 知识库 ====================
    addFolder(parentId: string, name: string) {
      const parent = this.folders.find((f) => f.id === parentId)
      if (!parent) throw new Error('父目录不存在')
      if (parent.readonly) throw new Error('该目录为系统只读目录，不能在此新建文件夹')
      this.folders = [...this.folders, { id: uid('kbfolder'), parentId, name, readonly: false }]
      this.persist()
    },

    renameFolder(id: string, name: string) {
      const folder = this.folders.find((f) => f.id === id)
      if (!folder) throw new Error('文件夹不存在')
      if (folder.readonly) throw new Error('该文件夹为系统只读目录，不能重命名')
      this.folders = this.folders.map((f) => (f.id === id ? { ...f, name } : f))
      this.persist()
    },

    removeFolder(id: string) {
      const folder = this.folders.find((f) => f.id === id)
      if (!folder) throw new Error('文件夹不存在')
      if (folder.readonly) throw new Error('该文件夹为系统只读目录，不能删除')
      const hasChildFolder = this.folders.some((f) => f.parentId === id)
      const hasChildFile = this.files.some((f) => f.folderId === id)
      if (hasChildFolder || hasChildFile) throw new Error('文件夹非空，请先清空后再删除')
      this.folders = this.folders.filter((f) => f.id !== id)
      this.persist()
    },

    addFile(folderId: string, file: { name: string; size: number; type: string; uploader: string }) {
      const folder = this.folders.find((f) => f.id === folderId)
      if (!folder) throw new Error('文件夹不存在')
      if (folder.readonly) throw new Error('该文件夹为系统只读目录，不能上传文件')
      const newFile: KbFile = {
        id: uid('kbfile'), name: file.name, size: file.size, type: file.type,
        uploadedAt: today(), uploader: file.uploader, folderId
      }
      this.files = [...this.files, newFile]
      this.persist()
    },

    removeFile(id: string) {
      const file = this.files.find((f) => f.id === id)
      if (!file) throw new Error('文件不存在')
      const folder = this.folders.find((f) => f.id === file.folderId)
      if (folder?.readonly) throw new Error('该文件夹为系统只读目录，不能删除文件')
      this.files = this.files.filter((f) => f.id !== id)
      this.persist()
    }
  }
})

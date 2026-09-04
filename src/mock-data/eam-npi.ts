/**
 * EM-06 非标设备研制（NPI）改版 — 类型 + 阶段模板 + 种子数据
 * 2026-09-04 设计文档：docs/plans/2026-09-04-npi-project-management-design.md
 * 纯前端 demo：不再导出 mock 接口，数据由 src/store/modules/npi.ts 持久化到 localStorage。
 */
import dayjs from 'dayjs'

// ==================== 类型定义（design §3） ====================

export type StageStatus = 'pending' | 'in_progress' | 'completed'
export type ProjectStatus = 'not_started' | 'in_progress' | 'delivered'
export type IssueType = '结构设计' | '电气问题' | '装配问题' | '软件调试' | '品质异常' | '其他'
export type IssueStatus = 'open' | 'closed'
export type StageLogAction = 'advance' | 'force_advance' | 'edit'

export interface NpiDoc {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: string
  uploader: string
}

export interface NpiStageLog {
  time: string
  action: StageLogAction
  operator: string
  remark: string
}

export interface NpiStage {
  idx: number // 1~8
  name: string
  owner: string
  planStart: string
  planEnd: string
  progress: number // 0~100
  status: StageStatus
  requiredDocs: string[]
  docs: NpiDoc[]
  logs: NpiStageLog[]
}

export interface NpiProject {
  id: string
  projectCode: string
  projectName: string
  owner: string
  planStart: string
  planEnd: string
  status: ProjectStatus
  currentStage: number // 1~8
  stages: NpiStage[]
  description: string
}

export interface NpiIssue {
  id: string
  projectId: string
  stageIdx: number
  seq: number
  problem: string
  cause: string
  tempMeasure: string
  longMeasure: string
  issueType: IssueType
  owner: string
  occurDate: string
  planDoneDate: string
  actualDoneDate: string
  status: IssueStatus
}

export interface KbFolder {
  id: string
  parentId: string | null
  name: string
  readonly: boolean
  projectId?: string
  stageIdx?: number
}

export interface KbFile extends NpiDoc {
  folderId: string
  projectId?: string
  stageIdx?: number
}

// ==================== 8 阶段模板（design §3 表） ====================

export interface StageTemplateItem {
  idx: number
  name: string
  requiredDocs: string[]
}

export const STAGE_TEMPLATE: StageTemplateItem[] = [
  { idx: 1, name: '方案设计+评审', requiredDocs: ['方案设计说明书', '方案评审记录'] },
  { idx: 2, name: '细化出图', requiredDocs: ['机械图纸', '电气图纸'] },
  { idx: 3, name: 'BOM整理下单', requiredDocs: ['BOM 清单'] },
  { idx: 4, name: '物料采购', requiredDocs: ['采购订单'] },
  { idx: 5, name: '整机装配', requiredDocs: ['装配检查表'] },
  { idx: 6, name: '整机布线', requiredDocs: ['布线检查表'] },
  { idx: 7, name: '上电调试', requiredDocs: ['调试报告'] },
  { idx: 8, name: '交付导入', requiredDocs: ['验收报告'] }
]

// ==================== 种子数据构造 ====================

interface ProjectSpec {
  id: string
  projectCode: string
  projectName: string
  owner: string
  overallStart: string
  overallEnd: string
  currentStage: number
  currentStageStart?: string
  currentStageEnd?: string
  status: ProjectStatus
  description: string
}

// 14 个项目（编号取自附件 CIP 系列，日期覆盖 2026-03~2026-09，
// 其中 CIP045/CIP046 2 天内到期、CIP033/CIP047 已逾期、CIP008/CIP009 已交付）
const PROJECT_SPECS: ProjectSpec[] = [
  {
    id: 'p-cip033', projectCode: 'CIP033', projectName: '全自动上下料机', owner: '李工',
    overallStart: '2026-03-02', overallEnd: '2026-09-15', currentStage: 6,
    currentStageStart: '2026-08-01', currentStageEnd: '2026-08-20', status: 'in_progress',
    description: '产线自动上下料，机械手+真空吸盘配合视觉定位，替代人工上下料'
  },
  {
    id: 'p-cip045', projectCode: 'CIP045', projectName: '7520通用热装专机', owner: '谢工',
    overallStart: '2026-03-10', overallEnd: '2026-09-20', currentStage: 5,
    currentStageStart: '2026-08-20', currentStageEnd: '2026-09-05', status: 'in_progress',
    description: '7520 系列电机定子热装通用工站，伺服压装+温度闭环控制'
  },
  {
    id: 'p-cip046', projectCode: 'CIP046', projectName: '7520转子轴组装机', owner: '刘工',
    overallStart: '2026-03-15', overallEnd: '2026-09-25', currentStage: 7,
    currentStageStart: '2026-08-25', currentStageEnd: '2026-09-06', status: 'in_progress',
    description: '7520 电机转子与轴过盈压装，含压装曲线在线判定'
  },
  {
    id: 'p-cip047', projectCode: 'CIP047', projectName: '电机定子热装机', owner: '李工',
    overallStart: '2026-02-20', overallEnd: '2026-08-30', currentStage: 4,
    currentStageStart: '2026-07-25', currentStageEnd: '2026-08-15', status: 'in_progress',
    description: '电机定子铁芯热装机壳工艺，感应加热+机器人上料'
  },
  {
    id: 'p-cip008', projectCode: 'CIP008', projectName: '电机端盖压装机', owner: '赵工',
    overallStart: '2026-03-01', overallEnd: '2026-07-10', currentStage: 8, status: 'delivered',
    description: '电机前后端盖自动压装，压力位移双闭环监测'
  },
  {
    id: 'p-cip009', projectCode: 'CIP009', projectName: '电机转子动平衡机', owner: '邱工',
    overallStart: '2026-03-05', overallEnd: '2026-07-20', currentStage: 8, status: 'delivered',
    description: '电机转子动平衡自动校正，去重钻孔一体化'
  },
  {
    id: 'p-cip010', projectCode: 'CIP010', projectName: '减速器壳体清洗机', owner: '王工',
    overallStart: '2026-06-01', overallEnd: '2026-10-15', currentStage: 3,
    currentStageStart: '2026-08-20', currentStageEnd: '2026-09-15', status: 'in_progress',
    description: '减速器壳体超声波清洗+高压吹干，自动上下料'
  },
  {
    id: 'p-cip011', projectCode: 'CIP011', projectName: '减速器齿轮箱装配线', owner: '高工',
    overallStart: '2026-06-10', overallEnd: '2026-10-20', currentStage: 2,
    currentStageStart: '2026-08-15', currentStageEnd: '2026-09-12', status: 'in_progress',
    description: '减速器齿轮箱多工位自动装配线，含压装+检测'
  },
  {
    id: 'p-cip012', projectCode: 'CIP012', projectName: '关节模组自动装配线', owner: '耿工',
    overallStart: '2026-05-01', overallEnd: '2026-10-25', currentStage: 6,
    currentStageStart: '2026-08-25', currentStageEnd: '2026-09-20', status: 'in_progress',
    description: '机器人关节模组自动装配线，谐波减速器+电机一体压装'
  },
  {
    id: 'p-cip013', projectCode: 'CIP013', projectName: '关节模组老化测试台', owner: '李鹏超',
    overallStart: '2026-08-25', overallEnd: '2026-12-10', currentStage: 1,
    currentStageStart: '2026-08-25', currentStageEnd: '2026-09-18', status: 'in_progress',
    description: '关节模组出厂前老化测试台，多轴同步加载测试'
  },
  {
    id: 'p-cip017', projectCode: 'CIP017', projectName: '5系电机供料机', owner: '谢工',
    overallStart: '2026-06-15', overallEnd: '2026-10-30', currentStage: 5,
    currentStageStart: '2026-08-20', currentStageEnd: '2026-09-22', status: 'in_progress',
    description: '5系电机定子/转子自动供料机构，货叉+吸塑盒对接'
  },
  {
    id: 'p-cip018', projectCode: 'CIP018', projectName: '视觉定位检测机', owner: '刘工',
    overallStart: '2026-06-20', overallEnd: '2026-10-10', currentStage: 3,
    currentStageStart: '2026-08-18', currentStageEnd: '2026-09-14', status: 'in_progress',
    description: '关键工位视觉定位与外观缺陷检测一体机'
  },
  {
    id: 'p-cip019', projectCode: 'CIP019', projectName: '电机总装下线打标机', owner: '赵工',
    overallStart: '2026-09-10', overallEnd: '2026-12-30', currentStage: 1, status: 'not_started',
    description: '电机总装下线激光打标+条码追溯，尚未启动'
  },
  {
    id: 'p-cip041', projectCode: 'CIP041', projectName: '减速器压装专机', owner: '王工',
    overallStart: '2026-06-25', overallEnd: '2026-10-05', currentStage: 4,
    currentStageStart: '2026-08-22', currentStageEnd: '2026-09-08', status: 'in_progress',
    description: '减速器行星架压装专机，压力曲线自动判定合格'
  }
]

/** 把 [start, end] 均分为 n 段（段内不重叠），用于生成阶段计划日期 */
function splitRange(start: string, end: string, n: number): { start: string; end: string }[] {
  if (n <= 0) return []
  const s = dayjs(start)
  const e = dayjs(end)
  const totalDays = Math.max(e.diff(s, 'day'), n - 1)
  const result: { start: string; end: string }[] = []
  for (let i = 0; i < n; i++) {
    const segStart = s.add(Math.round((totalDays * i) / n), 'day')
    const segEndRaw = i === n - 1 ? e : s.add(Math.round((totalDays * (i + 1)) / n) - 1, 'day')
    const segEnd = segEndRaw.isBefore(segStart) ? segStart : segEndRaw
    result.push({ start: segStart.format('YYYY-MM-DD'), end: segEnd.format('YYYY-MM-DD') })
  }
  return result
}

function guessExt(docName: string): string {
  if (docName.includes('图纸')) return '.dwg'
  if (docName.includes('清单') || docName.includes('检查表')) return '.xlsx'
  if (docName.includes('订单')) return '.pdf'
  return '.docx'
}

function makeDoc(docName: string, uploader: string, date: string, seq: { n: number }): NpiDoc {
  seq.n++
  const ext = guessExt(docName)
  return {
    id: `doc-${seq.n}`,
    name: `${docName}${ext}`,
    size: 80 * 1024 + (seq.n % 9) * 63 * 1024,
    type: ext.replace('.', ''),
    uploadedAt: date,
    uploader
  }
}

function makeStage(
  tpl: StageTemplateItem,
  win: { start: string; end: string },
  status: StageStatus,
  progress: number,
  owner: string,
  seq: { n: number }
): NpiStage {
  const docs: NpiDoc[] = status === 'completed'
    ? tpl.requiredDocs.map((docName) => makeDoc(docName, owner, win.end, seq))
    : []
  const logs: NpiStageLog[] = status === 'completed'
    ? [{ time: `${win.end} 18:00`, action: 'advance', operator: owner, remark: `${tpl.name}阶段验收通过，推进下一阶段` }]
    : []
  return {
    idx: tpl.idx, name: tpl.name, owner, planStart: win.start, planEnd: win.end,
    progress, status, requiredDocs: tpl.requiredDocs, docs, logs
  }
}

function buildProjectStages(spec: ProjectSpec, seq: { n: number }): NpiStage[] {
  if (spec.status === 'delivered') {
    const windows = splitRange(spec.overallStart, spec.overallEnd, 8)
    return STAGE_TEMPLATE.map((tpl, i) => makeStage(tpl, windows[i], 'completed', 100, spec.owner, seq))
  }
  if (spec.status === 'not_started') {
    const windows = splitRange(spec.overallStart, spec.overallEnd, 8)
    return STAGE_TEMPLATE.map((tpl, i) => makeStage(tpl, windows[i], 'pending', 0, spec.owner, seq))
  }
  // in_progress
  const cur = spec.currentStage
  const curStart = spec.currentStageStart || spec.overallStart
  const curEnd = spec.currentStageEnd || spec.overallEnd
  const beforeWindows = cur > 1
    ? splitRange(spec.overallStart, dayjs(curStart).subtract(1, 'day').format('YYYY-MM-DD'), cur - 1)
    : []
  const afterWindows = cur < 8
    ? splitRange(dayjs(curEnd).add(1, 'day').format('YYYY-MM-DD'), spec.overallEnd, 8 - cur)
    : []
  return STAGE_TEMPLATE.map((tpl, i) => {
    const idx = i + 1
    if (idx < cur) return makeStage(tpl, beforeWindows[idx - 1], 'completed', 100, spec.owner, seq)
    if (idx === cur) return makeStage(tpl, { start: curStart, end: curEnd }, 'in_progress', 55, spec.owner, seq)
    return makeStage(tpl, afterWindows[idx - cur - 1], 'pending', 0, spec.owner, seq)
  })
}

function buildIssues(): NpiIssue[] {
  return [
    {
      id: 'iss-1', projectId: 'p-cip033', stageIdx: 4, seq: 1,
      problem: '集线器输出信号灯不亮', cause: '传感器被异物遮挡',
      tempMeasure: '现场清理异物、复位信号灯', longMeasure: '加装防护罩防止异物进入',
      issueType: '电气问题', owner: '外包人员',
      occurDate: '2026-05-18', planDoneDate: '2026-05-20', actualDoneDate: '2026-05-19', status: 'closed'
    },
    {
      id: 'iss-2', projectId: 'p-cip033', stageIdx: 5, seq: 2,
      problem: '5系电机供料机货叉与吸塑盒不匹配', cause: '气缸安装板装反',
      tempMeasure: '现场手动调整供料机构，临时对位', longMeasure: '更改装配工艺，修正气缸安装板方向标识',
      issueType: '装配问题', owner: '李鹏超',
      occurDate: '2026-05-18', planDoneDate: '2026-05-22', actualDoneDate: '2026-05-20', status: 'closed'
    },
    {
      id: 'iss-3', projectId: 'p-cip045', stageIdx: 5, seq: 1,
      problem: '热装工位温度传感器读数漂移', cause: '传感器校准超期',
      tempMeasure: '更换备用传感器', longMeasure: '',
      issueType: '品质异常', owner: '谢工',
      occurDate: '2026-08-25', planDoneDate: '2026-09-10', actualDoneDate: '', status: 'open'
    },
    {
      id: 'iss-4', projectId: 'p-cip010', stageIdx: 3, seq: 1,
      problem: '清洗机排水阀渗漏', cause: '密封圈老化',
      tempMeasure: '现场更换密封圈临时止漏', longMeasure: '',
      issueType: '结构设计', owner: '王工',
      occurDate: '2026-08-28', planDoneDate: '2026-09-12', actualDoneDate: '', status: 'open'
    },
    {
      id: 'iss-5', projectId: 'p-cip010', stageIdx: 3, seq: 2,
      problem: 'PLC 清洗流程时序错乱', cause: '软件逻辑未覆盖异常复位场景',
      tempMeasure: '人工干预复位', longMeasure: '',
      issueType: '软件调试', owner: '高工',
      occurDate: '2026-08-30', planDoneDate: '2026-09-15', actualDoneDate: '', status: 'open'
    }
  ]
}

function makeKbFile(name: string, uploader: string, date: string, folderId: string, seq: { n: number }): KbFile {
  seq.n++
  const ext = name.includes('.') ? name.slice(name.lastIndexOf('.')) : ''
  return {
    id: `kbfile-${seq.n}`,
    name,
    size: 120 * 1024 + (seq.n % 7) * 45 * 1024,
    type: ext.replace('.', '') || 'file',
    uploadedAt: date,
    uploader,
    folderId
  }
}

/** 阶段已上传资料自动归档到 项目资料/项目名/阶段名（只读文件夹） */
function archiveDocsToKb(folders: KbFolder[], files: KbFile[], project: NpiProject) {
  const projFolderId = `kb-proj-${project.id}`
  if (!folders.find((f) => f.id === projFolderId)) {
    folders.push({ id: projFolderId, parentId: 'kb-root-project', name: project.projectName, readonly: true, projectId: project.id })
  }
  project.stages.forEach((stage) => {
    if (stage.docs.length === 0) return
    const stageFolderId = `${projFolderId}-s${stage.idx}`
    if (!folders.find((f) => f.id === stageFolderId)) {
      folders.push({ id: stageFolderId, parentId: projFolderId, name: stage.name, readonly: true, projectId: project.id, stageIdx: stage.idx })
    }
    stage.docs.forEach((doc) => {
      files.push({ ...doc, id: `kbfile-arch-${stageFolderId}-${doc.id}`, folderId: stageFolderId, projectId: project.id, stageIdx: stage.idx })
    })
  })
}

/** 生成全新一份种子数据（项目 + 异常 + 知识库树），供 store 首次加载 / 重置演示数据使用 */
export function buildSeed(): { projects: NpiProject[]; issues: NpiIssue[]; folders: KbFolder[]; files: KbFile[] } {
  const seq = { n: 0 }

  const projects: NpiProject[] = PROJECT_SPECS.map((spec) => ({
    id: spec.id,
    projectCode: spec.projectCode,
    projectName: spec.projectName,
    owner: spec.owner,
    planStart: spec.overallStart,
    planEnd: spec.overallEnd,
    status: spec.status,
    currentStage: spec.currentStage,
    stages: buildProjectStages(spec, seq),
    description: spec.description
  }))

  const issues: NpiIssue[] = buildIssues()

  const folders: KbFolder[] = [
    { id: 'kb-root-project', parentId: null, name: '项目资料', readonly: true },
    { id: 'kb-root-public', parentId: null, name: '公共资料', readonly: false },
    { id: 'kb-public-spec', parentId: 'kb-root-public', name: '设计规范', readonly: false },
    { id: 'kb-public-supplier', parentId: 'kb-root-public', name: '供应商资料', readonly: false }
  ]
  const files: KbFile[] = [
    makeKbFile('非标设备通用技术要求.docx', '设备工程部', '2026-02-10', 'kb-public-spec', seq),
    makeKbFile('机械设计规范V3.pdf', '设备工程部', '2026-02-12', 'kb-public-spec', seq),
    makeKbFile('伺服电机供应商清单.xlsx', '采购部', '2026-01-20', 'kb-public-supplier', seq),
    makeKbFile('钣金加工供应商资质.pdf', '采购部', '2026-01-22', 'kb-public-supplier', seq)
  ]

  projects.forEach((p) => archiveDocsToKb(folders, files, p))

  return { projects, issues, folders, files }
}

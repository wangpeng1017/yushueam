/**
 * EM-06 非标设备研制（NPI）改版 — 类型 + 阶段模板 + 种子数据
 * 2026-09-04 设计文档：docs/plans/2026-09-04-npi-project-management-design.md
 * 纯前端 demo：不再导出 mock 接口，数据由 src/store/modules/npi.ts 持久化到 localStorage。
 */
import dayjs from 'dayjs'

// ==================== 类型定义（design §3） ====================

export type StageStatus = 'pending' | 'in_progress' | 'completed'
export type ProjectStatus = 'not_started' | 'in_progress' | 'delivered'
/** 异常类型是用户可自维护的字典，取值不再写死为联合类型；默认项见 DEFAULT_ISSUE_TYPES */
export type IssueType = string
/**
 * 异常闭环状态机（2026-09-09 设计：docs/plans/2026-09-09-npi-issue-workflow-design.md）
 * pending 待处理 → handled 已处理待确认 / optimized 已优化待确认 → closed 已结案
 */
export type IssueStatus = 'pending' | 'handled' | 'optimized' | 'closed'
export type IssueFlowAction = 'create' | 'handle' | 'optimize' | 'reject' | 'close'
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
  /** 阶段责任人：由所属阶段自动带出 */
  owner: string
  /** 处理人：下拉选择，可与阶段责任人不同 */
  handler: string
  occurDate: string
  planDoneDate: string
  actualDoneDate: string
  status: IssueStatus
  /** 流转记录：新建/处理/优化/打回/结案逐条追加，表格展开行以时间线展示 */
  flow: NpiIssueFlow[]
}

export interface NpiIssueFlow {
  time: string
  action: IssueFlowAction
  operator: string
  remark: string
}

/**
 * 状态 → 允许动作。这是「按钮矩阵」与「store 流转校验」的唯一数据源：
 * 操作列按钮由它渲染，store 也用它拦非法流转。新增状态时两边自动跟上，不会漏出口。
 */
export const ISSUE_ALLOWED_ACTIONS: Record<IssueStatus, IssueFlowAction[]> = {
  pending: ['handle', 'optimize'],
  handled: ['optimize', 'reject', 'close'],
  optimized: ['reject', 'close'],
  closed: []
}

export const ISSUE_STATUS_TEXT: Record<IssueStatus, string> = {
  pending: '待处理',
  handled: '已处理待确认',
  optimized: '已优化待确认',
  closed: '已结案'
}

export const ISSUE_ACTION_TEXT: Record<IssueFlowAction, string> = {
  create: '新建',
  handle: '处理',
  optimize: '优化',
  reject: '打回',
  close: '结案'
}

export interface KbFolder {
  id: string
  parentId: string | null
  name: string
  projectId?: string
  stageIdx?: number
}

export interface KbFile extends NpiDoc {
  folderId: string
  projectId?: string
  stageIdx?: number
}

// ==================== 异常类型默认字典（用户可在页面上增删改） ====================

export const DEFAULT_ISSUE_TYPES: string[] = ['结构设计', '电气问题', '装配问题', '软件调试', '品质异常', '其他']

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

function flow(action: IssueFlowAction, time: string, operator: string, remark: string): NpiIssueFlow {
  return { action, time, operator, remark }
}

/**
 * 演示异常数据：10 条铺满四个状态与两条路径（处理 / 优化），
 * 其中 iss-4、iss-7 给最长流转链（含打回、含 ②→③ 升级），用于演示闭环。
 */
function buildIssues(): NpiIssue[] {
  return [
    // ① 待处理：刚建，等处理人接手
    {
      id: 'iss-1', projectId: 'p-cip045', stageIdx: 5, seq: 1,
      problem: '热装工位温度传感器读数漂移', cause: '传感器校准超期',
      tempMeasure: '', longMeasure: '',
      issueType: '品质异常', owner: '谢工', handler: '王工',
      occurDate: '2026-09-07', planDoneDate: '2026-09-15', actualDoneDate: '', status: 'pending',
      flow: [flow('create', '2026-09-07 09:12', '谢工', '新建异常，指定处理人：王工')]
    },
    // ② 已处理待确认：建 → 处理
    {
      id: 'iss-2', projectId: 'p-cip045', stageIdx: 5, seq: 2,
      problem: '供料机构偶发卡料', cause: '料仓导向条间隙偏大',
      tempMeasure: '垫片调整导向条间隙至 0.3mm，人工巡检每 2 小时一次', longMeasure: '',
      issueType: '装配问题', owner: '谢工', handler: '李鹏超',
      occurDate: '2026-09-03', planDoneDate: '2026-09-12', actualDoneDate: '', status: 'handled',
      flow: [
        flow('create', '2026-09-03 10:20', '谢工', '新建异常，指定处理人：李鹏超'),
        flow('handle', '2026-09-04 15:40', '李鹏超', '临时措施：垫片调整导向条间隙至 0.3mm，人工巡检每 2 小时一次')
      ]
    },
    // ③ 已优化待确认：建 → 优化（临时+长期一次到位）
    {
      id: 'iss-3', projectId: 'p-cip045', stageIdx: 5, seq: 3,
      problem: '气缸安装板方向装反', cause: '装配图未标注方向基准',
      tempMeasure: '现场拆装调换气缸安装板方向', longMeasure: '装配图增加方向基准箭头，工艺卡同步更新并纳入首件检查项',
      issueType: '结构设计', owner: '谢工', handler: '王工',
      occurDate: '2026-08-28', planDoneDate: '2026-09-10', actualDoneDate: '', status: 'optimized',
      flow: [
        flow('create', '2026-08-28 08:50', '谢工', '新建异常，指定处理人：王工'),
        flow('optimize', '2026-08-29 17:05', '王工', '临时措施：现场拆装调换气缸安装板方向；长期措施：装配图增加方向基准箭头，工艺卡同步更新并纳入首件检查项')
      ]
    },
    // ④ 已结案：建 → 处理 → 打回 → 再处理 → 结案（最长链，演示打回）
    {
      id: 'iss-4', projectId: 'p-cip045', stageIdx: 4, seq: 4,
      problem: '伺服驱动器上电报 F-01 过流', cause: '动力线屏蔽层未接地，干扰导致误报',
      tempMeasure: '动力线屏蔽层单端接地至机柜接地排，复测无报警', longMeasure: '',
      issueType: '电气问题', owner: '李工', handler: '高工',
      occurDate: '2026-08-10', planDoneDate: '2026-08-20', actualDoneDate: '2026-08-18', status: 'closed',
      flow: [
        flow('create', '2026-08-10 09:00', '李工', '新建异常，指定处理人：高工'),
        flow('handle', '2026-08-12 14:30', '高工', '临时措施：更换驱动器后不再报警'),
        flow('reject', '2026-08-13 09:15', '李工', '打回理由：换件属于试错，没定位到根因，换新机后仍有复发风险，请重新排查'),
        flow('handle', '2026-08-17 16:20', '高工', '临时措施：动力线屏蔽层单端接地至机柜接地排，复测无报警'),
        flow('close', '2026-08-18 10:05', '李工', '结案：根因明确（屏蔽层未接地），现场复测通过')
      ]
    },
    // ① 待处理（被打回后退回，能看到打回理由）
    {
      id: 'iss-5', projectId: 'p-cip047', stageIdx: 4, seq: 1,
      problem: '定子热装后同轴度超差 0.05mm', cause: '待重新确认',
      tempMeasure: '增加热装后同轴度全检', longMeasure: '',
      issueType: '品质异常', owner: '李工', handler: '王工',
      occurDate: '2026-09-01', planDoneDate: '2026-09-16', actualDoneDate: '', status: 'pending',
      flow: [
        flow('create', '2026-09-01 11:10', '李工', '新建异常，指定处理人：王工'),
        flow('handle', '2026-09-03 15:00', '王工', '临时措施：增加热装后同轴度全检'),
        flow('reject', '2026-09-05 08:40', '李工', '打回理由：全检只是拦截不良，没解决热装工装定位问题，请给出定位方案')
      ]
    },
    // ② 已处理待确认
    {
      id: 'iss-6', projectId: 'p-cip047', stageIdx: 4, seq: 2,
      problem: '感应加热线圈温升过快', cause: '冷却水流量不足',
      tempMeasure: '将冷却水流量由 8L/min 调至 12L/min，加装流量报警', longMeasure: '',
      issueType: '电气问题', owner: '李工', handler: '高工',
      occurDate: '2026-09-02', planDoneDate: '2026-09-14', actualDoneDate: '', status: 'handled',
      flow: [
        flow('create', '2026-09-02 13:25', '李工', '新建异常，指定处理人：高工'),
        flow('handle', '2026-09-04 10:50', '高工', '临时措施：将冷却水流量由 8L/min 调至 12L/min，加装流量报警')
      ]
    },
    // ③ 已优化待确认：建 → 处理 → 升级优化（演示 ②→③ 这条边）
    {
      id: 'iss-7', projectId: 'p-cip047', stageIdx: 3, seq: 3,
      problem: '机器人上料抓手偶发打滑', cause: '真空吸盘吸力不足且无到位检测',
      tempMeasure: '更换加大吸盘，节拍放慢 0.5s', longMeasure: '抓手增加真空压力检测与到位传感器，PLC 增加抓取失败重试与报警逻辑',
      issueType: '软件调试', owner: '李工', handler: '李鹏超',
      occurDate: '2026-08-22', planDoneDate: '2026-09-11', actualDoneDate: '', status: 'optimized',
      flow: [
        flow('create', '2026-08-22 09:30', '李工', '新建异常，指定处理人：李鹏超'),
        flow('handle', '2026-08-25 14:10', '李鹏超', '临时措施：更换加大吸盘，节拍放慢 0.5s'),
        flow('optimize', '2026-08-30 16:45', '李鹏超', '升级为优化 —— 长期措施：抓手增加真空压力检测与到位传感器，PLC 增加抓取失败重试与报警逻辑')
      ]
    },
    // ④ 已结案：走优化路径结案
    {
      id: 'iss-8', projectId: 'p-cip047', stageIdx: 2, seq: 4,
      problem: '电气图纸与实物端子号不一致', cause: '出图后现场改线未回签图纸',
      tempMeasure: '现场按实物重新标注端子号', longMeasure: '建立改线回签流程：现场变更 24 小时内回签图纸，交付前由责任人核对',
      issueType: '结构设计', owner: '李工', handler: '王工',
      occurDate: '2026-07-15', planDoneDate: '2026-07-30', actualDoneDate: '2026-07-28', status: 'closed',
      flow: [
        flow('create', '2026-07-15 10:00', '李工', '新建异常，指定处理人：王工'),
        flow('optimize', '2026-07-22 15:30', '王工', '临时措施：现场按实物重新标注端子号；长期措施：建立改线回签流程，现场变更 24 小时内回签图纸，交付前由责任人核对'),
        flow('close', '2026-07-28 09:20', '李工', '结案：流程已纳入设计部作业指导书')
      ]
    },
    // 原有两条，补齐 flow
    {
      id: 'iss-9', projectId: 'p-cip033', stageIdx: 4, seq: 1,
      problem: '集线器输出信号灯不亮', cause: '传感器被异物遮挡',
      tempMeasure: '现场清理异物、复位信号灯', longMeasure: '加装防护罩防止异物进入',
      issueType: '电气问题', owner: '外包人员', handler: '李鹏超',
      occurDate: '2026-05-18', planDoneDate: '2026-05-20', actualDoneDate: '2026-05-19', status: 'closed',
      flow: [
        flow('create', '2026-05-18 08:30', '外包人员', '新建异常，指定处理人：李鹏超'),
        flow('optimize', '2026-05-19 11:00', '李鹏超', '临时措施：现场清理异物、复位信号灯；长期措施：加装防护罩防止异物进入'),
        flow('close', '2026-05-19 17:30', '外包人员', '结案：防护罩已加装并验证')
      ]
    },
    {
      id: 'iss-10', projectId: 'p-cip010', stageIdx: 3, seq: 1,
      problem: '清洗机排水阀渗漏', cause: '密封圈老化',
      tempMeasure: '', longMeasure: '',
      issueType: '结构设计', owner: '王工', handler: '谢工',
      occurDate: '2026-08-28', planDoneDate: '2026-09-12', actualDoneDate: '', status: 'pending',
      flow: [flow('create', '2026-08-28 14:00', '王工', '新建异常，指定处理人：谢工')]
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

/** 项目资料/项目名 文件夹永远存在（即便阶段尚无资料）；阶段已上传资料自动归档到其下的 阶段名 子夹 */
function archiveDocsToKb(folders: KbFolder[], files: KbFile[], project: NpiProject) {
  const projFolderId = `kb-proj-${project.id}`
  if (!folders.find((f) => f.id === projFolderId)) {
    folders.push({ id: projFolderId, parentId: 'kb-root-project', name: project.projectName, projectId: project.id })
  }
  project.stages.forEach((stage) => {
    if (stage.docs.length === 0) return
    const stageFolderId = `${projFolderId}-s${stage.idx}`
    if (!folders.find((f) => f.id === stageFolderId)) {
      folders.push({ id: stageFolderId, parentId: projFolderId, name: stage.name, projectId: project.id, stageIdx: stage.idx })
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
    { id: 'kb-root-project', parentId: null, name: '项目资料' },
    { id: 'kb-root-public', parentId: null, name: '公共资料' },
    { id: 'kb-public-spec', parentId: 'kb-root-public', name: '设计规范' },
    { id: 'kb-public-supplier', parentId: 'kb-root-public', name: '供应商资料' }
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

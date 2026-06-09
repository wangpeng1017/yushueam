/**
 * 项目主数据（金蝶 ERP 单向推送，前端只读引用）
 * —— 采购单「项目」字段的可搜索下拉数据源。
 * 字段：项目编码 / 项目名称 / 数据状态 / 禁用状态 / 创建日期 / 创建人 / 修改日期 / 修改人
 */
export interface ProjectMaster {
  projectNo: string
  projectName: string
  dataStatus: string
  disabled: boolean
  createDate: string
  creator: string
  modifyDate: string
  modifier: string
}

export const PROJECT_MASTER: ProjectMaster[] = [
  { projectNo: 'RB11', projectName: 'GO2 机器狗-标准版（C端）', dataStatus: '已审核', disabled: false, createDate: '2025-11-02', creator: '乃永刚', modifyDate: '2026-03-15', modifier: '乃永刚' },
  { projectNo: 'RB12', projectName: 'GO2-EDU 教育版', dataStatus: '已审核', disabled: false, createDate: '2025-12-08', creator: '乃永刚', modifyDate: '2026-02-20', modifier: '王组长' },
  { projectNo: 'RB21', projectName: 'B2 工业四足', dataStatus: '已审核', disabled: false, createDate: '2025-09-15', creator: '李伟', modifyDate: '2026-01-18', modifier: '李伟' },
  { projectNo: 'HM01', projectName: 'G1 人形机器人-量产', dataStatus: '已审核', disabled: false, createDate: '2026-01-05', creator: '严欢欢', modifyDate: '2026-04-12', modifier: '严欢欢' },
  { projectNo: 'HM02', projectName: 'H1 人形机器人-旗舰', dataStatus: '已审核', disabled: false, createDate: '2026-02-10', creator: '严欢欢', modifyDate: '2026-04-28', modifier: '彭向' },
  { projectNo: 'RB05', projectName: 'Go1 机器狗-停产', dataStatus: '已审核', disabled: true, createDate: '2024-06-01', creator: '乃永刚', modifyDate: '2025-10-30', modifier: '乃永刚' }
]

/** 下拉选项（排除已禁用项目），label = 编码 + 名称，name 用于回填项目名称 */
export const PROJECT_OPTIONS = PROJECT_MASTER.filter((p) => !p.disabled).map((p) => ({
  value: p.projectNo,
  label: `${p.projectNo}　${p.projectName}`,
  name: p.projectName
}))

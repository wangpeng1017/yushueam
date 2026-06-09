/**
 * 采购管理 - 配置驱动统一模块的类型定义
 *
 * 四类采购（设备采购 / 自制设备备件采购 / 工器具采购 / 备件采购）共用
 * PurchaseListPage.vue，差异全部收敛到一份 PurchaseConfig。
 */

/** 列表搜索项 */
export interface SearchFieldDef {
  prop: string
  label: string
  placeholder?: string
  /** 控件类型，默认 input */
  type?: 'input' | 'select'
  /** type=select 时的选项 */
  options?: Array<{ label: string; value: any }>
  /** 控件宽度 class，默认 !w-200px */
  widthClass?: string
}

/** 列表业务列（状态 / ERP单号 / 操作三列由组件自动追加，无需在此声明） */
export interface ColumnDef {
  prop: string
  label: string
  width?: number
  minWidth?: number
  align?: string
  /** 返回 el-tag type（如 'success'/'warning'），声明后该列以 el-tag 渲染 */
  tag?: (row: any) => string
  /** 自定义文本格式化 */
  formatter?: (row: any) => string
  /** 金额列：¥ + 千分位 */
  money?: boolean
}

/** 头部表单字段 */
export interface FormFieldDef {
  prop: string
  label: string
  /** projectSelect = 从项目主数据搜索选择，选中回填 fillNameProp */
  type?: 'input' | 'textarea' | 'number' | 'date' | 'select' | 'radio' | 'projectSelect'
  required?: boolean
  placeholder?: string
  /** select/radio 选项；projectSelect 选项额外带 name 用于回填 */
  options?: Array<{ label: string; value: any; name?: string }>
  /** projectSelect 选中后，把选项 name 回填到此字段（如 projectName） */
  fillNameProp?: string
  /** el-col span，默认 8 */
  span?: number
  /** 编辑态禁用（如单据号） */
  disabledOnEdit?: boolean
  /** number 控件 */
  min?: number
  step?: number
  /** 新建默认值 */
  default?: any
}

/** 明细子表的列 */
export interface DetailColumnDef {
  prop: string
  label: string
  width?: number
  minWidth?: number
  /** 编辑态控件，默认 input */
  type?: 'input' | 'number'
  placeholder?: string
}

/** 明细子表 Tab（设备采购 = 1 个扁平表；自制备件采购 = 钣金/机加/外购 3 个；工器具/备件采购 = 无） */
export interface DetailTabDef {
  /** tab 唯一标识 */
  name: string
  /** tab 标题 */
  label: string
  /** formData 上存放明细数组的字段名 */
  itemsField: string
  /** tab 顶部提示文案 */
  alert?: string
  columns: DetailColumnDef[]
  /** 添加行时的默认对象 */
  newRow: () => Record<string, any>
}

/** 数据源：走 mock-bridge 接口 或 内嵌数组 */
export type DataSource =
  | {
      type: 'api'
      listPath: string
      detailPath?: string
      createPath?: string
      updatePath?: string
      deletePath?: string
    }
  | { type: 'inline'; rows: any[] }

/** 一类采购的完整配置 */
export interface PurchaseConfig {
  /** 唯一键，如 'equipment' */
  key: string
  /** 业务名，如 '设备采购'，用于弹窗标题 */
  title: string
  /** 列表顶部说明 alert 文案 */
  alert?: string
  /** 单据号字段：projectCode / code / demandCode */
  codeField: string
  /** 新建单据号前缀，如 'CIP-2026' / 'DIY-PR-2026' */
  codePrefix: string
  /** 单据主体名称字段，用于确认弹窗显示，如 projectName / itemName */
  nameField?: string
  /** 状态字段，默认 status；工器具采购为 approvalStatus（feishu-status 会做 legacy 归一） */
  statusField?: string
  /** 弹窗宽度，默认按是否有明细自适应 */
  formWidth?: string
  searchFields: SearchFieldDef[]
  columns: ColumnDef[]
  formFields: FormFieldDef[]
  detailTabs?: DetailTabDef[]
  dataSource: DataSource
  /** 行数据加载后的适配钩子（列表/详情/编辑统一生效），如把历史字段归并到新结构 */
  mapRow?: (row: any) => any
}

/**
 *  Copyright (c) 2025-2026, chenjianfeng
 * Author [system]
 * Since 2026-02-24
 */
import request from '@/config/axios'

// ==================== 策略相关接口 ====================

// 枚举实体
export interface EnumEntity {
  value: string
  desc: string
  text: string
}

export interface StrategyDto {
  id: number
  tenantId: number
  strategyCode: string
  strategyName: string
  strategyType: string
  strategyTypeName: string
  bizScene: string
  status: string
  statusName: string
  currentVersionId: number
  currentVersionNo: number
  remark: string
  createTime: Date
  creator: string
  updateTime: Date
  updater: string
  deleted: boolean
}

export interface StrategySaveDto {
  strategyCode: string
  strategyName: string
  strategyType: string
  bizScene: string
  status: string
  remark: string
}

export interface StrategyUpdateDto {
  id: number
  strategyCode: string
  strategyName: string
  strategyType: string
  bizScene: string
  status: string
  remark: string
}

// ==================== 版本相关接口 ====================

export interface StrategyVersionDto {
  id: number
  tenantId: number
  strategyId: number
  strategyCode: string
  strategyName: string
  versionNo: number
  versionName: string
  versionStatus: string
  versionStatusName: string
  publishFlag: boolean
  publishedAt: Date
  publishedBy: string
  rollbackFromVersionId: number
  remark: string
  ruleCount: number
  rules: StrategyRuleDto[]
  createTime: Date
  creator: string
  updateTime: Date
  updater: string
  deleted: boolean
}

export interface StrategyVersionSaveDto {
  strategyId: number
  versionName: string
  remark: string
}

export interface StrategyVersionUpdateDto {
  id: number
  versionName: string
  remark?: string
}

// ==================== 规则相关接口 ====================

export interface StrategyRuleDto {
  id: number
  tenantId: number
  strategyId: number
  versionId: number
  ruleCode: string
  ruleName: string
  priority: number
  enabled: boolean
  stopOnHit: boolean
  conditionJson: string
  actionJson: string
  remark: string
  createTime: Date
  creator: string
  updateTime: Date
  updater: string
  deleted: boolean
}

export interface StrategyRuleSaveDto {
  strategyId: number
  versionId: number
  ruleCode: string
  ruleName: string
  priority: number
  enabled: boolean
  stopOnHit: boolean
  conditionJson: string
  actionJson: string
  remark: string
}

// ==================== 作用域相关接口 ====================

export interface StrategyScopeDto {
  id: number
  tenantId: number
  strategyId: number
  versionId: number
  scopeType: string
  scopeTypeName: string
  scopeKey: string
  scopeOperator: string
  scopeValue: string
  enabled: boolean
  remark: string
  createTime: Date
  creator: string
  updateTime: Date
  updater: string
  deleted: boolean
}

export interface StrategyScopeSaveDto {
  strategyId: number
  versionId: number
  scopeType: string
  scopeKey: string
  scopeOperator: string
  scopeValue: string
  enabled: boolean
  remark?: string
}

// ==================== Scope匹配轨迹接口 ====================

export interface ScopeTraceVo {
  scopeId: number
  scopeType: string
  scopeKey: string
  scopeOperator: string
  expectedValue: string
  actualValue: string
  matched: boolean
  message: string
}

// ==================== 执行结果增强接口 ====================

export interface StrategyExecuteResultVo {
  success: boolean
  strategyId: number
  strategyCode: string
  versionId: number
  ruleId: number
  ruleName: string
  actionResult: any
  hitRuleTrace: HitRuleTraceVo[]
  scopeMatched: boolean | null
  scopeTraces: ScopeTraceVo[]
  errorMessage: string
  costMs: number
}

export interface HitRuleTraceVo {
  ruleId: number
  ruleCode: string
  ruleName: string
  priority: number
  matched: boolean
  conditionDetail: Record<string, any>
}

// ==================== 字段元数据接口 ====================

export interface EnumValueDto {
  value: string
  label: string
}

export interface FieldMetaDto {
  fieldKey: string
  fieldName: string
  dataType: string
  operators: string[]
  domain: string
  enumValues?: EnumValueDto[]
}

// ==================== 版本编辑器详情接口 ====================

export interface VersionStatsDto {
  ruleCount: number
  enabledRuleCount: number
  scopeCount: number
}

export interface VersionEditorDetailDto {
  version: StrategyVersionDto
  rules: StrategyRuleDto[]
  scopes: StrategyScopeDto[]
  stats: VersionStatsDto
}

// ==================== 版本校验结果接口 ====================

export interface ValidationErrorDto {
  code: string
  message: string
  ruleId?: number
  ruleName?: string
}

export interface VersionValidationResultDto {
  valid: boolean
  errors: ValidationErrorDto[]
  stats: VersionStatsDto
}

// ==================== 执行日志详情接口 ====================

export interface StrategyExecLogDto {
  id: number
  tenantId: number
  strategyType: string
  strategyTypeName: string
  strategyId: number
  strategyCode: string
  strategyName: string
  versionId: number
  versionNo: number
  execMode: string
  execModeName: string
  bizType: string
  bizNo: string
  bizId: string
  requestContextJson: string
  hitRuleTraceJson: string
  resultJson: string
  successFlag: boolean
  errorMsg: string
  costMs: number
  traceId: string
  requestId: string
  createTime: Date
  creator: string
}

// ==================== 执行相关接口 ====================

export interface StrategyExecuteDto {
  strategyType: string
  strategyId?: number
  versionId?: number
  execMode: string
  businessData: Record<string, any>
  bizType?: string
  bizNo?: string
  bizId?: string
}

export interface PutawayRecommendDto {
  warehouseId: number
  materialCode: string
  materialId?: number
  materialCategory?: string
  qty: number
  batchNo?: string
  supplierId?: number
  execMode?: string
  topN?: number
  asnNo?: string
  asnItemId?: number
}

export interface LocationCandidate {
  locationId: number
  locationCode: string
  locationName: string
  areaId: number
  areaCode: string
  score: number
  reasonCode: string
  reasonDesc: string
  distance: number
  capacityFit: number
}

export interface PutawayRecommendVo {
  success: boolean
  strategyId: number
  strategyCode: string
  versionId: number
  ruleId: number
  ruleName: string
  locations: LocationCandidate[]
  errorMessage: string
  costMs: number
}

// ==================== 策略API ====================

const strategyPrefix = '/mdm/strategy'

export const getStrategyById = (id: number) =>
  request.get({
    url: strategyPrefix + '/id/' + id
  })

export const getStrategyPage = (query: any) =>
  request.post({
    url: strategyPrefix + '/page',
    data: query
  })

export const listOfStrategy = (query: any) =>
  request.post({
    url: strategyPrefix + '/list',
    data: query
  })

export const deleteStrategyById = (id: number) =>
  request.post({
    url: strategyPrefix + '/delete/' + id
  })

export const deleteStrategyByIds = (ids: number[]) =>
  request.post({
    url: strategyPrefix + '/deleteByIds',
    data: ids
  })

export const createStrategy = (data: StrategySaveDto) =>
  request.post({
    url: strategyPrefix + '/create',
    data: data
  })

export const updateStrategy = (data: StrategyUpdateDto) =>
  request.post({
    url: strategyPrefix + '/update',
    data: data
  })

export const enableStrategy = (id: number) =>
  request.post({
    url: strategyPrefix + '/enable/' + id
  })

export const disableStrategy = (id: number) =>
  request.post({
    url: strategyPrefix + '/disable/' + id
  })

// ==================== 版本API ====================

const versionPrefix = '/mdm/strategy/version'

export const getVersionById = (id: number) =>
  request.get({
    url: versionPrefix + '/id/' + id
  })

export const getVersionPage = (query: any) =>
  request.post({
    url: versionPrefix + '/page',
    data: query
  })

export const createVersion = (data: StrategyVersionSaveDto) =>
  request.post({
    url: versionPrefix + '/create',
    data: data
  })

export const updateVersion = (data: StrategyVersionUpdateDto) =>
  request.post({
    url: versionPrefix + '/update',
    data: data
  })

export const deleteVersionById = (id: number) =>
  request.post({
    url: versionPrefix + '/delete/' + id
  })

export const publishVersion = (data: { strategyId: number; versionId: number; remark?: string }) =>
  request.post({
    url: versionPrefix + '/publish',
    data: data
  })

export const rollbackVersion = (data: {
  strategyId: number
  targetVersionId: number
  remark?: string
}) =>
  request.post({
    url: versionPrefix + '/rollback',
    data: data
  })

// ==================== 规则API ====================

const rulePrefix = '/mdm/strategy/rule'

export const getRulePage = (query: any) =>
  request.post({
    url: rulePrefix + '/page',
    data: query
  })

export const getRulesByVersionId = (versionId: number) =>
  request.get({
    url: rulePrefix + '/list/' + versionId
  })

export const createRule = (data: StrategyRuleSaveDto) =>
  request.post({
    url: rulePrefix + '/create',
    data: data
  })

export const updateRule = (data: any) =>
  request.post({
    url: rulePrefix + '/update',
    data: data
  })

export const deleteRuleById = (id: number) =>
  request.post({
    url: rulePrefix + '/delete/' + id
  })

export const batchSaveRules = (versionId: number, rules: StrategyRuleSaveDto[]) =>
  request.post({
    url: rulePrefix + '/batchSave/' + versionId,
    data: rules
  })

// ==================== 执行API ====================

const executePrefix = '/mdm/strategy/execute'

export const executeStrategy = (data: StrategyExecuteDto) =>
  request.post({
    url: executePrefix + '/run',
    data: data
  })

export const recommendPutaway = (data: PutawayRecommendDto) =>
  request.post({
    url: executePrefix + '/putaway/recommend',
    data: data
  })

export const getPublishLogPage = (query: any) =>
  request.post({
    url: executePrefix + '/publishLog/page',
    data: query
  })

export const getExecLogPage = (query: any) =>
  request.post({
    url: executePrefix + '/execLog/page',
    data: query
  })

export const getExecLogDetail = (id: number) =>
  request.get({
    url: executePrefix + '/execLog/' + id
  })

// ==================== 作用域API ====================

const scopePrefix = '/mdm/strategy/scope'

export const getScopesByVersionId = (versionId: number) =>
  request.get({
    url: scopePrefix + '/list/' + versionId
  })

export const createScope = (data: StrategyScopeSaveDto) =>
  request.post({
    url: scopePrefix + '/create',
    data: data
  })

export const updateScope = (data: any) =>
  request.post({
    url: scopePrefix + '/update',
    data: data
  })

export const deleteScopeById = (id: number) =>
  request.post({
    url: scopePrefix + '/delete/' + id
  })

export const batchSaveScopes = (versionId: number, scopes: StrategyScopeSaveDto[]) =>
  request.post({
    url: scopePrefix + '/batchSave/' + versionId,
    data: scopes
  })

// ==================== 版本编辑器API ====================

export const getVersionEditorDetail = (versionId: number) =>
  request.get({
    url: versionPrefix + '/' + versionId + '/editor-detail'
  })

export const validateVersion = (versionId: number) =>
  request.post({
    url: versionPrefix + '/' + versionId + '/validate'
  })

// ==================== 字段元数据API ====================

const fieldMetaPrefix = '/mdm/strategy/field-meta'

export const getFieldMeta = (strategyType: string) =>
  request.get({
    url: fieldMetaPrefix,
    params: { strategyType }
  })

// ==================== 枚举API ====================

export const getStrategyTypeList = (): Promise<EnumEntity[]> =>
  request.get({
    url: strategyPrefix + '/enum/strategyType'
  })

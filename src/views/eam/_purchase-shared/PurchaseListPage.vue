<template>
  <div class="purchase-list-page">
    <!-- ============ 搜索区 ============ -->
    <ContentWrap>
      <el-alert v-if="cfg.alert" type="info" :closable="false" show-icon class="mb-15px" :title="cfg.alert" />
      <el-form :inline="true" :model="queryParams" class="-mb-15px" label-width="90px">
        <el-form-item v-for="f in cfg.searchFields" :key="f.prop" :label="f.label">
          <el-select
            v-if="f.type === 'select'"
            v-model="queryParams[f.prop]" :placeholder="f.placeholder || '全部'" clearable
            :class="f.widthClass || '!w-200px'">
            <el-option v-for="o in f.options" :key="o.value" :label="o.label" :value="o.value" />
          </el-select>
          <el-input
            v-else
            v-model="queryParams[f.prop]" :class="f.widthClass || '!w-200px'" clearable
            :placeholder="f.placeholder || `请输入${f.label}`" @keyup.enter="doSearch" />
        </el-form-item>
        <el-form-item>
          <el-button @click="doSearch"><Icon icon="ep:search" class="mr-5px" />搜索</el-button>
          <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" />重置</el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <!-- ============ 主表 ============ -->
    <ContentWrap>
      <div class="mb-10px">
        <el-button plain type="primary" @click="openForm('create')"><Icon icon="ep:plus" class="mr-5px" />新增{{ cfg.title }}</el-button>
        <el-button type="primary" plain @click="refreshAllStatus"><Icon icon="ep:refresh" class="mr-5px" />同步飞书/ERP 状态</el-button>
        <span class="ml-10px hint">⚡ 单据推送飞书后，由飞书完成审批 + ERP 对接，本页仅展示状态</span>
      </div>

      <el-table v-loading="loading" :data="tableData" stripe highlight-current-row @row-dblclick="openDetail">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column
          v-for="col in cfg.columns" :key="col.prop"
          :label="col.label" :prop="col.prop" :align="col.align || 'center'"
          :width="col.width" :min-width="col.minWidth" show-overflow-tooltip>
          <template v-if="col.tag || col.formatter || col.money" #default="{ row }">
            <el-tag v-if="col.tag" size="small" :type="(col.tag(row) as any)">{{ cellText(col, row) }}</el-tag>
            <span v-else>{{ cellText(col, row) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120" align="center">
          <template #default="{ row }"><el-tag :type="(getStatusColor(row.status) as any)">{{ getStatusName(row.status) }}</el-tag></template>
        </el-table-column>
        <el-table-column label="ERP 到货单号" prop="erpPurchaseOrderNo" width="140" align="center">
          <template #default="{ row }">{{ row.erpPurchaseOrderNo || '—' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="340" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDetail(row)"><Icon icon="ep:view" />详情</el-button>
            <el-button v-if="canEdit(row)" link type="primary" @click="openForm('edit', row)"><Icon icon="ep:edit" />编辑</el-button>
            <el-button v-if="canPushToFeishu(row)" link type="success" @click="handlePushFeishu(row)"><Icon icon="ep:promotion" />推送飞书</el-button>
            <el-button v-if="hasFeishuTicket(row)" link type="primary" @click="openFeishu(row)"><Icon icon="ep:link" />飞书单据</el-button>
            <el-button v-if="hasFeishuTicket(row)" link type="warning" @click="refreshOne(row)">刷新状态</el-button>
            <el-button v-if="canResubmit(row)" link type="primary" @click="handleResubmit(row)">重新申请</el-button>
            <el-button v-if="canRetryPush(row)" link type="warning" @click="handleRetryPush(row)">重试推送</el-button>
            <el-button v-if="canDelete(row)" link type="danger" @click="handleDelete(row)"><Icon icon="ep:delete" />删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <Pagination
        v-if="cfg.dataSource.type === 'api'"
        v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
        :total="total" @pagination="loadList" />
    </ContentWrap>

    <!-- ============ 新建/编辑对话框 ============ -->
    <Dialog v-model="formVisible" :title="formTitle" :width="dialogWidth" top="6vh" :close-on-click-modal="false">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110px">
        <el-row :gutter="16">
          <el-col v-for="field in cfg.formFields" :key="field.prop" :span="field.span || 8">
            <el-form-item :label="field.label" :prop="field.prop">
              <el-select
                v-if="field.type === 'select'"
                v-model="formData[field.prop]" class="!w-full" :placeholder="field.placeholder">
                <el-option v-for="o in field.options" :key="o.value" :label="o.label" :value="o.value" />
              </el-select>
              <el-select
                v-else-if="field.type === 'projectSelect'"
                v-model="formData[field.prop]" filterable clearable class="!w-full"
                :placeholder="field.placeholder || '搜索选择项目'" @change="onLinkSelect(field, $event)">
                <el-option v-for="o in field.options" :key="o.value" :label="o.label" :value="o.value" />
              </el-select>
              <el-radio-group v-else-if="field.type === 'radio'" v-model="formData[field.prop]">
                <el-radio-button v-for="o in field.options" :key="o.value" :label="o.value">{{ o.label }}</el-radio-button>
              </el-radio-group>
              <el-date-picker
                v-else-if="field.type === 'date'"
                v-model="formData[field.prop]" type="date" value-format="YYYY-MM-DD" class="!w-full" />
              <el-input-number
                v-else-if="field.type === 'number'"
                v-model="formData[field.prop]" :min="field.min ?? 0" :step="field.step" class="!w-full" />
              <el-input
                v-else
                v-model="formData[field.prop]"
                :type="field.type === 'textarea' ? 'textarea' : 'text'" :rows="2"
                :disabled="field.disabledOnEdit && formMode === 'edit'" :placeholder="field.placeholder" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 明细子表（0 / 1 / N 个 Tab） -->
      <el-tabs v-if="cfg.detailTabs && cfg.detailTabs.length" v-model="activeTab" type="border-card" class="mt-10px">
        <el-tab-pane v-for="tab in cfg.detailTabs" :key="tab.name" :label="tab.label" :name="tab.name">
          <el-alert v-if="tab.alert" type="warning" :closable="false" show-icon class="mb-8px" :title="tab.alert" />
          <div class="mb-8px">
            <el-button size="small" plain type="primary" @click="addRow(tab)"><Icon icon="ep:plus" />新增行</el-button>
          </div>
          <el-table :data="formData[tab.itemsField]" border size="small">
            <el-table-column type="index" label="序号" width="55" align="center" />
            <el-table-column v-for="dc in tab.columns" :key="dc.prop" :label="dc.label" :width="dc.width" :min-width="dc.minWidth">
              <template #default="{ row }">
                <el-input-number v-if="dc.type === 'number'" v-model="row[dc.prop]" :min="0" size="small" :controls="false" class="!w-full" />
                <el-input v-else v-model="row[dc.prop]" size="small" :placeholder="dc.placeholder" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="60" align="center">
              <template #default="{ $index }">
                <el-button link type="danger" size="small" @click="removeRow(tab, $index)"><Icon icon="ep:delete" /></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" :loading="formSaving" @click="handleSave">保存</el-button>
      </template>
    </Dialog>

    <!-- ============ 详情对话框 ============ -->
    <Dialog v-model="detailVisible" :title="`${cfg.title}详情 - ${detailData?.[cfg.codeField] || ''}`" :width="dialogWidth" top="6vh">
      <template v-if="detailData">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="单据号">{{ detailData[cfg.codeField] }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="(getStatusColor(detailData.status) as any)">{{ getStatusName(detailData.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item v-for="field in cfg.formFields" :key="field.prop" :label="field.label" :span="field.span && field.span >= 24 ? 2 : 1">
            {{ displayValue(field, detailData) }}
          </el-descriptions-item>
          <el-descriptions-item label="ERP 到货单号" :span="2">{{ detailData.erpPurchaseOrderNo || '—' }}</el-descriptions-item>
        </el-descriptions>

        <el-tabs v-if="(cfg.detailTabs && cfg.detailTabs.length) || true" v-model="detailActiveTab" type="border-card" class="mt-15px">
          <el-tab-pane
            v-for="tab in cfg.detailTabs || []" :key="tab.name"
            :label="`${tab.label} (${detailData[tab.itemsField]?.length || 0})`" :name="tab.name">
            <el-table :data="detailData[tab.itemsField] || []" size="small" border>
              <el-table-column type="index" label="序号" width="55" align="center" />
              <el-table-column v-for="dc in tab.columns" :key="dc.prop" :label="dc.label" :prop="dc.prop" :width="dc.width" :min-width="dc.minWidth" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="飞书审批" name="__feishu">
            <el-alert type="info" :closable="false" show-icon class="mb-15px"
              title="EAM 仅做提单 + 状态展示。审批进度、审批人意见、ERP 对接全部由飞书完成。" />
            <div v-if="hasFeishuTicket(detailData)" class="text-center mt-20px">
              <el-button type="primary" size="large" @click="openFeishu(detailData)"><Icon icon="ep:link" />前往飞书查看完整审批进度</el-button>
              <div class="text-12px text-gray-500 mt-10px">飞书单据号：{{ detailData.feishuTicketCode || detailData[cfg.codeField] }}</div>
            </div>
            <el-empty v-else description="尚未推送飞书" />
          </el-tab-pane>
        </el-tabs>
      </template>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/config/axios'
import type { PurchaseConfig, ColumnDef, FormFieldDef, DetailTabDef } from './types'
import {
  getStatusName, getStatusColor, normalizeStatus,
  canEdit, canPushToFeishu, canDelete, canRetryPush, canResubmit, hasFeishuTicket,
  simulateNextStatus, buildFeishuUrl
} from './feishu-status'

const props = defineProps<{ config: PurchaseConfig }>()
const cfg = props.config
const statusField = cfg.statusField || 'status'

const loading = ref(false)
const total = ref(0)
const rawRows = ref<any[]>([])   // inline 数据源
const list = ref<any[]>([])      // api 数据源

const queryParams = reactive<any>({ pageNo: 1, pageSize: 10 })
cfg.searchFields.forEach(f => (queryParams[f.prop] = ''))

/** 状态字段归一 + 行适配钩子，让 feishu-status 助手 + 状态列 + 明细结构通吃四类采购 */
function normRows(rows: any[]): any[] {
  return rows.map(r => {
    let row = statusField === 'status' ? { ...r } : { ...r, status: r[statusField] ?? r.status }
    if (cfg.mapRow) row = cfg.mapRow(row)
    return row
  })
}

async function loadList() {
  if (cfg.dataSource.type === 'inline') {
    rawRows.value = normRows(JSON.parse(JSON.stringify(cfg.dataSource.rows)))
    return
  }
  loading.value = true
  try {
    const res: any = await request.get({ url: cfg.dataSource.listPath, params: queryParams })
    list.value = normRows(res?.list || res?.records || [])
    total.value = res?.total || 0
  } catch (e) {
    console.error('采购列表加载失败:', e)
    list.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

const tableData = computed(() => {
  if (cfg.dataSource.type !== 'inline') return list.value
  return rawRows.value.filter(row =>
    cfg.searchFields.every(f => {
      const v = queryParams[f.prop]
      if (!v) return true
      if (f.type === 'select') return row[f.prop] === v
      return String(row[f.prop] ?? '').includes(String(v))
    })
  )
})

function doSearch() {
  if (cfg.dataSource.type === 'api') { queryParams.pageNo = 1; loadList() }
  // inline：tableData 为 computed，自动过滤
}
function resetQuery() {
  cfg.searchFields.forEach(f => (queryParams[f.prop] = ''))
  queryParams.pageNo = 1
  if (cfg.dataSource.type === 'api') loadList()
}

/** 列文本（formatter / money / 原值） */
function cellText(col: ColumnDef, row: any): string {
  if (col.formatter) return col.formatter(row)
  if (col.money) return `¥ ${Number(row[col.prop] || 0).toLocaleString()}`
  return row[col.prop]
}

/** projectSelect 选中后回填项目名称 */
function onLinkSelect(field: FormFieldDef, val: any) {
  if (!field.fillNameProp) return
  const opt = (field.options || []).find(o => o.value === val)
  formData[field.fillNameProp] = opt?.name || ''
}

/** 详情描述项取值（projectSelect 显示「编码 名称」，select/radio 映射 label，date 原样） */
function displayValue(field: FormFieldDef, row: any): string {
  if (field.type === 'projectSelect') {
    const code = row[field.prop]
    const name = field.fillNameProp ? row[field.fillNameProp] : ''
    return [code, name].filter(Boolean).join(' ') || '—'
  }
  const v = row[field.prop]
  if (v === undefined || v === null || v === '') return '—'
  if ((field.type === 'select' || field.type === 'radio') && field.options) {
    return field.options.find(o => o.value === v)?.label || String(v)
  }
  if (field.type === 'number' && /amount|金额|price/i.test(field.prop)) return `¥ ${Number(v).toLocaleString()}`
  return String(v)
}

// ============ 新建 / 编辑 ============
const formVisible = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const formTitle = ref('')
const formSaving = ref(false)
const formRef = ref()
const activeTab = ref(cfg.detailTabs?.[0]?.name || '')
const formData = reactive<any>({})

const dialogWidth = computed(() => cfg.formWidth || (cfg.detailTabs?.length ? '1100px' : '700px'))

const formRules = computed(() => {
  const rules: Record<string, any> = {}
  cfg.formFields.forEach(f => {
    if (f.required) {
      const trigger = f.type === 'select' || f.type === 'date' || f.type === 'radio' ? 'change' : 'blur'
      rules[f.prop] = [{ required: true, message: `请${f.type === 'input' || !f.type ? '输入' : '选择'}${f.label}`, trigger }]
    }
  })
  return rules
})

function blankForm(): Record<string, any> {
  const d: Record<string, any> = {}
  cfg.formFields.forEach(f => {
    d[f.prop] = f.default !== undefined ? f.default : f.type === 'number' ? 0 : ''
  })
  ;(cfg.detailTabs || []).forEach(t => (d[t.itemsField] = []))
  return d
}

async function openForm(mode: 'create' | 'edit', row?: any) {
  formMode.value = mode
  formTitle.value = mode === 'create' ? `新增${cfg.title}` : `编辑：${row?.[cfg.codeField]}`
  Object.keys(formData).forEach(k => delete formData[k])
  if (mode === 'create') {
    Object.assign(formData, blankForm())
  } else if (cfg.dataSource.type === 'api' && cfg.dataSource.detailPath) {
    const res: any = await request.get({ url: cfg.dataSource.detailPath, params: { id: row.id } })
    Object.assign(formData, blankForm(), JSON.parse(JSON.stringify(normRows([res || {}])[0])))
  } else {
    Object.assign(formData, blankForm(), JSON.parse(JSON.stringify(row || {})))
  }
  activeTab.value = cfg.detailTabs?.[0]?.name || ''
  formVisible.value = true
}

function addRow(tab: DetailTabDef) {
  formData[tab.itemsField].push(tab.newRow())
}
function removeRow(tab: DetailTabDef, idx: number) {
  formData[tab.itemsField].splice(idx, 1)
}

function genCode(): string {
  const n = (cfg.dataSource.type === 'inline' ? rawRows.value.length : total.value) + 1
  return `${cfg.codePrefix}-${String(n).padStart(3, '0')}`
}

async function handleSave() {
  await formRef.value?.validate?.()
  formSaving.value = true
  try {
    if (cfg.dataSource.type === 'inline') {
      if (formMode.value === 'create') {
        const record = {
          id: cfg.key.toUpperCase() + Date.now(),
          [cfg.codeField]: genCode(),
          ...JSON.parse(JSON.stringify(formData)),
          applicationDate: new Date().toISOString().slice(0, 10),
          status: 'DRAFT',
          erpPurchaseOrderNo: ''
        }
        rawRows.value = [record, ...rawRows.value]
      } else {
        rawRows.value = rawRows.value.map(r => (r.id === formData.id ? { ...r, ...JSON.parse(JSON.stringify(formData)) } : r))
      }
      ElMessage.success('保存成功')
    } else {
      const ds = cfg.dataSource
      if (formMode.value === 'create') {
        await request.post({ url: ds.createPath!, data: formData })
        ElMessage.success('已创建')
      } else {
        await request.put({ url: ds.updatePath!, data: formData })
        ElMessage.success('已更新')
      }
      await loadList()
    }
    formVisible.value = false
  } catch (e: any) {
    if (e?.message) ElMessage.error(e.message)
  } finally {
    formSaving.value = false
  }
}

// ============ 详情 ============
const detailVisible = ref(false)
const detailActiveTab = ref(cfg.detailTabs?.[0]?.name || '__feishu')
const detailData = ref<any>(null)
async function openDetail(row: any) {
  if (cfg.dataSource.type === 'api' && cfg.dataSource.detailPath) {
    const res: any = await request.get({ url: cfg.dataSource.detailPath, params: { id: row.id } })
    detailData.value = normRows([res])[0]
  } else {
    detailData.value = row
  }
  detailActiveTab.value = cfg.detailTabs?.[0]?.name || '__feishu'
  detailVisible.value = true
}

// ============ 飞书黑盒流程（四类采购共用） ============
function genPo(): string {
  return 'PO-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + String(Math.floor(Math.random() * 1000)).padStart(3, '0')
}
async function handlePushFeishu(row: any) {
  await ElMessageBox.confirm(
    `推送「${row[cfg.codeField]}${cfg.nameField ? ' ' + (row[cfg.nameField] || '') : ''}」到飞书「物品需求单」？推送后由飞书完成审批 + ERP 对接，本系统仅展示状态`,
    '推送飞书', { confirmButtonText: '确认推送', type: 'warning' }
  )
  row.status = 'PUSHED_TO_FEISHU'
  row.feishuTicketCode = 'FS-' + Date.now()
  ElMessage.success('已推送飞书，请到飞书查看审批进度')
}
function openFeishu(row: any) {
  window.open(buildFeishuUrl(row), '_blank')
}
function refreshOne(row: any) {
  const next = simulateNextStatus(row.status)
  if (next === normalizeStatus(row.status)) { ElMessage.info('当前已是最终状态，无新进展'); return }
  row.status = next
  if (next === 'DELIVERED' && !row.erpPurchaseOrderNo) row.erpPurchaseOrderNo = genPo()
  ElMessage.success('已同步飞书/ERP 最新状态：' + getStatusName(next))
}
function refreshAllStatus() {
  let updated = 0
  tableData.value.forEach((row: any) => {
    const next = simulateNextStatus(row.status)
    if (next !== normalizeStatus(row.status)) {
      row.status = next
      if (next === 'DELIVERED' && !row.erpPurchaseOrderNo) row.erpPurchaseOrderNo = genPo()
      updated++
    }
  })
  ElMessage.success('已同步飞书/ERP 状态，' + updated + ' 单有更新')
}
function handleResubmit(row: any) {
  row.status = 'DRAFT'
  ElMessage.success('已重置为草稿，可重新编辑后推送')
}
async function handleRetryPush(row: any) {
  await ElMessageBox.confirm('重新推送到飞书？', '重试推送', { type: 'warning' })
  row.status = 'PUSHED_TO_FEISHU'
  ElMessage.success('已重新推送飞书')
}
async function handleDelete(row: any) {
  await ElMessageBox.confirm(`确认删除「${row[cfg.codeField]}」？删除后无法恢复。`, '删除', { type: 'warning', confirmButtonText: '删除' })
  if (cfg.dataSource.type === 'inline') {
    rawRows.value = rawRows.value.filter(r => r.id !== row.id)
  } else {
    await request.delete({ url: cfg.dataSource.deletePath!, params: { id: row.id } })
    await loadList()
  }
  ElMessage.success('已删除')
}

onMounted(loadList)
</script>

<style scoped>
.purchase-list-page { }
.purchase-list-page .hint { color: #909399; font-size: 12px; }
.purchase-list-page :deep(.el-tabs--border-card) { --el-tabs-header-height: 38px; }
.purchase-list-page :deep(.el-table .cell) { font-size: 12px; }
</style>

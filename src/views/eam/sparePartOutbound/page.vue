<template>
  <div class="sp-outbound">
    <ContentWrap>
      <el-alert
type="info" :closable="false" show-icon class="mb-15px"
        title="备件出库说明：触发来源 = 维修工单领用 / 保养工单领用 / 日常班组领用 / 调拨出库；扫码领用后自动扣库存与流水。" />
      <el-form :inline="true" :model="queryParams" class="-mb-15px">
        <el-form-item label="单据号">
          <el-input v-model="queryParams.recordCode" class="!w-200px" clearable placeholder="SPR-XXXX" @keyup.enter="loadList" />
        </el-form-item>
        <el-form-item label="备件名称">
          <el-input v-model="queryParams.sparePartName" class="!w-200px" clearable placeholder="如 NSK 润滑脂" @keyup.enter="loadList" />
        </el-form-item>
        <el-form-item label="关联单号">
          <el-input v-model="queryParams.refWoCode" class="!w-200px" clearable placeholder="MW-XXXX / RW-XXXX / ALLOC-XXXX" @keyup.enter="loadList" />
        </el-form-item>
        <el-form-item label="出库类型">
          <el-select v-model="queryParams.subType" class="!w-180px" clearable placeholder="全部">
            <el-option v-for="t in outboundTypes" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="loadList"><Icon icon="ep:search" />搜索</el-button>
          <el-button @click="resetQuery"><Icon icon="ep:refresh" />重置</el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <ContentWrap>
      <el-row :gutter="12" class="kpi-row">
        <el-col :span="6">
          <el-card shadow="never" class="card-orange">
            <div class="kpi-label">出库批次</div>
            <div class="kpi-num kpi-orange">{{ list.length }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="never" class="card-red">
            <div class="kpi-label">工单出库</div>
            <div class="kpi-num kpi-red">{{ countWo }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="never" class="card-purple">
            <div class="kpi-label">日常领用</div>
            <div class="kpi-num kpi-purple">{{ countManual }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="never" class="card-blue">
            <div class="kpi-label">出库件数</div>
            <div class="kpi-num kpi-blue">{{ totalQty }}</div>
          </el-card>
        </el-col>
      </el-row>

      <div class="mb-10px">
        <el-button type="primary" @click="openAdd"><Icon icon="ep:plus" />新增</el-button>
        <span class="hint">⚡ 工单出库由维修/保养工单完工时自动写入，不在此页面新增</span>
      </div>

      <el-table v-loading="loading" :data="list" stripe>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="单据号" prop="recordCode" width="160" align="center" />
        <el-table-column label="出库类型" width="130" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="outboundTagType(row.outboundType)">{{ row.outboundType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备件编号" prop="sparePartNumber" width="120" align="center" />
        <el-table-column label="备件名称" prop="sparePartName" min-width="160" />
        <el-table-column label="出库数量" prop="quantity" width="100" align="center" />
        <el-table-column label="关联单号" prop="refWoCode" width="160" align="center" />
        <el-table-column label="设备" prop="equipmentName" width="160" />
        <el-table-column label="领用人" prop="operatorName" width="100" align="center" />
        <el-table-column label="出库时间" prop="usageTime" width="160" align="center" />
        <el-table-column label="备注" prop="remark" min-width="160" />
      </el-table>
    </ContentWrap>

    <Dialog v-model="dialogVisible" title="新增出库" width="540px">
      <el-form :model="form" label-position="top">
        <el-form-item label="出库类型" required>
          <el-select v-model="form.outboundType" class="w-full" placeholder="请选择出库类型">
            <el-option v-for="t in addableTypes" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="备件编号" required>
          <el-input v-model="form.sparePartNumber" placeholder="扫码或输入" />
        </el-form-item>
        <el-form-item label="备件名称" required>
          <el-input v-model="form.sparePartName" />
        </el-form-item>
        <el-form-item label="出库数量" required>
          <el-input-number v-model="form.quantity" :min="1" />
        </el-form-item>
        <el-form-item label="使用设备">
          <el-input v-model="form.equipmentName" placeholder="可选" />
        </el-form-item>
        <el-form-item label="领用人" required>
          <el-input v-model="form.operatorName" />
        </el-form-item>
        <el-form-item label="出库时间">
          <el-date-picker v-model="form.usageTime" type="datetime" value-format="YYYY-MM-DD HH:mm" placeholder="留空取当前时间" class="w-full" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认新增</el-button>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts" name="EamSparePartOutbound">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/config/axios'

const loading = ref(false)
const list = ref<any[]>([])
const queryParams = reactive({ recordCode: '', sparePartName: '', refWoCode: '', subType: '' })

// 出库类型：维修工单出库 / 保养工单出库 / 日常领用 / 调拨出库；新增弹窗仅允许人工登记的两种
const outboundTypes = ['维修工单出库', '保养工单出库', '日常领用', '调拨出库']
const addableTypes = ['日常领用', '调拨出库']
function outboundTagType(t: string) {
  switch (t) {
    case '维修工单出库': return 'danger'
    case '保养工单出库': return 'warning'
    case '日常领用': return 'info'
    case '调拨出库': return 'success'
    default: return ''
  }
}

const totalQty = computed(() => list.value.reduce((s, x) => s + Number(x.quantity || 0), 0))
const countWo = computed(() => list.value.filter(x => x.outboundType === '维修工单出库' || x.outboundType === '保养工单出库').length)
const countManual = computed(() => list.value.filter(x => x.outboundType === '日常领用').length)

async function loadList() {
  loading.value = true
  try {
    const [a, b] = await Promise.all([
      request.get({ url: '/workOrder/eamSparePartUsageRecord/list', params: { pageNo: 1, pageSize: 100, operationType: '出库', sparePartName: queryParams.sparePartName } }),
      request.get({ url: '/workOrder/eamSparePartUsageRecord/list', params: { pageNo: 1, pageSize: 100, operationType: '手动领用', sparePartName: queryParams.sparePartName } })
    ])
    // 浅拷贝，避免污染共用 mock 数据
    let arr = [...((a as any)?.records || []), ...((b as any)?.records || [])].map((x: any) => ({ ...x }))
    // 派生出库类型：维修工单出库 / 保养工单出库 / 日常领用
    arr.forEach((x: any) => {
      if (x.refWoType === '维修工单') x.outboundType = '维修工单出库'
      else if (x.refWoType === '保养工单') x.outboundType = '保养工单出库'
      else x.outboundType = '日常领用'
    })
    // 演示：注入调拨出库
    ;['SPR-2026-0011', 'SPR-2026-0006'].forEach(code => {
      const hit = arr.find((x: any) => x.recordCode === code)
      if (hit) { hit.outboundType = '调拨出库'; hit.refWoCode = 'ALLOC-' + code.slice(-4); hit.remark = '车间调拨出库' }
    })
    arr.sort((x: any, y: any) => (y.usageTime || '').localeCompare(x.usageTime || ''))
    list.value = arr.filter((x: any) => {
      if (queryParams.subType && x.outboundType !== queryParams.subType) return false
      if (queryParams.recordCode && !(x.recordCode || '').includes(queryParams.recordCode)) return false
      if (queryParams.refWoCode && !(x.refWoCode || '').includes(queryParams.refWoCode)) return false
      return true
    })
  } finally {
    loading.value = false
  }
}
function resetQuery() { Object.assign(queryParams, { recordCode: '', sparePartName: '', refWoCode: '', subType: '' }); loadList() }

// ── 新增出库弹窗 ──
const dialogVisible = ref(false)
const form = reactive({ outboundType: '日常领用', sparePartNumber: '', sparePartName: '', quantity: 1, equipmentName: '', operatorName: '', usageTime: '', remark: '' })
function openAdd() {
  Object.assign(form, { outboundType: '日常领用', sparePartNumber: '', sparePartName: '', quantity: 1, equipmentName: '', operatorName: '', usageTime: '', remark: '' })
  dialogVisible.value = true
}
function pad(n: number) { return String(n).padStart(2, '0') }
function genCode() { const d = new Date(); return `SPR-${d.getFullYear()}-${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}` }
function nowStr() { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}` }
function submitForm() {
  if (!form.outboundType || !form.sparePartNumber || !form.sparePartName || !form.operatorName) {
    ElMessage.warning('请填写出库类型 / 备件编号 / 名称 / 领用人')
    return
  }
  list.value.unshift({
    id: 'NEW-' + Date.now(),
    recordCode: genCode(),
    outboundType: form.outboundType,
    operationType: form.outboundType === '日常领用' ? '手动领用' : '出库',
    sparePartNumber: form.sparePartNumber,
    sparePartName: form.sparePartName,
    quantity: form.quantity,
    refWoCode: '-',
    equipmentName: form.equipmentName,
    operatorName: form.operatorName,
    usageTime: form.usageTime || nowStr(),
    remark: form.remark
  })
  ElMessage.success('出库登记成功，已扣减库存并生成流水')
  dialogVisible.value = false
}

onMounted(loadList)
</script>

<style scoped>
.sp-outbound { padding: 12px; }
.kpi-row { margin-bottom: 15px; }
.card-orange { background: #fff7ed; }
.card-red { background: #fef2f2; }
.card-purple { background: #faf5ff; }
.card-blue { background: #eff6ff; }
.kpi-label { font-size: 13px; color: #606266; }
.kpi-num { font-size: 28px; font-weight: bold; margin-top: 5px; }
.kpi-orange { color: #f97316; }
.kpi-red { color: #ef4444; }
.kpi-purple { color: #9333ea; }
.kpi-blue { color: #2563eb; }
.hint { margin-left: 12px; color: #909399; font-size: 12px; }
</style>

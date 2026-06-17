<template>
  <div class="sp-inbound">
    <ContentWrap>
      <el-alert
type="info" :closable="false" show-icon class="mb-15px"
        title="备件入库说明：触发来源 = ERP 采购订单到货 / 退库入库 / 调拨入库；操作员扫码登记 → 自动写入备件库存与流水。" />
      <el-form :inline="true" :model="queryParams" class="-mb-15px">
        <el-form-item label="单据号">
          <el-input v-model="queryParams.recordCode" class="!w-200px" clearable placeholder="SPR-XXXX" @keyup.enter="loadList" />
        </el-form-item>
        <el-form-item label="入库类型">
          <el-select v-model="queryParams.inboundType" class="!w-160px" clearable placeholder="全部">
            <el-option v-for="t in inboundTypes" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="备件名称">
          <el-input v-model="queryParams.sparePartName" class="!w-200px" clearable placeholder="如 NSK 润滑脂" @keyup.enter="loadList" />
        </el-form-item>
        <el-form-item label="关联采购单">
          <el-input v-model="queryParams.refWoCode" class="!w-200px" clearable placeholder="PO-XXXX" @keyup.enter="loadList" />
        </el-form-item>
        <el-form-item>
          <el-button @click="loadList"><Icon icon="ep:search" />搜索</el-button>
          <el-button @click="resetQuery"><Icon icon="ep:refresh" />重置</el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <ContentWrap>
      <el-row :gutter="12" class="kpi-row">
        <el-col :span="8">
          <el-card shadow="never" class="card-blue">
            <div class="kpi-label">入库批次（近期）</div>
            <div class="kpi-num kpi-blue">{{ list.length }}</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never" class="card-green">
            <div class="kpi-label">入库总数（件次）</div>
            <div class="kpi-num kpi-green">{{ totalQty }}</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never" class="card-orange">
            <div class="kpi-label">关联采购单数</div>
            <div class="kpi-num kpi-orange">{{ uniquePoCount }}</div>
          </el-card>
        </el-col>
      </el-row>

      <div class="mb-10px">
        <el-button type="primary" @click="openAdd"><Icon icon="ep:plus" />新增</el-button>
      </div>

      <el-table v-loading="loading" :data="list" stripe>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="单据号" prop="recordCode" width="160" align="center" />
        <el-table-column label="入库类型" width="120" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="inboundTagType(row.inboundType)">{{ row.inboundType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备件编号" prop="sparePartNumber" width="120" align="center" />
        <el-table-column label="备件名称" prop="sparePartName" min-width="160" />
        <el-table-column label="入库数量" prop="quantity" width="100" align="center" />
        <el-table-column label="关联采购单" prop="refWoCode" width="160" align="center" />
        <el-table-column label="供应商" prop="equipmentSupplierName" width="130" align="center" />
        <el-table-column label="入库人" prop="operatorName" width="100" align="center" />
        <el-table-column label="入库时间" prop="usageTime" width="160" align="center" />
        <el-table-column label="备注" prop="remark" min-width="160" />
      </el-table>
    </ContentWrap>

    <Dialog v-model="dialogVisible" title="新增入库" width="560px">
      <el-form :model="form" label-position="top">
        <el-form-item label="入库类型" required>
          <el-select v-model="form.inboundType" class="w-full" placeholder="请选择入库类型">
            <el-option v-for="t in addableInboundTypes" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="单据号">
          <el-input v-model="form.recordCode" placeholder="留空自动生成 SPR-XXXX" />
        </el-form-item>
        <el-form-item label="备件编号">
          <el-input v-model="form.sparePartNumber" placeholder="扫码或输入" />
        </el-form-item>
        <el-form-item label="备件名称" required>
          <el-input v-model="form.sparePartName" />
        </el-form-item>
        <el-form-item label="入库数量" required>
          <el-input-number v-model="form.quantity" :min="1" />
        </el-form-item>
        <el-form-item label="入库人" required>
          <el-input v-model="form.operatorName" />
        </el-form-item>
        <el-form-item label="入库时间">
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

<script setup lang="ts" name="EamSparePartInbound">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/config/axios'

const loading = ref(false)
const list = ref<any[]>([])
const queryParams = reactive({ recordCode: '', inboundType: '', sparePartName: '', refWoCode: '' })

// 入库类型全集（查询筛选用，列表含接口自动写入的 ERP采购入库）
const inboundTypes = ['ERP采购入库', '退库入库', '调拨入库']
// 新增弹窗可选：ERP采购入库由 ERP 到货接口自动写入，不在此页面人工新增
const addableInboundTypes = ['退库入库', '调拨入库']
function inboundTagType(t: string) {
  if (t === '退库入库') return 'warning'
  if (t === '调拨入库') return 'success'
  return '' // ERP采购入库 = 默认主题色
}

const totalQty = computed(() => list.value.reduce((s, x) => s + Number(x.quantity || 0), 0))
const uniquePoCount = computed(() => new Set(list.value.map(x => x.refWoCode).filter(c => c && c !== '-')).size)

async function loadList() {
  loading.value = true
  try {
    const res: any = await request.get({
      url: '/workOrder/eamSparePartUsageRecord/list',
      params: { pageNo: 1, pageSize: 100, operationType: '入库', sparePartName: queryParams.sparePartName }
    })
    // 浅拷贝，避免污染共用 mock 数据
    let arr = (res?.records || []).map((x: any) => ({ ...x }))
    // 派生入库类型：默认 ERP采购入库；演示注入一条退库入库、一条调拨入库
    arr.forEach((x: any) => {
      x.inboundType = 'ERP采购入库'
      if (x.recordCode === 'SPR-2026-0005') { x.inboundType = '退库入库'; x.refWoCode = '-'; x.remark = '维修后未使用退回入库' }
      if (x.recordCode === 'SPR-2026-0009') { x.inboundType = '调拨入库'; x.refWoCode = 'ALLOC-2026-0007'; x.remark = 'CNC 车间调拨入库' }
    })
    // 前端过滤
    list.value = arr.filter((x: any) => {
      if (queryParams.inboundType && x.inboundType !== queryParams.inboundType) return false
      if (queryParams.recordCode && !(x.recordCode || '').includes(queryParams.recordCode)) return false
      if (queryParams.refWoCode && !(x.refWoCode || '').includes(queryParams.refWoCode)) return false
      return true
    })
  } finally {
    loading.value = false
  }
}
function resetQuery() { Object.assign(queryParams, { recordCode: '', inboundType: '', sparePartName: '', refWoCode: '' }); loadList() }

// ── 新增入库弹窗 ──
const dialogVisible = ref(false)
const form = reactive({ inboundType: '退库入库', recordCode: '', sparePartNumber: '', sparePartName: '', quantity: 1, operatorName: '', usageTime: '', remark: '' })
function openAdd() {
  Object.assign(form, { inboundType: '退库入库', recordCode: '', sparePartNumber: '', sparePartName: '', quantity: 1, operatorName: '', usageTime: '', remark: '' })
  dialogVisible.value = true
}
function pad(n: number) { return String(n).padStart(2, '0') }
function genCode() { const d = new Date(); return `SPR-${d.getFullYear()}-${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}` }
function nowStr() { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}` }
function submitForm() {
  if (!form.inboundType || !form.sparePartName || !form.operatorName) {
    ElMessage.warning('请填写入库类型 / 备件名称 / 入库人')
    return
  }
  list.value.unshift({
    id: 'NEW-' + Date.now(),
    recordCode: form.recordCode || genCode(),
    inboundType: form.inboundType,
    operationType: '入库',
    sparePartNumber: form.sparePartNumber,
    sparePartName: form.sparePartName,
    quantity: form.quantity,
    refWoCode: '-',
    operatorName: form.operatorName,
    usageTime: form.usageTime || nowStr(),
    remark: form.remark
  })
  ElMessage.success('入库登记成功，已写入备件库存与流水')
  dialogVisible.value = false
}

onMounted(loadList)
</script>

<style scoped>
.sp-inbound { padding: 12px; }
.kpi-row { margin-bottom: 15px; }
.card-blue { background: #eff6ff; }
.card-green { background: #f0fdf4; }
.card-orange { background: #fff7ed; }
.kpi-label { font-size: 13px; color: #606266; }
.kpi-num { font-size: 28px; font-weight: bold; margin-top: 5px; }
.kpi-blue { color: #2563eb; }
.kpi-green { color: #16a34a; }
.kpi-orange { color: #f97316; }
</style>

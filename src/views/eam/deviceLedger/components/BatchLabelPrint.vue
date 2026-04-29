<template>
  <el-dialog
    v-model="visible"
    :title="`批量打印贴纸（共 ${devices.length} 台 / ${pageInfo.totalPages} 页）`"
    width="900px"
    align-center
    @opened="onOpened"
  >
    <div :id="printAreaId" class="label-sheet">
      <div
        v-for="(group, pageIdx) in pagedDevices"
        :key="pageIdx"
        class="label-page"
      >
        <div
          v-for="d in group"
          :key="d.equipmentSn"
          class="label-cell"
        >
          <canvas :data-sn="d.equipmentSn" />
          <div class="label-info">
            <div class="label-name">{{ d.equipmentName }}</div>
            <div class="label-sn">{{ d.equipmentSn }}</div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" v-print="printConfig">打印</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import QRCode from 'qrcode'
import {
  buildEquipmentQrUrl,
  getDeployBaseUrl,
  calcLabelPages,
} from '../utils/qrcode-helper'

defineOptions({ name: 'BatchLabelPrint' })

interface DeviceLite {
  equipmentSn: string
  equipmentName: string
}

const visible = ref(false)
const devices = ref<DeviceLite[]>([])

// 唯一 ID 避免多实例冲突
const printAreaId = `batch-label-print-area-${Math.random().toString(36).slice(2, 9)}`
const printConfig = {
  id: printAreaId,
  popTitle: '设备贴纸',
  extraCss: '',
}

const pageInfo = computed(() => calcLabelPages(devices.value.length))

const pagedDevices = computed(() => {
  const groups: DeviceLite[][] = []
  for (let i = 0; i < devices.value.length; i += pageInfo.value.perPage) {
    groups.push(devices.value.slice(i, i + pageInfo.value.perPage))
  }
  return groups
})

function open(list: DeviceLite[]) {
  devices.value = list
  visible.value = true
}

async function onOpened() {
  await nextTick()
  const baseUrl = getDeployBaseUrl()
  const allCanvas = document.querySelectorAll<HTMLCanvasElement>(`#${printAreaId} canvas`)
  for (const canvas of Array.from(allCanvas)) {
    const sn = canvas.dataset.sn || ''
    if (!sn) continue
    try {
      await QRCode.toCanvas(canvas, buildEquipmentQrUrl(baseUrl, sn), {
        width: 100,
        margin: 1,
        errorCorrectionLevel: 'H',
      })
    } catch (e) {
      console.error('生成失败 sn=', sn, e)
    }
  }
}

defineExpose({ open })
</script>

<style scoped>
.label-sheet {
  max-height: 60vh;
  overflow-y: auto;
  background: #f5f7fa;
  padding: 12px;
}
.label-page {
  background: #fff;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 50mm;
  gap: 0;
  padding: 8mm;
  margin-bottom: 12px;
  page-break-after: always;
}
.label-cell {
  width: 70mm;
  height: 50mm;
  display: flex;
  align-items: center;
  border: 1px dashed #ddd;
  padding: 4mm;
  box-sizing: border-box;
}
.label-cell canvas {
  width: 28mm;
  height: 28mm;
  flex-shrink: 0;
}
.label-info {
  margin-left: 4mm;
  font-size: 11px;
  line-height: 1.4;
  overflow: hidden;
  flex: 1;
}
.label-name {
  font-weight: bold;
  color: #303133;
  word-break: break-all;
}
.label-sn {
  margin-top: 4px;
  color: #606266;
}

@media print {
  .label-cell { border: none; }
}
</style>

<template>
  <el-dialog
    v-model="visible"
    title="设备二维码"
    width="400px"
    align-center
    @closed="onClosed"
  >
    <div class="qr-wrap">
      <div ref="canvasWrapRef" id="qrcode-print-area" class="qr-canvas">
        <canvas ref="canvasRef" />
        <div class="qr-info">
          <div class="qr-line">设备名称：{{ device?.equipmentName }}</div>
          <div class="qr-line">设备编号：{{ device?.equipmentSn }}</div>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleDownload">下载 PNG</el-button>
      <el-button type="primary" v-print="printConfig">打印贴纸</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import QRCode from 'qrcode'
import { ElMessage } from 'element-plus'
import {
  buildEquipmentQrUrl,
  downloadCanvasAsPng,
  getDeployBaseUrl,
} from '../utils/qrcode-helper'

defineOptions({ name: 'QrcodeDialog' })

interface DeviceLite {
  equipmentSn: string
  equipmentName: string
}

const visible = ref(false)
const device = ref<DeviceLite | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasWrapRef = ref<HTMLDivElement | null>(null)

const printConfig = {
  id: 'qrcode-print-area',
  popTitle: '设备二维码',
}

async function open(d: DeviceLite) {
  device.value = d
  visible.value = true
  await nextTick()
  if (!canvasRef.value) return
  const url = buildEquipmentQrUrl(getDeployBaseUrl(), d.equipmentSn)
  try {
    await QRCode.toCanvas(canvasRef.value, url, {
      width: 240,
      margin: 1,
      errorCorrectionLevel: 'H',
    })
  } catch (e) {
    ElMessage.error('二维码生成失败')
    console.error(e)
  }
}

function onClosed() {
  device.value = null
}

function handleDownload() {
  if (!canvasRef.value || !device.value) return
  const tmpCanvas = document.createElement('canvas')
  const url = buildEquipmentQrUrl(getDeployBaseUrl(), device.value.equipmentSn)
  QRCode.toCanvas(tmpCanvas, url, {
    width: 512,
    margin: 2,
    errorCorrectionLevel: 'H',
  }).then(() => {
    downloadCanvasAsPng(tmpCanvas, `${device.value!.equipmentSn}.png`)
  })
}

defineExpose({ open })
</script>

<style scoped>
.qr-wrap {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
.qr-canvas {
  text-align: center;
}
.qr-canvas canvas {
  display: block;
  margin: 0 auto;
}
.qr-info {
  margin-top: 16px;
  color: #303133;
  font-size: 14px;
}
.qr-line {
  line-height: 1.8;
}
</style>

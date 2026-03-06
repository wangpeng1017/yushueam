<!-- Author [system],  Since 2026-02-24,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <el-drawer v-model="drawerVisible" title="执行日志详情" size="600px" direction="rtl">
    <div v-loading="loading" class="exec-log-detail">
      <!-- 基本信息 -->
      <el-descriptions :column="2" border>
        <el-descriptions-item label="策略编码">{{ detail.strategyCode }}</el-descriptions-item>
        <el-descriptions-item label="策略名称">{{ detail.strategyName }}</el-descriptions-item>
        <el-descriptions-item label="版本号">V{{ detail.versionNo }}</el-descriptions-item>
        <el-descriptions-item label="执行模式">{{
          detail.execModeName || detail.execMode
        }}</el-descriptions-item>
        <el-descriptions-item label="命中规则">{{
          getHitRuleName(detail.hitRuleTraceJson) || '-'
        }}</el-descriptions-item>
        <el-descriptions-item label="执行状态">
          <el-tag :type="detail.successFlag ? 'success' : 'danger'">
            {{ detail.successFlag ? '成功' : '失败' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="耗时">{{ detail.costMs }} ms</el-descriptions-item>
        <el-descriptions-item label="执行时间">{{
          formatDate(detail.createTime)
        }}</el-descriptions-item>
        <el-descriptions-item label="业务类型">{{ detail.bizType || '-' }}</el-descriptions-item>
        <el-descriptions-item label="业务单号">{{ detail.bizNo || '-' }}</el-descriptions-item>
        <el-descriptions-item label="TraceId" :span="2">{{
          detail.traceId || '-'
        }}</el-descriptions-item>
        <el-descriptions-item v-if="detail.errorMsg" label="错误信息" :span="2">
          <span class="error-message">{{ detail.errorMsg }}</span>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 输入数据 -->
      <div class="section-title">请求上下文</div>
      <JsonPreview
        v-if="detail.requestContextJson"
        :value="detail.requestContextJson"
        collapsible
        max-height="300px"
      />
      <div v-else class="empty-data">无请求数据</div>

      <!-- 输出数据 -->
      <div class="section-title">执行结果</div>
      <JsonPreview
        v-if="detail.resultJson"
        :value="detail.resultJson"
        collapsible
        max-height="300px"
      />
      <div v-else class="empty-data">无结果数据</div>

      <!-- 命中规则轨迹 -->
      <div v-if="detail.hitRuleTraceJson" class="section-title">命中规则轨迹</div>
      <JsonPreview
        v-if="detail.hitRuleTraceJson"
        :value="detail.hitRuleTraceJson"
        collapsible
        max-height="200px"
      />
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import * as StrategyApi from '@/api/mdm/strategy'
import { formatDate } from '@/utils/formatTime'
import { JsonPreview } from '../components'

defineOptions({ name: 'ExecLogDetailDrawer' })

const drawerVisible = ref(false)
const loading = ref(false)
const detail = ref<any>({})

// 从hitRuleTraceJson中提取命中规则名称
const getHitRuleName = (hitRuleTraceJson: string) => {
  if (!hitRuleTraceJson) return null
  try {
    const trace = JSON.parse(hitRuleTraceJson)
    if (Array.isArray(trace) && trace.length > 0) {
      return trace.map((r: any) => r.ruleName).filter(Boolean).join(', ')
    }
    if (trace.ruleName) return trace.ruleName
    if (trace.hitRule?.ruleName) return trace.hitRule.ruleName
    return null
  } catch {
    return null
  }
}

// 打开抽屉
const open = async (logId: number) => {
  drawerVisible.value = true
  loading.value = true
  try {
    detail.value = await StrategyApi.getExecLogDetail(logId)
  } finally {
    loading.value = false
  }
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.exec-log-detail {
  padding: 0 10px;
}

.section-title {
  padding: 10px 0;
  margin-top: 15px;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  border-bottom: 1px solid #ebeef5;
}

.empty-data {
  padding: 20px;
  font-size: 13px;
  color: #909399;
  text-align: center;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.error-message {
  color: #f56c6c;
}
</style>

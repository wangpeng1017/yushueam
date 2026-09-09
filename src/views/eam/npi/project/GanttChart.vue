<template>
  <div class="gantt-root">
    <div class="gantt-toolbar">
      <el-radio-group v-model="granularity" size="small">
        <el-radio-button label="week">周粒度</el-radio-button>
        <el-radio-button label="month">月粒度</el-radio-button>
      </el-radio-group>
      <div class="gantt-legend">
        <span class="legend-item"><i class="dot" style="background:#52C41A"></i>已完成</span>
        <span class="legend-item"><i class="dot" style="background:#1677FF"></i>进行中</span>
        <span class="legend-item"><i class="dot" style="background:#FA8C16"></i>2 天内到期</span>
        <span class="legend-item"><i class="dot" style="background:#FF4D4F"></i>已逾期</span>
        <span class="legend-item"><i class="dot" style="background:#E5E6EB"></i>待开始</span>
      </div>
    </div>

    <div v-if="projects.length === 0" class="gantt-empty">
      <el-empty description="暂无项目数据" :image-size="80" />
    </div>
    <div v-else ref="scrollEl" class="gantt-scroll">
      <div class="gantt-table" :style="gridVars">
        <div class="gantt-row gantt-header-row1">
          <div class="gantt-label-cell sticky-corner">项目 / 编号 / 当前阶段</div>
          <div v-for="m in months" :key="m.key" class="gantt-month-cell" :style="{ width: m.width + 'px' }">
            {{ m.label }}
          </div>
        </div>
        <div class="gantt-row gantt-header-row2">
          <div class="gantt-label-cell sticky-corner2"></div>
          <div
            v-for="d in days"
            :key="d.date"
            class="gantt-day-cell"
            :class="{ 'week-start': d.isWeekStart }"
            :style="{ width: dayWidth + 'px' }"
          >
            {{ d.label }}
          </div>
        </div>

        <div v-for="p in projects" :key="p.id" class="gantt-row gantt-body-row" @click="emit('rowClick', p)">
          <div class="gantt-label-cell sticky-label">
            <div class="proj-code">{{ p.projectCode }}</div>
            <div class="proj-name">{{ p.projectName }}</div>
            <div class="proj-stage">当前：{{ currentStageName(p) }}</div>
          </div>
          <div class="gantt-timeline" :style="{ width: totalWidth + 'px' }">
            <div v-if="todayOffset !== null" class="today-line" :style="{ left: todayOffset + 'px' }"></div>
            <div
              v-for="s in p.stages"
              :key="s.idx"
              class="gantt-bar"
              :class="barClass(s)"
              :style="{ left: stageLeft(s) + 'px', width: stageWidth(s) + 'px' }"
              :title="`${s.name ?? ''} ${s.progress ?? 0}%（${s.planStart ?? ''} ~ ${s.planEnd ?? ''}）`"
            >
              <span class="bar-text">{{ s.name }} {{ s.progress }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import dayjs from 'dayjs'
import type { NpiProject, NpiStage } from '@/mock-data/eam-npi'

const props = defineProps<{ projects: NpiProject[] }>()
const emit = defineEmits<{ (e: 'rowClick', project: NpiProject): void }>()

const scrollEl = ref<HTMLDivElement>()
const granularity = ref<'week' | 'month'>('week')
const dayWidth = computed(() => (granularity.value === 'week' ? 24 : 6))

// 'YYYY-MM-DD' 字符串可直接字典序比较，不依赖 dayjs minMax 插件
const rangeStart = computed(() => {
  const dates = props.projects.flatMap((p) => p.stages.map((s) => s.planStart))
  const min = dates.length ? dates.reduce((a, b) => (a < b ? a : b)) : dayjs().subtract(15, 'day').format('YYYY-MM-DD')
  return dayjs(min).subtract(3, 'day')
})
const rangeEnd = computed(() => {
  const dates = props.projects.flatMap((p) => p.stages.map((s) => s.planEnd))
  const max = dates.length ? dates.reduce((a, b) => (a > b ? a : b)) : dayjs().add(30, 'day').format('YYYY-MM-DD')
  return dayjs(max).add(3, 'day')
})

const days = computed(() => {
  const list: { date: string; label: string; monthKey: string; isWeekStart: boolean }[] = []
  let cur = rangeStart.value
  while (!cur.isAfter(rangeEnd.value, 'day')) {
    // 月粒度下每天仅 6px，只在 1/8/15/22 号显示刻度，避免数字挤成一串
    const showLabel = granularity.value === 'week' || [1, 8, 15, 22].includes(cur.date())
    list.push({
      date: cur.format('YYYY-MM-DD'),
      label: showLabel ? String(cur.date()) : '',
      monthKey: cur.format('YYYY-MM'),
      isWeekStart: cur.day() === 1
    })
    cur = cur.add(1, 'day')
  }
  return list
})

const months = computed(() => {
  const list: { key: string; label: string; width: number }[] = []
  days.value.forEach((d) => {
    const last = list[list.length - 1]
    if (last && last.key === d.monthKey) {
      last.width += dayWidth.value
    } else {
      list.push({ key: d.monthKey, label: dayjs(d.date).format('YYYY年MM月'), width: dayWidth.value })
    }
  })
  return list
})

const totalWidth = computed(() => days.value.length * dayWidth.value)

/**
 * 时间轴竖向网格线：日线 + 周线两层背景，与表头日期格的分隔线共用同一套 CSS 变量，
 * 保证「表头刻度 ↔ 下方竖线」严格对齐（都画在每一天的左边缘）。
 * 周线需要对齐到周一，故用 weekOffset 平移一层背景。
 */
const gridVars = computed(() => {
  const offset = (1 - rangeStart.value.day() + 7) % 7 // rangeStart 距下一个周一的天数
  return {
    '--day-w': `${dayWidth.value}px`,
    '--week-offset': String(offset),
    // 月粒度每天仅 6px，日线会糊成一片，只保留周线
    '--day-line': granularity.value === 'week' ? '#F0F2F5' : 'transparent',
    '--week-line': '#DCDFE6'
  }
})

const todayOffset = computed(() => {
  const t = dayjs()
  if (t.isBefore(rangeStart.value, 'day') || t.isAfter(rangeEnd.value, 'day')) return null
  return t.diff(rangeStart.value, 'day') * dayWidth.value
})

function scrollToToday() {
  const el = scrollEl.value
  const offset = todayOffset.value
  if (!el || offset === null) return
  const target = Math.max(offset - el.clientWidth * 0.3, 0)
  el.scrollLeft = target
}

onMounted(() => {
  nextTick(scrollToToday)
})

watch([granularity, () => props.projects], () => {
  nextTick(scrollToToday)
})

function currentStageName(p: NpiProject): string {
  return p.stages.find((s) => s.idx === p.currentStage)?.name ?? '-'
}

function stageLeft(s: NpiStage): number {
  return dayjs(s.planStart).diff(rangeStart.value, 'day') * dayWidth.value
}

function stageWidth(s: NpiStage): number {
  const spanDays = dayjs(s.planEnd).diff(dayjs(s.planStart), 'day') + 1
  return Math.max(spanDays, 1) * dayWidth.value
}

function barClass(s: NpiStage): string {
  if (s.status === 'completed') return 'bar-done'
  if (s.status === 'pending') return 'bar-pending'
  const daysLeft = dayjs(s.planEnd).diff(dayjs().startOf('day'), 'day')
  if (daysLeft < 0) return 'bar-overdue'
  if (daysLeft <= 2) return 'bar-due-soon'
  return 'bar-doing'
}
</script>

<style scoped>
.gantt-root { display: flex; flex-direction: column; gap: 10px; }
.gantt-toolbar { display: flex; align-items: center; justify-content: space-between; }
.gantt-legend { display: flex; gap: 14px; font-size: 12px; color: #606266; }
.legend-item { display: inline-flex; align-items: center; gap: 4px; }
.dot { display: inline-block; width: 10px; height: 10px; border-radius: 2px; }
.gantt-empty { padding: 40px 0; }

/* 纵向也在容器内滚动，表头 sticky 才有参照系（页面级滚动时 sticky 会失效） */
.gantt-scroll {
  overflow: auto; border: 1px solid #E5E6EB; border-radius: 4px;
  max-height: calc(100vh - 330px); min-height: 320px;
}
.gantt-table { display: inline-flex; flex-direction: column; min-width: 100%; --h1: 30px; --h2: 28px; }
.gantt-row { display: flex; }

.gantt-label-cell {
  flex-shrink: 0; width: 220px; box-sizing: border-box;
  position: sticky; left: 0; z-index: 3;
  background: #fff; border-right: 1px solid #E5E6EB; border-bottom: 1px solid #E5E6EB;
  padding: 6px 10px; font-size: 12px;
}
.sticky-corner, .sticky-corner2 {
  z-index: 4; background: #F5F7FA; color: #606266; font-weight: 600;
  display: flex; align-items: center;
}
/* 两行表头分别冻结在顶部：第二行下移第一行的高度，避免互相盖住 */
.gantt-header-row1 { position: sticky; top: 0; z-index: 6; background: #F5F7FA; height: var(--h1); }
.gantt-header-row2 { position: sticky; top: var(--h1); z-index: 6; background: #F5F7FA; height: var(--h2); }
.gantt-month-cell, .gantt-day-cell {
  flex-shrink: 0; box-sizing: border-box; text-align: center;
  border-right: 1px solid #EBEEF5; border-bottom: 1px solid #E5E6EB;
  font-size: 11px; color: #909399; padding: 4px 0; background: #F5F7FA;
}
.gantt-month-cell { font-weight: 600; color: #606266; }
/* 日刻度分隔线画在每天「左」边缘，与下方时间轴的网格线同一位置；月粒度下 --day-line 为透明，只留周线 */
.gantt-day-cell {
  white-space: nowrap; overflow: visible;
  border-right: none; border-left: 1px solid var(--day-line);
}
.gantt-day-cell.week-start { border-left-color: var(--week-line); }

.gantt-body-row { cursor: pointer; }
.gantt-body-row:hover .gantt-label-cell { background: #F0F7FF; }
.proj-code { color: #909399; font-size: 11px; }
.proj-name { color: #303133; font-weight: 600; font-size: 12px; margin: 2px 0; }
.proj-stage { color: #606266; font-size: 11px; }

.gantt-timeline {
  position: relative; flex-shrink: 0; height: 56px; border-bottom: 1px solid #EBEEF5;
  /* 两层网格：周线（每 7 天，平移对齐周一）+ 日线（每天）。tile 宽度精确到一个周期，平移后无缝 */
  background-image:
    linear-gradient(to right, var(--week-line) 0 1px, transparent 1px),
    linear-gradient(to right, var(--day-line) 0 1px, transparent 1px);
  background-size: calc(var(--day-w) * 7) 100%, var(--day-w) 100%;
  background-position: calc(var(--week-offset) * var(--day-w)) 0, 0 0;
  background-repeat: repeat;
}
.today-line { position: absolute; top: 0; bottom: 0; width: 0; border-left: 1px dashed #FF4D4F; z-index: 1; }
.gantt-bar {
  position: absolute; top: 12px; height: 32px; border-radius: 3px;
  display: flex; align-items: center; padding: 0 6px; overflow: hidden;
  color: #fff; font-size: 11px; white-space: nowrap;
}
.bar-text { overflow: hidden; text-overflow: ellipsis; }
.bar-done { background: #52C41A; }
.bar-doing { background: #1677FF; }
.bar-due-soon { background: #FA8C16; }
.bar-overdue { background: #FF4D4F; }
.bar-pending { background: #E5E6EB; color: #909399; }
</style>

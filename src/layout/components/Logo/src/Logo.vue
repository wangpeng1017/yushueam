<script lang="ts" setup>
import { computed, onMounted, ref, unref, watch } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'

defineOptions({ name: 'Logo' })

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('logo')

const appStore = useAppStore()

const show = ref(true)

const title = computed(() => appStore.getTitle)

const layout = computed(() => appStore.getLayout)

const collapse = computed(() => appStore.getCollapse)

onMounted(() => {
  if (unref(collapse)) show.value = false
})

watch(
  () => collapse.value,
  (collapse: boolean) => {
    if (unref(layout) === 'topLeft' || unref(layout) === 'cutMenu') {
      show.value = true
      return
    }
    if (!collapse) {
      setTimeout(() => {
        show.value = !collapse
      }, 400)
    } else {
      show.value = !collapse
    }
  }
)

watch(
  () => layout.value,
  (layout) => {
    if (layout === 'top' || layout === 'cutMenu') {
      show.value = true
    } else {
      if (unref(collapse)) {
        show.value = false
      } else {
        show.value = true
      }
    }
  }
)
</script>

<template>
  <div>
    <router-link
      :class="[
        prefixCls,
        layout !== 'classic' ? `${prefixCls}__Top` : '',
        'flex items-center cursor-pointer relative decoration-none overflow-hidden'
      ]"
      :style="{
        height: 'var(--logo-height)',
        padding: '0 16px',
        gap: '10px',
        justifyContent: show ? 'flex-start' : 'center'
      }"
      to="/"
    >
      <!-- 已隐藏图片 logo -->
      <!-- <img :style="{ width: '28px', height: '28px' }" src="@/assets/imgs/logoW.svg" /> -->
      <div
        v-if="show"
        :class="[
          'text-[16px] font-700 leading-tight whitespace-nowrap',
          {
            'text-white': layout === 'classic',
            'text-[var(--top-header-text-color)]':
              layout === 'topLeft' || layout === 'top' || layout === 'cutMenu'
          }
        ]"
        style="letter-spacing: 0.8px;"
      >
        {{ title }}
      </div>
    </router-link>
  </div>
</template>

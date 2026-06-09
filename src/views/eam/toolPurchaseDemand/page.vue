<template>
  <PurchaseListPage :config="toolingPurchaseConfig" />
</template>

<script setup lang="ts" name="EamToolPurchaseDemand">
import PurchaseListPage from '../_purchase-shared/PurchaseListPage.vue'
import { toolingPurchaseConfig } from '../_purchase-shared/configs/tooling'
</script>

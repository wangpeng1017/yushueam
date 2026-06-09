<template>
  <PurchaseListPage :config="sparePartPurchaseConfig" />
</template>

<script setup lang="ts" name="EamSparePartPurchase">
import PurchaseListPage from '../_purchase-shared/PurchaseListPage.vue'
import { sparePartPurchaseConfig } from '../_purchase-shared/configs/sparePart'
</script>

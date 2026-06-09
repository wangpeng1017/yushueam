<template>
  <PurchaseListPage :config="diyPurchaseConfig" />
</template>

<script setup lang="ts" name="EamDiyEquipmentPartPurchase">
import PurchaseListPage from '../_purchase-shared/PurchaseListPage.vue'
import { diyPurchaseConfig } from '../_purchase-shared/configs/diy'
</script>

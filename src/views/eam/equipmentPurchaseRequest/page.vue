<template>
  <PurchaseListPage :config="equipmentPurchaseConfig" />
</template>

<script setup lang="ts" name="EamEquipmentPurchaseRequest">
import PurchaseListPage from '../_purchase-shared/PurchaseListPage.vue'
import { equipmentPurchaseConfig } from '../_purchase-shared/configs/equipment'
</script>

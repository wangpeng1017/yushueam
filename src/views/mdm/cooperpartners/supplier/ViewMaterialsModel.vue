<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="900">
    <div class="max-h-[500px] overflow-auto">
      <el-table :data="formData">
        <el-table-column align="center" label="物料编码" prop="materialCode" />
        <el-table-column align="center" label="名称" prop="materialName" />
        <el-table-column align="center" label="规格型号" prop="specification" />
        <el-table-column align="center" label="分类" prop="materialCategoryText" />
        <el-table-column align="center" label="基本单位" prop="baseUnitText" />
        <el-table-column align="center" label="物理属性 (mm | kg)" width="160">
          <template #default="scope">
            <div style="text-align: left; font-size: 12px; color: #606266">
              <div
                >LWH: {{ scope.row.lengthMm || 0 }}*{{ scope.row.widthMm || 0 }}*{{
                  scope.row.heightMm || 0
                }}</div
              >
              <div style="margin-top: 2px">GW: {{ scope.row.grossWeightKg || 0 }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="存储要求">
          <template #default="scope">
            <div style="text-align: center">
              <span style="font-size: 12px; color: #303133">
                {{
                  getDictLabel(
                    DICT_TYPE.MATERIAL_STORAGE_CONDITION,
                    scope.row.baseStorageCondition
                  ) || '-'
                }}
              </span>
              <div style="font-size: 11px; color: #909399">
                {{ scope.row.storageCondition || '-' }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="管控" width="100">
          <template #default="scope">
            <div style="text-align: center">
              <div v-if="scope.row.batchManagementEnabled">
                <el-tag size="small" style="margin-bottom: 4px" type="primary"> 批次管理 </el-tag>
                {{ scope.row.barcodeRuleName || '-' }}
              </div>
              <!-- 普通管控 -->
              <div v-else style="color: #909399; font-size: 12px"> 普通 </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="100">
          <template #default="scope">
            <el-tag
              :type="scope.row.materialStatus === 'A' ? 'success' : 'danger'"
              size="small"
              style="display: inline-flex; align-items: center"
            >
              <span>{{ scope.row.materialStatusText }}</span>
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { listOfMaterial } from '@/api/mdm/material'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formData = ref()

const open = async (id: number, title: string) => {
  dialogVisible.value = true
  dialogTitle.value = `【${title}】物料清单`
  formData.value = await listOfMaterial({ id })
}

defineExpose({ open })
</script>

<style lang="scss" scoped></style>

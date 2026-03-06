<!-- Author [陈建峰],  Since 2026-01-19 17:20:18,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="80px">
      <el-form-item label="所属物料" prop="materialId">
         <el-select
         class="!w-200px"
          v-model="queryParams.materialId" placeholder="请选择所属物料" clearable>
              <el-option
                v-for="material in materialList"
                :key="material.id"
                :label="`${material.materialCode} - ${material.materialName}`"
                :value="material.id">
                <div class="material-option">
                  <div class="material-code">{{ material.materialCode }}</div>
                  <div class="material-name">{{ material.materialName }}</div>
<!--                  <div class="material-spec">{{ material.specification || '无规格' }}</div>-->
                </div>
              </el-option>
            </el-select>
      </el-form-item>
      <el-form-item label="物料状态" prop="batchStatus">
        <el-select
          v-model="queryParams.batchStatus"
          placeholder="请选择物料状态"
          clearable
          class="!w-200px">
          <el-option
            v-for="dict in materialBatchStatusList"
            :key="dict.value" :label="dict.text" :value="dict.value"/>
        </el-select>
      </el-form-item> 
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" />&nbsp;搜索</el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" />&nbsp;重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div class="mb-10px">
      <el-button
        v-hasPermi="['']"
        plain
        type="primary"
        @click="openForm('create')">
        <Icon class="mr-5px" icon="ep:plus" />&nbsp;新增
      </el-button>
      <!-- <el-button
        v-hasPermi="['']"
        :loading="exportLoading"
        plain
        type="success"
        @click="handleExport" >
        <Icon class="mr-5px" icon="ep:download" />&nbsp;导出
      </el-button> -->
      <el-button
        v-hasPermi="['']"
        :disabled="checkedIds.length === 0"
        plain
        type="danger"
        @click="handleDeleteBatch">
        <Icon class="mr-5px" icon="ep:delete" />&nbsp;批量删除
      </el-button>
    </div>
    <el-table v-loading="loading" :data="list" @selection-change="handleRowCheckboxChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="关联物料" align="center" min-width="200">
        <template #default="scope">
          <div style="text-align: left;">
            <div style="font-weight: 500; color: #303133; font-size: 13px;">{{ scope.row.materialCode }}</div>
            <div style="color: #606266; margin-top: 2px; font-size: 12px;">{{ scope.row.materialName }}</div>
            <div style="color: #909399; margin-top: 2px; font-size: 11px;">{{ scope.row.specification || '无规格' }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="批次规则码" align="center" min-width="200" prop="batchRule" />
      <el-table-column label="批次状态" align="center" min-width="200">
        <template #default="scope">
          <div class="status-display">
            <div class="status-icon" :class="{ active: scope.row.batchStatus, inactive: !scope.row.batchStatus }">
              <Icon icon="ep:check" />
            </div>
            <span class="status-text" :class="{ active: scope.row.batchStatus, inactive: !scope.row.batchStatus }">
              已启用
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="160"
          :formatter="dateFormatter"/>
      <el-table-column label="操作" align="center" min-width="200" fixed="right">
        <template #default="scope">
          <el-button
            link
            class="btn-edit"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['']">编辑
          </el-button>
          <el-button
            link
            :class="scope.row.batchStatus ? 'btn-other' : 'btn-edit'"
            @click="handleToggleStatus(scope.row.id, scope.row.batchStatus)"
            v-hasPermi="['']">
            {{ scope.row.batchStatus ? '禁用' : '启用' }}
          </el-button>
          <el-button
            link
            class="btn-delete"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
  <MaterialBatchForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import * as MaterialBatchApi from '@/api/mdm/material/batch'
import * as MaterialApi from '@/api/mdm/material'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import MaterialBatchForm from './form.vue'

defineOptions({ name: 'MaterialBatchPage' })

const message = useMessage()
const { t } = useI18n()

const materialList = ref<MaterialApi.MaterialDto[]>([])
const materialBatchStatusList = ref<EnumEntityOption[]>([])
const materialBatchRuleList = ref<EnumEntityOption[]>([])

const loading = ref(true)
const total = ref(0)
const list = ref([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  batchStatus: '',
  materialId: undefined,
})
const queryFormRef = ref()
const exportLoading = ref(false)

/** 查询物料批次管理列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await MaterialBatchApi.getMaterialBatchPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await MaterialBatchApi.deleteMaterialBatchById(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 切换状态操作 */
const handleToggleStatus = async (id: number, currentStatus: boolean) => {
  try {
    const action = currentStatus ? '禁用' : '启用'
    const confirmText = `确定要${action}该批次配置吗？${currentStatus ? '禁用后将无法在业务中使用。' : '启用后可以正常使用。'}`
    
    // 状态切换的二次确认
    await message.confirm(confirmText, `${action}确认`)
    // 调用切换状态API
    await MaterialBatchApi.toggleMaterialBatchStatusById(id)
    message.success(`批次配置已${action}`)
    // 刷新列表
    await getList()
  } catch {}
}

/** 批量删除按钮操作 */
const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (rows: MaterialBatchApi.MaterialBatchDto[]) => {
  checkedIds.value = rows.map((row) => row.id)
}

const handleDeleteBatch = async () => {
  try {
    await message.delConfirm()
    // 发起批量删除
    await MaterialBatchApi.deleteMaterialBatchByIds(checkedIds.value)
    checkedIds.value = []
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await MaterialBatchApi.exportMaterialBatch(queryParams)
    download.excel(data, '物料批次管理.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const getMaterialList = async () => {
  try {
    const result = await MaterialApi.listOfMaterial({materialStatus: 'A'} as any)
    materialList.value = result || []
  } catch (error) {
    console.error('获取仓库类型列表失败:', error)
    materialList.value = []
  }
}

const listOfStatus = async () => {
  try {
    const result = await MaterialBatchApi.listOfStatus()
    materialBatchStatusList.value = result || []
  } catch (error) {
    console.error('获取仓库类型列表失败:', error)
    materialBatchStatusList.value = []
  }
}

const listOfBatchRule = async () => {
  try {
    const result = await MaterialBatchApi.listOfBatchRule()
    materialBatchRuleList.value = result || []
  } catch (error) {
    console.error('获取仓库类型列表失败:', error)
    materialBatchRuleList.value = []
  }
}

/** 初始化 **/
onMounted(() => {
  getMaterialList()
  listOfStatus()
  // listOfBatchRule()
  getList()
})
</script>
<style lang="scss" scoped>
/* 操作栏按钮样式 */
:deep(.el-button.btn-edit) {
  color: #0097BA;
  &:hover {
    color: rgba(0, 151, 186, 0.75);
  }
}

:deep(.el-button.btn-delete) {
  color: #D54941;
  &:hover {
    color: rgba(213, 73, 65, 0.75);
  }
}

:deep(.el-button.btn-other) {
  color: #A5D867;
  &:hover {
    color: rgba(165, 216, 103, 0.75);
  }
}

/* 物料选择下拉框样式 */
.material-option {
  padding: 4px 0;
  
  .material-code {
    font-weight: 500;
    color: #303133;
    font-size: 13px;
    line-height: 1.2;
  }
  
  .material-name {
    color: #606266;
    font-size: 12px;
    margin-top: 2px;
    line-height: 1.2;
  }
  
  .material-spec {
    color: #909399;
    font-size: 11px;
    margin-top: 2px;
    line-height: 1.2;
  }
}

/* 状态显示样式 */
.status-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.status-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  
  &.active {
    background-color: #0097BA;
    color: white;
    border: 2px solid #0097BA;
  }
  
  &.inactive {
    background-color: #F5F7FA;
    color: #C0C4CC;
    border: 2px solid #E4E7ED;
  }
}

.status-text {
  font-size: 14px;
  font-weight: 500;
  
  &.active {
    color: #0097BA;
  }
  
  &.inactive {
    color: #C0C4CC;
  }
}
</style>

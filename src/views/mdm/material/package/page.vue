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
      <el-form-item label="关联物料" prop="materialId">
        <el-select 
          v-model="queryParams.materialId" 
          placeholder="请选择物料"
          filterable
          clearable
          style="width: 240px">
          <el-option
            v-for="material in materialOptions"
            :key="material.id"
            :label="`${material.materialCode} - ${material.materialName}`"
            :value="material.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" />搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" />重置
        </el-button>
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
    <el-table v-loading="loading" :data="list" @selection-change="handleRowCheckboxChange" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column type="selection" width="55" />
      <el-table-column label="SKU / 物料名称" align="left" min-width="200">
        <template #default="scope">
          <div class="material-info">
            <div class="material-code">{{ scope.row.materialCode || scope.row.materialId }}</div>
            <div class="material-name">{{ scope.row.materialName || scope.row.packageName }}</div>
            <div class="material-desc" v-if="scope.row.description">{{ scope.row.description }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="包装层级 (从小到大)" align="left" min-width="220">
        <template #default="scope">
          <div class="package-levels">
            <div class="package-item" v-for="(level, index) in scope.row.packageLevels" :key="index">
              <el-icon class="package-icon">
                <Box />
              </el-icon>
              <span class="package-name">{{ level.unitType }}</span>
              <span class="package-spec" v-if="level.spec">({{ level.spec }})</span>
              <el-tag v-if="level.allowDisassemble" size="small" type="success">可拆</el-tag>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="默认单位" align="center" width="180">
        <template #default="scope">
          <div class="default-unit">
            <div v-if="scope.row.receiveUnit">收货: {{ scope.row.receiveUnit }}</div>
            <div v-if="scope.row.shipUnit">发货: {{ scope.row.shipUnit }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          label="更新时间"
          align="center"
          prop="updateTime"
          width="120"
          :formatter="dateFormatter"/>
      <el-table-column label="操作" align="center" min-width="160" fixed="right">
        <template #default="scope">
          <el-button
            link
            class="btn-other"
            @click="openDetail(scope.row.id)"
            v-hasPermi="['']">&nbsp;详情
          </el-button>
          <el-button
            link
            class="btn-edit"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['']">&nbsp;编辑
          </el-button>
          <el-button
            link
            class="btn-delete"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['']">&nbsp;删除
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
  <MaterialPackageForm ref="formRef" @success="getList" />
  <MaterialPackageDetail ref="detailRef" />
</template>
<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import * as MaterialPackageApi from '@/api/mdm/materialPackage'
import * as MaterialApi from '@/api/mdm/material'
import MaterialPackageForm from './form.vue'
import MaterialPackageDetail from './detail.vue'
import { Box } from '@element-plus/icons-vue'

defineOptions({ name: 'MaterialPackagePage' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const total = ref(0)
const list = ref<MaterialPackageApi.MaterialPackageDto[]>([])
// 物料选项数据
const materialOptions = ref<MaterialApi.MaterialDto[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  materialId: undefined as number | undefined
})
const queryFormRef = ref()
const exportLoading = ref(false)

/** 获取物料列表 */
const loadMaterialOptions = async () => {
  try {
    const query = {
      materialStatus: 'ACTIVE' // 只获取激活状态的物料
    } as MaterialApi.MaterialDto
    const data = await MaterialApi.listOfMaterial(query)
    materialOptions.value = data || []
  } catch (error) {
    console.error('获取物料列表失败:', error)
    materialOptions.value = []
  }
}

/** 查询物料包装层级主信息列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await MaterialPackageApi.getMaterialPackagePage(queryParams)
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
  queryFormRef.value?.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 查看详情操作 */
const detailRef = ref()
const openDetail = (id: number) => {
  detailRef.value.open(id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await MaterialPackageApi.deleteMaterialPackageById(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 批量删除按钮操作 */
const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (rows: MaterialPackageApi.MaterialPackageDto[]) => {
  checkedIds.value = rows.map((row) => row.id)
}

const handleDeleteBatch = async () => {
  try {
    await message.delConfirm()
    // 发起批量删除
    await MaterialPackageApi.deleteMaterialPackageByIds(checkedIds.value)
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
    const data = await MaterialPackageApi.exportMaterialPackage(queryParams)
    download.excel(data, '物料包装层级主信息.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  // 加载物料选项
  await loadMaterialOptions()
  // 获取列表数据
  await getList()
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

/* 物料信息样式 */
.material-info {
  text-align: left;
  
  .material-code {
    font-weight: 600;
    color: #303133;
    margin-bottom: 4px;
  }
  
  .material-name {
    color: #606266;
    font-size: 13px;
    margin-bottom: 2px;
  }
  
  .material-desc {
    color: #909399;
    font-size: 12px;
  }
}

/* 包装层级样式 */
.package-levels {
  .package-item {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .package-icon {
      margin-right: 6px;
      color: #409EFF;
    }
    
    .package-name {
      font-weight: 500;
      margin-right: 6px;
    }
    
    .package-spec {
      color: #909399;
      font-size: 12px;
      margin-right: 6px;
    }
  }
}

/* 默认单位样式 */
.default-unit {
  font-size: 12px;
  line-height: 1.4;
  
  div {
    margin-bottom: 2px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

/* 表格行样式调整 */
:deep(.el-table .el-table__row) {
  .el-table__cell {
    padding: 12px 0;
  }
}
</style>

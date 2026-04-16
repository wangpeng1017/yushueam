<template>
  <ContentWrap>
    <el-row :gutter="16">
      <!-- 左侧树 -->
      <el-col :span="5">
        <el-card shadow="never" style="height: calc(100vh - 180px)">
          <el-input
            v-model="treeFilterText"
            placeholder="搜索分类"
            clearable
            class="mb-10px"
            prefix-icon="Search"
          />
          <el-tree
            ref="treeRef"
            :data="treeData"
            :props="treeProps"
            :node-key="treeNodeKey"
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
            highlight-current
            default-expand-all
            @node-click="handleTreeNodeClick"
          />
        </el-card>
      </el-col>

      <!-- 右侧列表 -->
      <el-col :span="19">
        <!-- 搜索工作栏 -->
        <el-card shadow="never" class="mb-10px">
          <el-form
            class="-mb-15px"
            :model="queryParams"
            ref="queryFormRef"
            :inline="true"
            label-width="80px"
          >
            <el-form-item label="备件编号" prop="number">
              <el-input
                v-model="queryParams.number"
                class="!w-200px"
                clearable
                placeholder="请输入备件编号"
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="备件名称" prop="name">
              <el-input
                v-model="queryParams.name"
                class="!w-200px"
                clearable
                placeholder="请输入备件名称"
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="规格型号" prop="specification">
              <el-input
                v-model="queryParams.specification"
                class="!w-200px"
                clearable
                placeholder="请输入规格型号"
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button @click="handleQuery">
                <Icon icon="ep:search" class="mr-5px" />&nbsp;搜索
              </el-button>
              <el-button @click="resetQuery">
                <Icon icon="ep:refresh" class="mr-5px" />&nbsp;重置
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 列表 -->
        <el-card shadow="never">
          <div class="mb-10px">
            <el-button
              v-hasPermi="[PERMI.CREATE]"
              plain
              type="primary"
              @click="openForm('create')"
            >
              <Icon class="mr-5px" icon="ep:plus" />&nbsp;新增
            </el-button>
          </div>
          
          <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column label="备件编号" align="center" prop="number"  />
            <el-table-column label="备件名称" align="center" prop="name"  />
            <el-table-column label="规格型号" align="center" prop="specification"  />
            <el-table-column label="基础单位" align="center" prop="unitName"  />
            <el-table-column label="备件类型" align="center" prop="materialGroupName" />
            <el-table-column label="实际库存" align="center" prop="actualStock" width="90">
              <template #default="scope">
                <span :class="{ 'text-red-500 font-bold': scope.row.actualStock <= scope.row.minStock }">
                  {{ scope.row.actualStock ?? '--' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="最高储备" align="center" prop="maxStock" width="90" />
            <el-table-column label="最低储备" align="center" prop="minStock" width="90" />
            <el-table-column label="库存状态" align="center" width="90">
              <template #default="scope">
                <el-tag v-if="scope.row.actualStock != null && scope.row.minStock != null && scope.row.actualStock <= scope.row.minStock" type="danger" size="small">预警</el-tag>
                <el-tag v-else-if="scope.row.actualStock != null" type="success" size="small">正常</el-tag>
                <el-tag v-else type="info" size="small">未设置</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="关联设备" align="center" prop="relatedEquipment" min-width="120" />
            <el-table-column label="操作" align="center"  fixed="right">
              <template #default="scope">
                <el-button
                  link
                  class="btn-edit"
                  v-hasPermi="[PERMI.UPDATE]"
                  @click="openForm('update', scope.row.id)"
                >
                  &nbsp;编辑
                </el-button>
                <!-- <el-button
                  link
                  class="btn-other"
                  v-hasPermi="[PERMI.QUERY]"
                  @click="openDetail(scope.row)"
                >
                  &nbsp;查看
                </el-button> -->
                <el-button
                  link
                  class="btn-delete"
                  v-hasPermi="[PERMI.DELETE]"
                  @click="handleDelete(scope.row.id)"
                >
                  &nbsp;删除
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
        </el-card>
      </el-col>
    </el-row>
  </ContentWrap>

  <!-- 新增/编辑弹窗 -->
  <SparePartSearchForm ref="formRef" @success="getList" />
  <!-- 详情弹窗 -->
  <SparePartSearchDetail ref="detailRef" />
</template>

<script lang="ts" setup>
import * as SparePartSearchApi from '@/api/eam/sparePartSearch'
import SparePartSearchDetail from './detail.vue'
import SparePartSearchForm from './form.vue'
import { listToTree } from '@/utils/tree'

defineOptions({ name: 'EamSparePartSearch' })

const message = useMessage()
const { t } = useI18n()

// ==================== 权限标识集中定义 ====================
const PERMI = {
  CREATE: 'eam:sparePartSearch:create',
  UPDATE: 'eam:sparePartSearch:update',
  DELETE: 'eam:sparePartSearch:delete',
  QUERY: 'eam:sparePartSearch:query'
}

// ==================== 左侧树相关 ====================
const treeRef = ref()
const treeData = ref<SparePartSearchApi.SparePartTreeNode[]>([])
const treeFilterText = ref('')
const selectedTreeNode = ref<string>('')

// 树配置（兼容两种数据结构）
const treeProps = ref({
  label: 'classifName',
  children: 'children'
})
const treeNodeKey = ref('code')

/** 加载树数据 */
const loadTreeData = async () => {
  try {
    const res = await SparePartSearchApi.getSparePartTreeList()
    
    // 判断返回的数据结构，自动适配
    if (res && res.length > 0) {
      const firstNode = res[0]
      if (firstNode.classifName !== undefined) {
        // 使用备件分类结构
        treeProps.value = { label: 'classifName', children: 'children' }
        treeNodeKey.value = 'id'
        treeData.value = listToTree(res.filter((item) => item.status === 'ON') ?? [], {
          id: 'id',
          children: 'children',
          pid: 'classifParentId'
        })
        treeData.value.unshift({ id: '', classifName: '全部' })
      } else {
        // 使用物料分组树结构（code/title）
        treeProps.value = { label: 'title', children: 'children' }
        treeNodeKey.value = 'code'
        treeData.value = res ?? []
      }
    } else {
      treeData.value = []
    }
  } catch (error) {
    console.error('加载备件分类树失败:', error)
    treeData.value = []
  }
}

/** 树节点过滤 */
const filterNode = (value: string, data: any) => {
  if (!value) return true
  const labelField = treeProps.value.label
  return data[labelField]?.includes(value) || false
}

/** 树节点点击 */
const handleTreeNodeClick = (data: SparePartSearchApi.SparePartTreeNode) => {
  // 根据树节点的数据结构获取对应的key
  const nodeKey = data.code || data.id || ''
  selectedTreeNode.value = nodeKey
  queryParams.materialGroupId = nodeKey
  queryParams.pageNo = 1
  getList()
}

/** 监听搜索框变化 */
watch(treeFilterText, (val) => {
  treeRef.value?.filter(val)
})

// ==================== 列表相关 ====================
const loading = ref(true)
const total = ref(0)
const list = ref<SparePartSearchApi.SparePartSearchDto[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  number: undefined as string | undefined,
  name: undefined as string | undefined,
  specification: undefined as string | undefined,
  materialGroupId: undefined as string | undefined
})
const queryFormRef = ref()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const res = await SparePartSearchApi.getSparePartList(queryParams)
    list.value = res.records ?? []
    total.value = res.total ?? 0
  } finally {
    loading.value = false
  }
}

/** 搜索 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  selectedTreeNode.value = ''
  queryParams.materialGroupId = undefined
  // 清除树的选中状态
  treeRef.value?.setCurrentKey(null)
  handleQuery()
}

// ==================== 详情 ====================
const detailRef = ref()
const openDetail = (record: SparePartSearchApi.SparePartSearchDto) => {
  detailRef.value.open(record)
}

// ==================== 新增/编辑 ====================
const formRef = ref()
const openForm = (type: string, id?: string) => {
  formRef.value.open(type, id)
}

// ==================== 删除 ====================
const handleDelete = async (id: string) => {
  try {
    await message.delConfirm()
    await SparePartSearchApi.deleteSparePart(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

// ==================== 初始化 ====================
onMounted(() => {
  loadTreeData()
  getList()
})
</script>

<style lang="scss" scoped>
:deep(.el-button.btn-edit) {
  color: #0097ba;

  &:hover {
    color: rgb(0 151 186 / 75%);
  }
}

:deep(.el-button.btn-delete) {
  color: #d54941;

  &:hover {
    color: rgb(213 73 65 / 75%);
  }
}

:deep(.el-button.btn-other) {
  color: #a5d867;

  &:hover {
    color: rgb(165 216 103 / 75%);
  }
}

:deep(.el-card__body) {
  padding: 15px;
}
</style>

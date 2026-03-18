<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="800px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="备件编号" prop="number">
            <el-input v-model="formData.number" placeholder="请输入备件编号" maxlength="50" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备件名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入备件名称" maxlength="100" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="规格型号" prop="specification">
            <el-input v-model="formData.specification" placeholder="请输入规格型号" maxlength="100" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="基础单位" prop="unitName">
            <el-input v-model="formData.unitName" placeholder="请输入基础单位" maxlength="20" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="备件类型" prop="materialGroupId">
            <el-tree-select
              v-model="formData.materialGroupId"
              :data="treeData"
              :props="treeProps"
              :node-key="treeNodeKey"
              check-strictly
              filterable
              placeholder="请选择备件类型"
              clearable
              class="!w-full"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm" :loading="submitLoading">确定</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import * as SparePartSearchApi from '@/api/eam/sparePartSearch'
import { listToTree } from '@/utils/tree'

defineOptions({ name: 'SparePartSearchForm' })

const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formType = ref('')
const submitLoading = ref(false)
const formRef = ref()

// 树数据
const treeData = ref<SparePartSearchApi.SparePartTreeNode[]>([])
const treeProps = ref({
  label: 'title',
  children: 'children'
})
const treeNodeKey = ref('code')

const formData = ref<any>({
  id: undefined,
  number: '',
  name: '',
  specification: '',
  unitName: '',
  materialGroupNumber: ''
})

const formRules = {
  number: [{ required: true, message: '请输入备件编号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入备件名称', trigger: 'blur' }],
  specification: [{ required: true, message: '请输入规格型号', trigger: 'blur' }],
  unitName: [{ required: true, message: '请输入基础单位', trigger: 'blur' }],
  materialGroupId: [{ required: true, message: '请选择备件类型', trigger: 'blur' }]
}

/** 加载树数据 */
const loadTreeData = async () => {
  try {
    const res = await SparePartSearchApi.getSparePartTreeList()
    
    if (res && res.length > 0) {
      const firstNode = res[0]
      if (firstNode.classifName !== undefined) {
        treeProps.value = { label: 'classifName', children: 'children' }
        treeNodeKey.value = 'id'
        treeData.value = listToTree(res ?? [], {
          id: 'id',
          children: 'children',
          pid: 'classifParentId'
        })
      } else {
        treeProps.value = { label: 'title', children: 'children' }
        treeNodeKey.value = 'code'
        treeData.value = res ?? []
      }
    }
  } catch (error) {
    console.error('加载备件分类树失败:', error)
  }
}

/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  dialogVisible.value = true
  formType.value = type
  dialogTitle.value = type === 'create' ? '新增备件' : '编辑备件'
  resetForm()
  
  // 加载树数据
  await loadTreeData()
  
  // 如果是编辑，加载详情
  if (id && type === 'update') {
    try {
      const data = await SparePartSearchApi.getSparePartById(id)
      formData.value = {
        ...data
      }
    } catch (error) {
      console.error('加载备件详情失败:', error)
    }
  }
}

/** 提交表单 */
const submitForm = async () => {
  const valid = await formRef.value.validate()
  if (!valid) return

  submitLoading.value = true
  try {
    const data = { ...formData.value }
    
    if (formType.value === 'create') {
      await SparePartSearchApi.createSparePart(data)
      message.success('新增成功')
    } else {
      await SparePartSearchApi.updateSparePart(data)
      message.success('编辑成功')
    }
    
    dialogVisible.value = false
    emit('success')
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    submitLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    number: '',
    name: '',
    specification: '',
    unitName: '',
    materialGroupNumber: ''
  }
  formRef.value?.resetFields()
}

const emit = defineEmits(['success'])
defineExpose({ open })
</script>

<style lang="scss" scoped>
</style>

<!-- Author [陈建峰],  Since 2026-01-19 16:47:27,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="800">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属仓库" prop="warehouseId">
            <!-- <el-input v-model="formData.warehouseId" placeholder="请输入所属仓库" /> -->
            <el-select v-model="formData.warehouseId" placeholder="请选择所属仓库" clearable>
              <el-option
                v-for="warehouse in warehouseList"
                :key="warehouse.id"
                :label="warehouse.warehouseName"
                :value="warehouse.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库区状态" prop="status">
            <el-select
               v-model="formData.status"
               placeholder="请选择库区状态"
               clearable>
               <el-option
                v-for="wareshouseStatus in warehouseAreaStatusList"
                  :key="wareshouseStatus.value" :label="wareshouseStatus.text" :value="wareshouseStatus.value"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>  
        <el-col :span="12">
          <el-form-item label="库区编码" prop="areaCode">
            <el-input v-model="formData.areaCode" placeholder="请输入库区编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库区名称" prop="areaName">
            <el-input v-model="formData.areaName" placeholder="请输入库区名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="库区类型" prop="areaType">
            <el-select
               v-model="formData.areaType"
               placeholder="请选择仓库类型"
               clearable>
               <el-option
                v-for="warehouseType in warehouseAreaTypeList"
                  :key="warehouseType.value" :label="warehouseType.text" :value="warehouseType.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="ABC分类" prop="abcClass">
            <el-select
               v-model="formData.abcClass"
               placeholder="请选择ABC分类"
               clearable>
              <el-option
                v-for="abcClass in warehouseAbcClassList"
                  :key="abcClass.value" :label="abcClass.text" :value="abcClass.value"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="库区属性" prop="areaAttributes">
            <el-select
              v-model="formData.areaAttributes"
              allow-create
              filterable
              multiple
              placeholder="请输入库区属性"
              style="width: 100%">
              <el-option
                v-for="areaAttribute in formData.areaAttributes"
                :key="areaAttribute"
                :label="areaAttribute"
                :value="areaAttribute"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="描述" prop="description">
            <el-input type="textarea" v-model="formData.description" placeholder="请输入描述" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm"><Icon icon="ep:check" class="mr-5px" />确 定</el-button>
      <el-button @click="dialogVisible = false"><Icon icon="ep:close" class="mr-5px" />取 消</el-button>
    </template>
  </Dialog>

</template>
<script lang="ts" setup>
import * as WarehouseAreaApi from '@/api/mdm/warehouse/area'
import * as WarehouseApi from '@/api/mdm/warehouse'

defineOptions({ name: 'WarehouseAreaForm' })

const { t } = useI18n()
const message = useMessage()

const warehouseAreaStatusList = ref<EnumEntityOption[]>([])
const warehouseAreaTypeList = ref<EnumEntityOption[]>([])
const warehouseAbcClassList = ref<EnumEntityOption[]>([])
const warehouseList = ref<WarehouseApi.WarehouseDto[]>([])


const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formData = ref({
  id: undefined,
  factoryId: undefined,
  warehouseId: undefined,
  areaCode: '',
  areaName: '',
  abcClass: '',
  areaType: '',
  status: undefined,
  areaAttributes: [],
  description: '',
})
const formRules = reactive({
  factoryId: [],
  warehouseId: [
      {
        required: true,
        message: '请输入所属仓库',
        trigger: 'blur'
      }
  ],
  areaCode: [
      {
        required: true,
        message: '请输入库区编码',
        trigger: 'blur'
      },
      {
        max: 32,
        min: 1,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  areaName: [
      {
        required: true,
        message: '请输入库区名称',
        trigger: 'blur'
      },
      {
        max: 64,
        min: 1,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  abcClass: [
      {
        max: 1,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  areaType: [
      {
        required: true,
        message: '请输入库区类型',
        trigger: 'blur'
      }
  ],
  status: [
      {
        required: true,
        message: '请输入状态',
        trigger: 'blur'
      },
  ],
  areaAttributes: [
      // {
      //   max: 128,
      //   message: "输入字符长度不合规",
      //   trigger: 'blur'
      // }
  ],
  description: [
      {
        max: 255,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
})
const formRef = ref()
const emit = defineEmits(['success'])

const submitForm = async () => {
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  formLoading.value = true
  try {
    if (formType.value === 'create') {
      const data = formData.value as unknown as WarehouseAreaApi.WarehouseAreaSaveDto
      await WarehouseAreaApi.createWarehouseArea(data)
      message.success(t('common.createSuccess'))
    } else {
      const data = formData.value as unknown as WarehouseAreaApi.WarehouseAreaUpdateDto
      await WarehouseAreaApi.updateWarehouseArea(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    factoryId: undefined,
    warehouseId: undefined,
    areaCode: '',
    areaName: '',
    abcClass: '',
    areaType: '',
    status: undefined,
    areaAttributes: [],
    description: '',
  } as any
  formRef.value?.resetFields()
}

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
        formData.value = await WarehouseAreaApi.getWarehouseAreaById(id)
    } finally {
        formLoading.value = false
    }
  }
}

const getWarehouseAreaTypeList = async () => {
  try {
    const result = await WarehouseAreaApi.listOfAreaType()
    warehouseAreaTypeList.value = result || []
  } catch (error) {
    console.error('获取仓库类型列表失败:', error)
    warehouseAreaTypeList.value = []
  }
}

const getWarehouseAreaStatusList = async () => {
  try {
    const result = await WarehouseAreaApi.listOfStatus()
    warehouseAreaStatusList.value = result || []
  } catch (error) {
    console.error('获取仓库状态列表失败:', error)
    warehouseAreaStatusList.value = []
  }
}

const getWarehouseAbcClassList = async () => {
  try {
    const result = await WarehouseAreaApi.listOfAbcClass()
    warehouseAbcClassList.value = result || []
  } catch (error) {
    console.error('获取ABC分类列表失败:', error)
    warehouseAbcClassList.value = []
  }
}

const getWarehouseList = async () => {
  try {
    const result = await WarehouseApi.listOfWarehouse({ status: true } as any)
    warehouseList.value = result || []
  } catch (error) {
    console.error('获取仓库列表失败:', error)
    warehouseList.value = []
  }
}

onMounted(() => {
  getWarehouseAreaTypeList()
  getWarehouseAreaStatusList()
  getWarehouseAbcClassList()
  getWarehouseList()
})

defineExpose({ open })

</script>
<style lang="scss" scoped>
</style>

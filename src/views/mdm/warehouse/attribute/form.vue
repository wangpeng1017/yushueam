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
          <el-form-item label="属性名称" prop="attributeName">
            <el-input v-model="formData.attributeName" placeholder="请输入属性名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="最大存储" prop="maxStorageCapacity">
            <el-input-number 
              v-model="formData.maxStorageCapacity" 
              :max="99999999.99"
              :precision="2"
              :controls="false"
              placeholder="请输入最大存储容量"
              style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="盘点周期" prop="inventoryCyclePeriod">
            <el-select
               v-model="formData.inventoryCyclePeriod"
               placeholder="请选择盘点周期"
               filterable
               clearable>
              <el-option
                v-for="wareshouseStatus in checkCyclePeriodList"
                  :key="wareshouseStatus.value" :label="wareshouseStatus.text" :value="wareshouseStatus.value"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="温控与环境" prop="storageEnvironment">
            <el-select
               v-model="formData.storageEnvironment"
               placeholder="请选择温控与环境"
               filterable
               multiple
               clearable>
              <el-option
                v-for="wareshouseStatus in storageEnvironmentList"
                  :key="wareshouseStatus.value" :label="wareshouseStatus.text" :value="wareshouseStatus.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="存储偏好" prop="storageUnitPreference">
            <el-select
              v-model="formData.storageUnitPreference"
              allow-create
              filterable
              multiple
              placeholder="请输入存储单位偏好"
              style="width: 100%">
              <el-option
                v-for="preference in formData.storageUnitPreference"
                :key="preference"
                :label="preference"
                :value="preference"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="库存周转" prop="inventoryTurnoverFeature">
            <el-select
               v-model="formData.inventoryTurnoverFeature"
               placeholder="请选择库存周转特征"
               filterable
               clearable>
              <el-option
                v-for="wareshouseStatus in turnoverFeatureList"
                  :key="wareshouseStatus.value" :label="wareshouseStatus.text" :value="wareshouseStatus.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="消防等级" prop="fireSafetyLevel">
            <el-select
               v-model="formData.fireSafetyLevel"
               placeholder="请选择消防等级"
               filterable
               clearable>
              <el-option
                v-for="wareshouseStatus in fireSafetyLevelList"
                  :key="wareshouseStatus.value" :label="wareshouseStatus.text" :value="wareshouseStatus.value"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="清洁度等级" prop="cleanlinessLevel">
            <el-select
               v-model="formData.cleanlinessLevel"
               placeholder="请选择清洁度等级"
               filterable
               clearable>
              <el-option
                v-for="wareshouseStatus in cleanlinessLevelList"
                  :key="wareshouseStatus.value" :label="wareshouseStatus.text" :value="wareshouseStatus.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="安全等级" prop="securityLevel">
            <el-select
               v-model="formData.securityLevel"
               placeholder="请选择安全等级"
               filterable
               clearable>
              <el-option
                v-for="wareshouseStatus in securityLevelList"
                  :key="wareshouseStatus.value" :label="wareshouseStatus.text" :value="wareshouseStatus.value"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="作业模式" prop="operationMode">
            <el-select
              v-model="formData.operationMode"
              allow-create
              filterable
              multiple
              placeholder="请输入作业模式"
              style="width: 100%">
              <el-option
                v-for="mode in formData.operationMode"
                :key="mode"
                :label="mode"
                :value="mode"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="作业时间" prop="operationTime">
            <el-input v-model="formData.operationTime" placeholder="请输入作业时间" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="物料类型" prop="materialType">
            <el-select
              v-model="formData.materialType"
              allow-create
              filterable
              multiple
              placeholder="请输入物料类型"
              style="width: 100%">
              <el-option
                v-for="type in formData.materialType"
                :key="type"
                :label="type"
                :value="type"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="描述" prop="description">
            <el-input 
              type="textarea" 
              v-model="formData.description" 
              placeholder="请输入描述"
              maxlength="255"
              show-word-limit
              :rows="3" />
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
import * as WarehouseApi from '@/api/mdm/warehouse'
import * as WarehouseAttributeApi from '@/api/mdm/warehouse/attribute'

defineOptions({ name: 'WarehouseAttributeForm' })

const { t } = useI18n()
const message = useMessage()

const warehouseList = ref<WarehouseApi.WarehouseDto[]>([])
const checkCyclePeriodList = ref<EnumEntityOption[]>([])
const cleanlinessLevelList = ref<EnumEntityOption[]>([])
const fireSafetyLevelList = ref<EnumEntityOption[]>([])
const securityLevelList = ref<EnumEntityOption[]>([])
const turnoverFeatureList = ref<EnumEntityOption[]>([])
const storageEnvironmentList = ref<EnumEntityOption[]>([])

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formData = ref({
  id: undefined,
  warehouseId: '',
  attributeName: '',
  storageEnvironment: [],
  storageUnitPreference: [],
  materialType: [],
  inventoryTurnoverFeature: '',
  cleanlinessLevel: '',
  securityLevel: '',
  operationMode: [],
  operationTime: '',
  maxStorageCapacity: undefined,
  inventoryCyclePeriod: '',
  fireSafetyLevel: '',
  deptId: undefined,
  description: '',
})
const formRules = reactive({
  warehouseId: [
      {
        required: true,
        message: '请输入关联仓库',
        trigger: 'blur'
      }
  ],
  attributeName: [
      {
        required: true,
        message: '请输入属性名称',
        trigger: 'blur'
      },
      {
        max: 64,
        min: 1,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  storageEnvironment: [
  ],
  storageUnitPreference: [
  ],
  materialType: [
  ],
  inventoryTurnoverFeature: [
      {
        max: 1,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  cleanlinessLevel: [
      {
        max: 1,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  securityLevel: [
      {
        max: 1,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  operationMode: [
  ],
  operationTime: [
      {
        max: 32,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  maxStorageCapacity: [
  ],
  inventoryCyclePeriod: [
      {
        max: 1,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  fireSafetyLevel: [
      {
        max: 1,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  deptId: [
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
      const data = formData.value as unknown as WarehouseAttributeApi.WarehouseAttributeSaveDto
      await WarehouseAttributeApi.createWarehouseAttribute(data)
      message.success(t('common.createSuccess'))
    } else {
      const data = formData.value as unknown as WarehouseAttributeApi.WarehouseAttributeUpdateDto
      await WarehouseAttributeApi.updateWarehouseAttribute(data)
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
    warehouseId: '',
    attributeName: '',
    storageEnvironment: [],
    storageUnitPreference: [],
    materialType: [],
    inventoryTurnoverFeature: '',
    cleanlinessLevel: '',
    securityLevel: '',
    operationMode: [],
    operationTime: '',
    maxStorageCapacity: undefined,
    inventoryCyclePeriod: '',
    fireSafetyLevel: '',
    deptId: undefined,
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
        formData.value = await WarehouseAttributeApi.getWarehouseAttributeById(id)
    } finally {
        formLoading.value = false
    }
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

const getCheckCyclePeriodList = async () => {
  try {
    const result = await WarehouseAttributeApi.listOfCheckCyclePeriod()
    checkCyclePeriodList.value = result || []
  } catch (error) {
    console.error('获取存储等级列表失败:', error)
    checkCyclePeriodList.value = []
  }
}

const getCleanlinessLevelList = async () => {
  try {
    const result = await WarehouseAttributeApi.listOfCleanlinessLevel()
    cleanlinessLevelList.value = result || []
  } catch (error) {
    console.error('获取清洁度等级列表失败:', error)
    cleanlinessLevelList.value = []
  }
}

const getFireSafetyLevelList = async () => {
  try {
    const result = await WarehouseAttributeApi.listOfFireSafetyLevel()
    fireSafetyLevelList.value = result || []
  } catch (error) {
    console.error('获取防火安全等级列表失败:', error)
    fireSafetyLevelList.value = []
  }
}

const getSecurityLevelList = async () => {
  try {
    const result = await WarehouseAttributeApi.listOfSecurityLevel()
    securityLevelList.value = result || []
  } catch (error) {
    console.error('获取安全等级列表失败:', error)
    securityLevelList.value = []
  }
}

const getTurnoverFeatureList = async () => {
  try {
    const result = await WarehouseAttributeApi.listOfTurnoverFeature()
    turnoverFeatureList.value = result || []
  } catch (error) {
    console.error('获取库存周转特征列表失败:', error)
    turnoverFeatureList.value = []
  }
}

const getStorageTypeList = async () => {
  try {
    const result = await WarehouseApi.listOfStorageType()
    storageEnvironmentList.value = result || []
  } catch (error) {
    console.error('获取存储类型列表失败:', error)
    storageEnvironmentList.value = []
  }
}



defineExpose({ open })

onMounted(() => {
  getWarehouseList()
  getCheckCyclePeriodList()
  getCleanlinessLevelList()
  getFireSafetyLevelList()
  getSecurityLevelList()
  getTurnoverFeatureList()
  getStorageTypeList()
})

</script>
<style lang="scss" scoped>
</style>

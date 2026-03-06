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
          <el-form-item label="所属库区" prop="areaId">
            <el-select v-model="formData.areaId" placeholder="请选择所属库区" clearable>
              <el-option
                v-for="area in warehouseAreaList"
                :key="area.id"
                :label="area.areaName"
                :value="area.id"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="库位编码" prop="locationCode">
            <el-input v-model="formData.locationCode" placeholder="请输入库位编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库位名称" prop="locationName">
            <el-input v-model="formData.locationName" placeholder="请输入库位名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="库位类型" prop="locationType">
            <el-select
               v-model="formData.locationType"
               placeholder="请选择库位类型"
               clearable>
              <el-option
                v-for="wareshouseStatus in warehouseLocationTypeList"
                  :key="wareshouseStatus.value" :label="wareshouseStatus.text" :value="wareshouseStatus.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select
               v-model="formData.status"
               placeholder="请选择状态"
               clearable>
              <el-option
                v-for="wareshouseStatus in warehouseLocationStatusList"
                  :key="wareshouseStatus.value" :label="wareshouseStatus.text" :value="wareshouseStatus.value"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="储位属性" prop="storageAttributes">
            <el-select
              v-model="formData.storageAttributes"
              allow-create
              filterable
              multiple
              placeholder="请输入储位属性"
              style="width: 100%">
              <el-option
                v-for="areaAttribute in formData.storageAttributes"
                :key="areaAttribute"
                :label="areaAttribute"
                :value="areaAttribute"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="最大容量" prop="maxCapacity">
            <el-input type="number" v-model="formData.maxCapacity" placeholder="请输入最大容量" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="最小容量" prop="minCapacity">
            <el-input type="number" v-model="formData.minCapacity" placeholder="请输入最小容量" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="拣选属性" prop="pickingType">
            <el-select
               v-model="formData.pickingType"
               placeholder="请选择拣选属性"
               clearable>
              <el-option
                v-for="wareshouseStatus in warehouseLocationPickingTypeList"
                  :key="wareshouseStatus.value" :label="wareshouseStatus.text" :value="wareshouseStatus.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="存储级别" prop="storageLevel">
            <el-select
               v-model="formData.storageLevel"
               placeholder="请选择拣选属性"
               clearable>
              <el-option
                v-for="wareshouseStatus in storageLevelList"
                  :key="wareshouseStatus.value" :label="wareshouseStatus.text" :value="wareshouseStatus.value"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="长度" prop="lengthMm">
            <el-input type="number" v-model="formData.lengthMm" placeholder="请输入长度" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="宽度" prop="widthMm">
            <el-input type="number" v-model="formData.widthMm" placeholder="请输入宽度" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="高度" prop="heightMm">
            <el-input type="number" v-model="formData.heightMm" placeholder="请输入高度" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="承重" prop="loadCapacityKg">
            <el-input type="number" v-model="formData.loadCapacityKg" placeholder="请输入承重" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="巷道" prop="aisle">
            <el-input type="number" v-model="formData.aisle" placeholder="请输入巷道" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="排" prop="rowW">
            <el-input type="number" v-model="formData.rowW" placeholder="请输入排" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item  label="列" prop="columnW">
            <el-input type="number" v-model="formData.columnW" placeholder="请输入列" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item  label="层" prop="level">
            <el-input type="number" v-model="formData.level" placeholder="请输入层" />
          </el-form-item>
        </el-col>
      </el-row>
<!--      <el-row>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item  label="X坐标" prop="xCoordinate">-->
<!--            <el-input type="number" v-model="formData.xCoordinate" placeholder="请输入X坐标" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item  label="Y坐标" prop="yCoordinate">-->
<!--            <el-input type="number"  v-model="formData.yCoordinate" placeholder="请输入Y坐标" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-form-item  label="Z坐标" prop="zCoordinate">-->
<!--            <el-input type="number"  v-model="formData.zCoordinate" placeholder="请输入Z坐标" />-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--      </el-row>-->
      <el-row>
        <el-col :span="12">
          <el-form-item label="启用日期" prop="enableDate">
            <el-date-picker
              v-model="formData.enableDate"
              type="datetime"
              placeholder="选择日期时间"
              style="width: 100%"
              :key="'enableDate'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="停用日期" prop="disableDate">
            <el-date-picker
              v-model="formData.disableDate"
              type="datetime"
              placeholder="选择日期时间"
              style="width: 100%"
              :key="'disableDate'"
            />
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
import * as WarehouseLocationApi from '@/api/mdm/warehouse/location'
import * as WarehouseAreaApi from '@/api/mdm/warehouse/area'
import * as WarehouseApi from '@/api/mdm/warehouse'

defineOptions({ name: 'WarehouseLocationForm' })

const { t } = useI18n()
const message = useMessage()

const warehouseList = ref<WarehouseApi.WarehouseDto[]>([])
const warehouseAreaList = ref<WarehouseAreaApi.WarehouseAreaDto[]>([])
const warehouseLocationStatusList = ref<EnumEntityOption[]>([])
const warehouseLocationTypeList = ref<EnumEntityOption[]>([])
const warehouseLocationPickingTypeList = ref<EnumEntityOption[]>([])
const storageLevelList = ref<EnumEntityOption[]>([])


const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formData = ref({
  id: undefined,
  factoryId: undefined,
  warehouseId: undefined,
  areaId: undefined,
  locationCode: '',
  locationName: '',
  locationType: '',
  status: undefined,
  storageAttributes: [],
  maxCapacity: undefined,
  minCapacity: undefined,
  lengthMm: undefined,
  widthMm: undefined,
  heightMm: undefined,
  loadCapacityKg: undefined,
  storageEnvironment: '',
  storageLevel: '',
  pickingType: '',
  aisle: '',
  rowW: '',
  columnW: '',
  level: '',
  xCoordinate: '',
  yCoordinate: '',
  zCoordinate: '',
  enableDate: undefined,
  disableDate: undefined,
  description: '',
})
const formRules = reactive({
  warehouseId: [
      {
        required: true,
        message: '请输入所属仓库',
        trigger: 'blur'
      }
  ],
  areaId: [
      {
        required: true,
        message: '请输入所属库区',
        trigger: 'blur'
      },
  ],
  locationCode: [
      {
        required: true,
        message: '请输入库位编码',
        trigger: 'blur'
      },
      {
        max: 32,
        min: 1,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  locationName: [
      {
        max: 64,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  locationType: [
      {
        required: true,
        message: '请输入库位类型',
        trigger: 'blur'
      }
  ],
  status: [
      {
        required: true,
        message: '请输入状态',
        trigger: 'blur'
      }
  ],
  storageAttributes: [],
  maxCapacity: [
  ],
  minCapacity: [
  ],
  lengthMm: [
  ],
  widthMm: [
  ],
  heightMm: [
  ],
  loadCapacityKg: [
  ],
  storageEnvironment: [
  ],
  storageLevel: [
  ],
  pickingType: [
  ],
  aisle: [
  ],
  row: [
  ],
  column: [
  ],
  level: [
  ],
  xCoordinate: [
  ],
  yCoordinate: [
  ],
  zCoordinate: [
  ],
  enableDate: [
  ],
  disableDate: [
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
    // 转换日期对象为时间戳格式
    const submitData = {
      ...formData.value,
      enableDate: formData.value.enableDate ? new Date(formData.value.enableDate).getTime() : undefined,
      disableDate: formData.value.disableDate ? new Date(formData.value.disableDate).getTime() : undefined
    }
    
    if(submitData.storageAttributes && submitData.storageAttributes.length > 0){
      // 处理储位属性
    }
    
    if (formType.value === 'create') {
      const data = submitData as unknown as WarehouseLocationApi.WarehouseLocationSaveDto
      await WarehouseLocationApi.createWarehouseLocation(data)
      message.success(t('common.createSuccess'))
    } else {
      const data = submitData as unknown as WarehouseLocationApi.WarehouseLocationUpdateDto
      await WarehouseLocationApi.updateWarehouseLocation(data)
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
    areaId: undefined,
    locationCode: '',
    locationName: '',
    locationType: '',
    status: undefined,
    storageAttributes: [],
    maxCapacity: undefined,
    minCapacity: undefined,
    lengthMm: undefined,
    widthMm: undefined,
    heightMm: undefined,
    loadCapacityKg: undefined,
    storageEnvironment: '',
    storageLevel: '',
    pickingType: '',
    aisle: '',
    row: '',
    column: '',
    level: '',
    xCoordinate: '',
    yCoordinate: '',
    zCoordinate: '',
    enableDate: undefined,
    disableDate: undefined,
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
        const data = await WarehouseLocationApi.getWarehouseLocationById(id)
        // 将时间戳转换为 Date 对象以便日期选择器显示
        formData.value = {
          ...data,
          enableDate: data.enableDate ? new Date(data.enableDate) : undefined,
          disableDate: data.disableDate ? new Date(data.disableDate) : undefined
        }
    } finally {
        formLoading.value = false
    }
  }
}

const getWarehouseLocationStatusList = async () => {
  try {
    const result = await WarehouseLocationApi.listOfLocationStatus()
    warehouseLocationStatusList.value = result || []
  } catch (error) {
    warehouseLocationStatusList.value = []
  }
}

const getWarehouseLocationTypeList = async () => {
  try {
    const result = await WarehouseLocationApi.listOfLocationType()
    warehouseLocationTypeList.value = result || []
  } catch (error) {
    console.error('获取仓库位置类型列表失败:', error)
    warehouseLocationTypeList.value = []
  }
}

const getWarehouseLocationPickingTypeList = async () => {
  try {
    const result = await WarehouseLocationApi.listOfPickingType()
    warehouseLocationPickingTypeList.value = result || []
  } catch (error) {
    console.error('获取仓库状态列表失败:', error)
    warehouseLocationPickingTypeList.value = []
  }
}

const getStorageLevelList = async () => {
  try {
    const result = await WarehouseLocationApi.listOfStorageLevel()
    storageLevelList.value = result || []
  } catch (error) {
    console.error('获取存储等级列表失败:', error)
    storageLevelList.value = []
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

const getWarehouseAreaList = async (warehouseId) => {
  try {
    const result = await WarehouseAreaApi.listOfWarehouseArea({ warehouseId: warehouseId, status: true } as any)
    warehouseAreaList.value = result || []
  } catch (error) {
    console.error('获取仓库区域列表失败:', error)
    warehouseAreaList.value = []
  }
}

// 监听仓库ID变化，自动加载对应的库区列表
watch(() => formData.value.warehouseId, (newWarehouseId) => {
  if (newWarehouseId) {
    getWarehouseAreaList(newWarehouseId)
  } else {
    warehouseAreaList.value = []
    formData.value.areaId = undefined
  }
})

defineExpose({ open })

onMounted(() => {
  getWarehouseLocationStatusList()
  getWarehouseLocationTypeList()
  getWarehouseLocationPickingTypeList();
  getStorageLevelList()
  getWarehouseList()
})

</script>
<style lang="scss" scoped>
</style>

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
          <el-form-item label="仓库编码" prop="warehouseCode">
            <el-input v-model="formData.warehouseCode" placeholder="请输入仓库编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仓库名称" prop="warehouseName">
            <el-input v-model="formData.warehouseName" placeholder="请输入仓库名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>    
        <el-col :span="12">
          <el-form-item label="仓库类型" prop="warehouseType">
            <el-select
               v-model="formData.warehouseType"
               placeholder="请选择仓库类型"
               clearable>
               <el-option
                v-for="warehouseType in warehouseTypeList"
                  :key="warehouseType.value" :label="warehouseType.text" :value="warehouseType.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="存储类型" prop="storageType">
            <el-select
               v-model="formData.storageType"
               placeholder="请选择存储类型"
               clearable>
              <el-option
                v-for="storageTypeOption in warehouseStorageTypeList"
                  :key="storageTypeOption.value" :label="storageTypeOption.text" :value="storageTypeOption.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仓库状态" prop="status">
            <el-select
               v-model="formData.status"
               placeholder="请选择仓库状态"
               clearable>
              <el-option
                v-for="statusOption in warehouseStatusList"
                  :key="statusOption.value" :label="statusOption.text" :value="statusOption.value"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="地址位置" prop="address">
            <el-input v-model="formData.address" placeholder="请输入地址位置" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="负责人姓名" prop="contactPerson">
            <el-input v-model="formData.contactPerson" placeholder="请输入负责人姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input v-model="formData.contactPhone" placeholder="请输入联系电话" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="仓库面积(m²)" prop="size">
            <el-input type="number" v-model="formData.size" placeholder="请输入仓库面积(m²)" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="仓库容积" prop="capacity">
            <el-input type="number" v-model="formData.capacity" placeholder="请输入仓库容积" />
          </el-form-item>
        </el-col>
      </el-row>
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
            <!-- <el-input type="date" v-model="formData.enableDate" placeholder="请输入启用日期" /> -->
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
            <!-- <el-input type="date" v-model="formData.disableDate" placeholder="请输入停用日期" /> -->
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
              maxlength="200"
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

// 引入 EnumEntityOption 类型定义
/// <reference path="../../utils/enumEntity.ts" />

// 由于三斜线指令无法直接使用类型，我们在这里重新定义类型
interface EnumEntityOption {
  value: string
  text: string
}

defineOptions({ name: 'WarehouseForm' })


const { t } = useI18n()
const message = useMessage()

const warehouseTypeList = ref<EnumEntityOption[]>([])
const warehouseStatusList = ref<EnumEntityOption[]>([])
const warehouseStorageTypeList = ref<EnumEntityOption[]>([])

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formData = ref({
  id: undefined,
  factoryId: undefined,
  warehouseCode: '',
  warehouseName: '',
  warehouseType: '',
  storageType: '',
  status: undefined,
  address: '',
  contactPerson: '',
  contactPhone: '',
  size: undefined,
  capacity: undefined,
  enableDate: undefined,
  disableDate: undefined,
  description: '',
})
const formRules = reactive({
  factoryId: [
      {
        max: 0,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  warehouseCode: [
      {
        required: true,
        message: '请输入仓库编码',
        trigger: 'blur'
      },
      {
        max: 32,
        min: 1,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  warehouseName: [
      {
        required: true,
        message: '请输入仓库名称',
        trigger: 'blur'
      },
      {
        max: 50,
        min: 1,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  warehouseType: [
      {
        required: true,
        message: '请输入仓库类型',
        trigger: 'blur'
      },
      {
        max: 1,
        min: 1,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  storageType: [
      {
        required: true,
        message: '请输入存储类型',
        trigger: 'blur'
      },
      {
        max: 1,
        min: 1,
        message: "输入字符长度不合规",
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
  address: [
      {
        required: true,
        message: '请输入地址位置',
        trigger: 'blur'
      },
      {
        max: 255,
        min: 1,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  contactPerson: [
      {
        max: 32,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  contactPhone: [
      {
        max: 32,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  size: [
      // {
      //   min: 1,
      //   message: "输入字符长度不合规",
      //   trigger: 'blur'
      // }
  ],
  capacity: [
      // {
      //   min: 1,
      //   message: "输入字符长度不合规",
      //   trigger: 'blur'
      // }
  ],
  enableDate: [
      // {
      //   max: 0,
      //   message: "输入字符长度不合规",
      //   trigger: 'blur'
      // }
  ],
  disableDate: [
      // {
      //   max: 0,
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
    // 转换日期对象为时间戳格式
    const submitData = {
      ...formData.value,
      enableDate: formData.value.enableDate ? new Date(formData.value.enableDate).getTime() : undefined,
      disableDate: formData.value.disableDate ? new Date(formData.value.disableDate).getTime() : undefined
    }
    
    if (formType.value === 'create') {
      const data = submitData as unknown as WarehouseApi.WarehouseSaveDto
      await WarehouseApi.createWarehouse(data)
      message.success(t('common.createSuccess'))
    } else {
      const data = submitData as unknown as WarehouseApi.WarehouseUpdateDto
      await WarehouseApi.updateWarehouse(data)
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
    warehouseCode: '',
    warehouseName: '',
    warehouseType: '',
    storageType: '',
    status: undefined,
    address: '',
    contactPerson: '',
    contactPhone: '',
    size: undefined,
    capacity: undefined,
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
        const data = await WarehouseApi.getWarehouseById(id)
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

const getWarehouseTypeList = async () => {
  try {
    const result = await WarehouseApi.listOfType()
    warehouseTypeList.value = result || []
  } catch (error) {
    console.error('获取仓库类型列表失败:', error)
    warehouseTypeList.value = []
  }
}

const getWarehouseStatusList = async () => {
  try {
    const result = await WarehouseApi.listOfStatus()
    warehouseStatusList.value = result || []
  } catch (error) {
    console.error('获取仓库状态列表失败:', error)
    warehouseStatusList.value = []
  }
}

const getWarehouseStorageTypeList = async () => {
  try {
    const result = await WarehouseApi.listOfStorageType()
    warehouseStorageTypeList.value = result || []
  } catch (error) {
    console.error('获取仓库存储类型列表失败:', error)
    warehouseStorageTypeList.value = []
  }
}

defineExpose({ open })

// 组件挂载时加载下拉列表数据
onMounted(() => {
  getWarehouseTypeList()
  getWarehouseStatusList()
  getWarehouseStorageTypeList()
})
</script>
<style lang="scss" scoped>
</style>

<!-- Author [陈建峰],  Since 2026-01-19 17:20:18,  Copyright (c) 2025-2026, chenjianfeng  -->
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
          <el-form-item label="关联主表ID" prop="packageId">
            <el-input v-model="formData.packageId" placeholder="请输入关联主表ID" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="单位类型，例如：单品(EA), 箱(Case), 托盘(Pallet)" prop="unitType">
            <el-select
               v-model="formData.unitType"
               placeholder="请选择单位类型，例如：单品(EA), 箱(Case), 托盘(Pallet)"
               clearable>
              <!--  <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.MATERIAL_MATERIALPACKAGEUNIT_UNITTYPE)"
                  :key="dict.value" :label="dict.label" :value="dict.value"/> -->
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="单位代码，例如：EA, CTN, PTL" prop="unitCode">
            <el-input v-model="formData.unitCode" placeholder="请输入单位代码，例如：EA, CTN, PTL" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="换算关系" prop="conversionRatio">
            <el-input v-model="formData.conversionRatio" placeholder="请输入换算关系" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="长(mm)，数值(小数)，>0" prop="lengthMm">
            <el-input v-model="formData.lengthMm" placeholder="请输入长(mm)，数值(小数)，>0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="宽(mm)，数值(小数)，>0" prop="widthMm">
            <el-input v-model="formData.widthMm" placeholder="请输入宽(mm)，数值(小数)，>0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="高(mm)，数值(小数)，>0" prop="heightMm">
            <el-input v-model="formData.heightMm" placeholder="请输入高(mm)，数值(小数)，>0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="重量(kg)，数值(小数)，>0" prop="weightKg">
            <el-input v-model="formData.weightKg" placeholder="请输入重量(kg)，数值(小数)，>0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="体积(m³)，数值(小数)，>0" prop="volumeM3">
            <el-input v-model="formData.volumeM3" placeholder="请输入体积(m³)，数值(小数)，>0" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="条码/标签类型" prop="barcodeType">
            <el-select
               v-model="formData.barcodeType"
               placeholder="请选择条码/标签类型"
               clearable>
              <!--  <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.MATERIAL_MATERIALPACKAGEUNIT_BARCODETYPE)"
                  :key="dict.value" :label="dict.label" :value="dict.value"/> -->
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否允许拆包" prop="allowDisassemble">
            <el-input v-model="formData.allowDisassemble" placeholder="请输入是否允许拆包" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否为默认收货包装" prop="isDefaultReceiving">
            <el-input v-model="formData.isDefaultReceiving" placeholder="请输入是否为默认收货包装" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否为默认发货包装" prop="isDefaultShipping">
            <el-input v-model="formData.isDefaultShipping" placeholder="请输入是否为默认发货包装" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="层级级别" prop="level">
            <el-input v-model="formData.level" placeholder="请输入层级级别" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="父级换算ID" prop="parentUnitId">
            <el-input v-model="formData.parentUnitId" placeholder="请输入父级换算ID" />
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
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { CommonStatusEnum } from '@/utils/constants'
import * as MaterialPackageUnitApi from '@/api/mdm/materialPackageUnit'

defineOptions({ name: 'MaterialPackageUnitForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formData = ref({
  id: undefined,
  packageId: '',
  unitType: '',
  unitCode: '',
  conversionRatio: undefined,
  lengthMm: undefined,
  widthMm: undefined,
  heightMm: undefined,
  weightKg: undefined,
  volumeM3: undefined,
  barcodeType: '',
  allowDisassemble: undefined,
  isDefaultReceiving: undefined,
  isDefaultShipping: undefined,
  level: undefined,
  parentUnitId: '',
  description: '',
})
const formRules = reactive({
  packageId: [
      {
        required: true,
        message: '请输入关联主表ID',
        trigger: 'blur'
      },
      {
        max: 128,
        min: 1,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  unitType: [
      {
        required: true,
        message: '请输入单位类型，例如：单品(EA), 箱(Case), 托盘(Pallet)',
        trigger: 'blur'
      },
      {
        max: 32,
        min: 1,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  unitCode: [
      {
        required: true,
        message: '请输入单位代码，例如：EA, CTN, PTL',
        trigger: 'blur'
      },
      {
        max: 32,
        min: 1,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  conversionRatio: [
      {
        required: true,
        message: '请输入换算关系',
        trigger: 'blur'
      },
      {
        max: 0,
        min: 1,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  lengthMm: [
      {
        max: 0,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  widthMm: [
      {
        max: 0,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  heightMm: [
      {
        max: 0,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  weightKg: [
      {
        max: 0,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  volumeM3: [
      {
        max: 0,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  barcodeType: [
      {
        max: 1,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  allowDisassemble: [
      {
        required: true,
        message: '请输入是否允许拆包',
        trigger: 'blur'
      },
      {
        max: 0,
        min: 1,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  isDefaultReceiving: [
      {
        required: true,
        message: '请输入是否为默认收货包装',
        trigger: 'blur'
      },
      {
        max: 0,
        min: 1,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  isDefaultShipping: [
      {
        required: true,
        message: '请输入是否为默认发货包装',
        trigger: 'blur'
      },
      {
        max: 0,
        min: 1,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  level: [
      {
        required: true,
        message: '请输入层级级别',
        trigger: 'blur'
      },
      {
        max: 0,
        min: 1,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
  ],
  parentUnitId: [
      {
        max: 128,
        message: "输入字符长度不合规",
        trigger: 'blur'
      }
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
      const data = formData.value as unknown as MaterialPackageUnitApi.MaterialPackageUnitSaveDto
      await MaterialPackageUnitApi.createMaterialPackageUnit(data)
      message.success(t('common.createSuccess'))
    } else {
      const data = formData.value as unknown as MaterialPackageUnitApi.MaterialPackageUnitUpdateDto
      await MaterialPackageUnitApi.updateMaterialPackageUnit(data)
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
    packageId: '',
    unitType: '',
    unitCode: '',
    conversionRatio: undefined,
    lengthMm: undefined,
    widthMm: undefined,
    heightMm: undefined,
    weightKg: undefined,
    volumeM3: undefined,
    barcodeType: '',
    allowDisassemble: undefined,
    isDefaultReceiving: undefined,
    isDefaultShipping: undefined,
    level: undefined,
    parentUnitId: '',
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
        formData.value = await MaterialPackageUnitApi.getMaterialPackageUnitById(id)
    } finally {
        formLoading.value = false
    }
  }
}

defineExpose({ open })

</script>
<style lang="scss" scoped>
</style>

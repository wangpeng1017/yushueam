<!-- Author [陈建峰],  Since 2026-01-19 16:46:12,  Copyright (c) 2025-2026, chenjianfeng  -->
<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="800">
    <div class="max-h-[600px] overflow-auto">
      <el-form
        ref="formRef"
        v-loading="formLoading"
        :model="formData"
        :rules="formRules"
        label-position="top"
      >
        <div class="flex flex-col gap-4">
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <span>基础信息</span>
              </div>
            </template>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="货主编码" prop="shipperCode">
                  <el-input
                    v-model="formData.shipperCode"
                    maxlength="20"
                    placeholder="请输入货主编码"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="货主名称" prop="shipperName">
                  <el-input
                    v-model="formData.shipperName"
                    maxlength="50"
                    placeholder="请输入货主名称"
                    show-word-limit
                  /> </el-form-item
              ></el-col>
              <el-col :span="12"
                ><el-form-item label="货主类型" prop="shipperType">
                  <el-select v-model="formData.shipperType" clearable placeholder="请选择货主类型">
                    <el-option
                      v-for="dict in getStrDictOptions(DICT_TYPE.COOPERPARTNERS_PUNTER)"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select> </el-form-item
              ></el-col>
              <el-col :span="12"
                ><el-form-item label="结算方式" prop="settlementMethod">
                  <el-select
                    v-model="formData.settlementMethod"
                    clearable
                    placeholder="请选择结算方式"
                  >
                    <el-option
                      v-for="dict in getStrDictOptions(DICT_TYPE.COOPERPARTNERS_PUNTER_SETTLEMENT)"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select> </el-form-item
              ></el-col>
            </el-row>
          </el-card>
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <span>联系与地址</span>
              </div>
            </template>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="业务联系人" prop="contactName">
                  <el-input
                    v-model="formData.contactName"
                    maxlength="50"
                    placeholder="请输入业务联系人"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系电话" prop="contactPhone">
                  <el-input v-model="formData.contactPhone" placeholder="请输入联系电话" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="收货地址" prop="deliveryAddress">
                  <el-input
                    v-model="formData.deliveryAddress"
                    maxlength="200"
                    placeholder="请输入收货地址"
                    show-word-limit
                    type="textarea"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <span>仓库与业务规则</span>
              </div>
            </template>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item prop="defaultWarehouseId">
                  <template #label>
                    <div class="flex items-center">
                      <span>专属/默认仓</span>
                      <el-tooltip
                        content="绑定后可实现库存的物理隔离建议"
                        effect="dark"
                        placement="top"
                      >
                        <Icon icon="ep:question-filled" />
                      </el-tooltip>
                    </div>
                  </template>
                  <el-select
                    v-model="formData.defaultWarehouseId"
                    clearable
                    filterable
                    placeholder="请输入专属/默认仓库"
                  >
                    <el-option
                      v-for="warehouse in warehouseOptions"
                      :key="warehouse.id"
                      :label="warehouse.warehouseName"
                      :value="warehouse.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <!--              <el-col :span="24">-->
              <!--                <el-form-item prop="enableSnTrace">-->
              <!--                  <div class="flex justify-between w-full rounded-2 p-2 switch_border items-center">-->
              <!--                    <div class="flex flex-col">-->
              <!--                      <span>启用序列号追溯</span>-->
              <!--                      <span class="text-zinc">是否要求该货主的出货物品必须扫码序列号</span>-->
              <!--                    </div>-->
              <!--                    <el-switch-->
              <!--                      v-model="formData.enableSnTrace"-->
              <!--                      class="ml-2"-->
              <!--                      style="&#45;&#45;el-switch-on-color: #13ce66; &#45;&#45;el-switch-off-color: #ff4949"-->
              <!--                    />-->
              <!--                  </div>-->
              <!--                </el-form-item>-->
              <!--              </el-col>-->
              <!--              <el-col :span="24">-->
              <!--                <el-form-item prop="useCustomTemplate">-->
              <!--                  <div class="flex justify-between w-full rounded-2 p-2 switch_border items-center">-->
              <!--                    <div class="flex flex-col">-->
              <!--                      <span>使用定制单据模板</span>-->
              <!--                      <span class="text-zinc">打印标签和单据时使用该货主专属格式</span>-->
              <!--                    </div>-->
              <!--                    <el-switch-->
              <!--                      v-model="formData.useCustomTemplate"-->
              <!--                      class="ml-2"-->
              <!--                      style="&#45;&#45;el-switch-on-color: #13ce66; &#45;&#45;el-switch-off-color: #ff4949"-->
              <!--                    />-->
              <!--                  </div>-->
              <!--                </el-form-item>-->
              <!--              </el-col>-->
            </el-row>
          </el-card>
        </div>
      </el-form>
    </div>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm"
        ><Icon class="mr-5px" icon="ep:check" />保存货主档案</el-button
      >
      <el-button @click="dialogVisible = false"
        ><Icon class="mr-5px" icon="ep:close" />取 消</el-button
      >
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'
import * as CooperpartnersPunterApi from '@/api/mdm/cooperpartners/punter'
import { listOfWarehouse, WarehouseDto } from '@/api/mdm/warehouse'

defineOptions({ name: 'CooperpartnersPunterForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formData = ref({
  id: undefined,
  shipperCode: '',
  shipperName: '',
  shipperType: '',
  settlementMethod: '',
  contactName: '',
  contactPhone: '',
  deliveryAddress: '',
  defaultWarehouseId: undefined
  // enableSnTrace: 0,
  // useCustomTemplate: 0
})
const formRules = reactive({
  shipperCode: [{ required: true, message: '请输入货主编码', trigger: 'blur' }],
  shipperName: [{ required: true, message: '请输入货主名称', trigger: 'blur' }],
  shipperType: [{ required: true, message: '请选择货主类型', trigger: 'blur' }],
  settlementMethod: [{ required: true, message: '请选择结算方式', trigger: 'blur' }],
  contactName: [{ required: true, message: '请输入业务联系人', trigger: 'blur' }],
  contactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  deliveryAddress: [{ required: true, message: '请输入收货地址', trigger: 'blur' }],
  defaultWarehouseId: [{ required: true, message: '请输入专属/默认仓库', trigger: 'blur' }]
  // enableSnTrace: [{ required: true, message: '请选择是否启用序列号追溯', trigger: 'blur' }],
  // useCustomTemplate: [{ required: true, message: '请选择是否使用定制单据模板', trigger: 'blur' }]
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
      const data = formData.value as unknown as CooperpartnersPunterApi.CooperpartnersPunterSaveDto
      await CooperpartnersPunterApi.createCooperpartnersPunter(data)
      message.success(t('common.createSuccess'))
    } else {
      const data =
        formData.value as unknown as CooperpartnersPunterApi.CooperpartnersPunterUpdateDto
      await CooperpartnersPunterApi.updateCooperpartnersPunter(data)
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
    shipperCode: '',
    shipperName: '',
    shipperType: '',
    settlementMethod: '',
    contactName: '',
    contactPhone: '',
    deliveryAddress: '',
    defaultWarehouseId: undefined
    // enableSnTrace: 0,
    // useCustomTemplate: 0
  } as any
  formRef.value?.resetFields()
}

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  await getAllwarehouse()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await CooperpartnersPunterApi.getCooperpartnersPunterById(id)
      formData.value.defaultWarehouseId = formData.value.defaultWarehouseId
        ? parseInt(formData.value.defaultWarehouseId)
        : null
    } finally {
      formLoading.value = false
    }
  }
}

// 获取所有仓库列表
const warehouseOptions = ref<WarehouseDto[]>([])
const getAllwarehouse = async () => {
  warehouseOptions.value = await listOfWarehouse({} as WarehouseDto)
}

defineExpose({ open })
</script>
<style lang="scss" scoped>
:deep(.el-card) {
  .el-card__header {
    background: unset;
  }
  &:hover {
    box-shadow: unset;
  }
  .el-form-item__label {
    display: flex;
  }
}
.switch_border {
  border: 1px solid #dedede;
}
</style>

<!-- Author [陈建峰],  Since 2026-01-20 15:37:08,  Copyright (c) 2025-2026, chenjianfeng  -->
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
                <el-form-item label="供应商编码" prop="supplierCode">
                  <el-input
                    v-model="formData.supplierCode"
                    maxlength="20"
                    placeholder="请输入供应商编码"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="供应商名称" prop="supplierName">
                  <el-input
                    v-model="formData.supplierName"
                    maxlength="50"
                    placeholder="请输入供应商名称"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="供应商类型" prop="supplierType">
                  <el-select
                    v-model="formData.supplierType"
                    clearable
                    placeholder="请选择供应商类型"
                  >
                    <el-option
                      v-for="dict in getStrDictOptions(DICT_TYPE.SUPPLIER_TYPE)"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="评估等级" prop="evalLevel">
                  <el-select v-model="formData.evalLevel" clearable placeholder="请选择评估等级">
                    <el-option
                      v-for="dict in getStrDictOptions(DICT_TYPE.SUPPLIER_EVALUATION_LEVEL)"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <span>状态与联系</span>
              </div>
            </template>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="合作状态" prop="cooperationStatus">
                  <el-select
                    v-model="formData.cooperationStatus"
                    clearable
                    placeholder="请选择合作状态"
                  >
                    <el-option
                      v-for="dict in getStrDictOptions(DICT_TYPE.COOPERATION_STATUS)"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="付款条件" prop="paymentTerm">
                  <el-input
                    v-model="formData.paymentTerm"
                    maxlength="50"
                    placeholder="请输入付款条件"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="主要联系人姓名" prop="primaryContact">
                  <el-input
                    v-model="formData.primaryContact"
                    maxlength="50"
                    placeholder="请输入主要联系人姓名"
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
                <el-form-item label="开户行、账号等开票信息" prop="bankInfo">
                  <el-input
                    v-model="formData.bankInfo"
                    maxlength="300"
                    placeholder="请输入开户行、账号等开票信息"
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
                <span>绩效指标快照(KPI)</span>
              </div>
            </template>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="近期到货合格率（%）" prop="recentQualifiedRate">
                  <el-input
                    v-model="formData.recentQualifiedRate"
                    placeholder="请输入近期到货合格率"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="近期准时交付率 （%）" prop="recentOtdRate">
                  <el-input v-model="formData.recentOtdRate" placeholder="请输入近期准时交付率" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-form>
    </div>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm"
        ><Icon class="mr-5px" icon="ep:check" />保存供应商</el-button
      ><el-button @click="dialogVisible = false"
        ><Icon class="mr-5px" icon="ep:close" />取 消</el-button
      >
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'
import * as CooperpartnersSupplierApi from '@/api/mdm/cooperpartners/supplier'

defineOptions({ name: 'CooperpartnersSupplierForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formData = ref({
  id: undefined,
  supplierCode: '',
  supplierName: '',
  supplierType: '',
  evalLevel: '',
  cooperationStatus: '',
  paymentTerm: '',
  primaryContact: '',
  contactPhone: '',
  bankInfo: '',
  recentQualifiedRate: undefined,
  recentOtdRate: undefined
})
const formRules = reactive({
  supplierCode: [{ required: true, message: '请输入供应商编码', trigger: 'blur' }],
  supplierName: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
  supplierType: [{ required: true, message: '请选择供应商类型', trigger: 'blur' }],
  // evalLevel: [{ required: true, message: '请选择评估等级', trigger: 'blur' }],
  // cooperationStatus: [{ required: true, message: '请选择合作状态', trigger: 'blur' }],
  // paymentTerm: [{ required: true, message: '请输入付款条件', trigger: 'blur' }],
  // primaryContact: [{ required: true, message: '请输入主要联系人', trigger: 'blur' }],
  contactPhone: [
    // { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  // bankInfo: [{ required: true, message: '请输银行及开票信息', trigger: 'blur' }],
  recentQualifiedRate: [
    // { required: true, message: '请输入近期到货合格率', trigger: 'blur' },
    {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: '请输入正确的数字格式，最多保留两位小数',
      trigger: 'blur'
    }
  ],
  recentOtdRate: [
    // { required: true, message: '请输入近期准时交付率', trigger: 'blur' },
    {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: '请输入正确的数字格式，最多保留两位小数',
      trigger: 'blur'
    }
  ]
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
      const data =
        formData.value as unknown as CooperpartnersSupplierApi.CooperpartnersSupplierSaveDto
      await CooperpartnersSupplierApi.createCooperpartnersSupplier(data)
      message.success(t('common.createSuccess'))
    } else {
      const data =
        formData.value as unknown as CooperpartnersSupplierApi.CooperpartnersSupplierUpdateDto
      await CooperpartnersSupplierApi.updateCooperpartnersSupplier(data)
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
    supplierCode: '',
    supplierName: '',
    supplierType: '',
    evalLevel: '',
    cooperationStatus: '',
    paymentTerm: '',
    primaryContact: '',
    contactPhone: '',
    bankInfo: '',
    recentQualifiedRate: undefined,
    recentOtdRate: undefined
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
      formData.value = await CooperpartnersSupplierApi.getCooperpartnersSupplierById(id)
    } finally {
      formLoading.value = false
    }
  }
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

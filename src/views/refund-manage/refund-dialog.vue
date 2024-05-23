<!-- hickey 2024/05/10 -->
<template>
  <el-dialog
    title="退款"
    class="ion-dialog"
    top="25vh"
    ref="dialog"
    width="760px"
    v-model="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    @close="close"
  >
    <el-form :model="form" ref="form" label-width="120px">
      <el-form-item label="退款单位">
        <span>{{ row.contractEntityName }}</span>
      </el-form-item>
      <el-form-item
        label="退款金额"
        prop="refundAmount"
        :rules="[
          { required: true, message: '请填写退款金额', trigger: 'change' },
          { validator: validateAmount, trigger: 'change' }
        ]"
      >
        <el-input v-model="form.refundAmount" placeholder="请填写退款金额" type="number" :decimal="2" clearable></el-input>
      </el-form-item>
      <el-form-item label="退款日期" prop="refundDate" :rules="[{ required: true, message: '请选择退款日期', trigger: 'change' }]">
        <el-date-picker
          class="!w-full"
          v-model="form.refundDate"
          type="date"
          placeholder="请选择退款日期"
          :disabledDate="(time) => time.getTime() > Date.now()"
          clearable
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="退款流程单号" prop="refundFlowNo" :rules="[{ required: true, message: '请填写退款流程单号', trigger: 'change' }]">
        <el-input v-model="form.refundFlowNo" :maxlength="20" :show-word-limit="true" placeholder="请填写退款流程单号" clearable></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="refundDesc" :rules="[]">
        <el-input
          v-model="form.refundDesc"
          placeholder="请填写备注"
          type="textarea"
          :maxlength="100"
          :rows="3"
          :show-word-limit="true"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submit"> 确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import * as api from './api';
export default {
  data() {
    return {
      visible: false, // 是否显示
      form: {
        refundId: '', // 退款Id
        refundAmount: '', // 退款金额
        refundDate: '', // 退款日期
        refundFlowNo: '', //退款流程单号
        refundDesc: '' //备注
      },
      row: {}
    };
  },
  methods: {
    // 打开弹窗
    open(row) {
      this.form.refundId = row.refundId;
      this.row = row;
      this.visible = true;
    },
    // 关闭弹窗
    close() {
      this.$refs.form?.resetFields();
      this.$refs.form?.clearValidate();
    },
    // 提交
    submit() {
      this.$refs.form.validate().then((res) => {
        const loading = this.$loading({
          target: this.$refs.dialog.dialogContentRef.$el
        });
        api
          .refundSubmit(this.form)
          .then((res) => {
            this.$message.success('退款成功');
            this.visible = false;
            this.$emit('refund-success', null);
          })
          .finally(() => {
            loading.close();
          });
      });
    },
    // 验证退款金额
    validateAmount(rule, value, callback) {
      if (this.row.unPaymentAmount > 0) {
        // 未退款金额大于0时，退款金额不能大于未退款金额，不能小于0
        if (value > this.row.unPaymentAmount) {
          callback('退款不能高于未退款金额');
        } else if (value < 0) {
          callback('填写不能低于0');
        } else {
          callback();
        }
      } else if (this.row.unPaymentAmount < 0) {
        // 未退款金额小于0时，退款金额不能小于未退款金额，不能大于0
        if (value < this.row.unPaymentAmount) {
          callback('填写不能低于未退款金额');
        } else if (value > 0) {
          callback('填写不能高于0');
        } else {
          callback();
        }
      }
    }
  }
};
</script>

<style scoped lang="scss"></style>

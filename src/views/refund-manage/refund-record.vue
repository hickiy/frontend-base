<template>
  <el-dialog title="退款明细" class="ion-dialog" top="15vh" width="1260px" v-model="visible">
    <el-table class="mt-4" :data="list" height="500px" v-loading="loading" :summary-method="getSummaries" show-summary border>
      <el-table-column label="序号" type="index" width="60"></el-table-column>
      <el-table-column label="退款日期" prop="payTime" min-width="110"></el-table-column>
      <el-table-column label="退款金额" prop="payAmount" min-width="100" numFormat></el-table-column>
      <!-- <el-table-column label="核销单号" prop="verifyNo" min-width="140"></el-table-column> -->
      <el-table-column label="退款流程单号" prop="refundFlowNo" min-width="140"></el-table-column>
      <el-table-column label="备注" prop="payMemo" min-width="140" ></el-table-column>
      <el-table-column label="操作人" prop="createUserName" min-width="100"></el-table-column>
      <el-table-column label="操作时间" prop="createTime" min-width="180"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import * as api from './api';
export default {
  data() {
    return {
      visible: false, // 是否显示
      loading: false, // 加载状态
      list: []
    };
  },
  methods: {
    // 打开弹窗
    open(row) {
      this.visible = true;
      this.loading = true;
      api
        .getRefundDetail({ refundId: row.refundId })
        .then((res) => {
          this.list = res.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = h('div', '合计');
          return;
        }
        if (index === 2) {
          sums[index] = this.$formatNum.numSection(data.reduce((acc, item) => acc + Number(item.payAmount), 0), 2);
          return;
        }
        sums[index] = '';
      });
      return sums;
    }
  }
};
</script>

<style scoped lang="scss"></style>

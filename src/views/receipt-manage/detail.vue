<template>
  <div class="min-h-full bg-white p-4 m-2.5">
    <el-collapse class="ion-collapse mt-4" model-value="1">
      <el-collapse-item title="收款信息" name="1">
        <el-table :data="receipt" title="" height="100%" border>
          <el-table-column label="序号" type="index" width="60"></el-table-column>
          <el-table-column label="客户名称" prop="payEntityName" min-width="160"></el-table-column>
          <el-table-column label="收款金额" prop="settlementAmount" min-width="120" numFormat></el-table-column>
          <el-table-column label="收款时间" prop="payTime" min-width="180"></el-table-column>
          <el-table-column label="开户行" prop="payBankName" min-width="120"></el-table-column>
          <el-table-column label="收款方式" prop="settlementChannel" min-width="120" :formatter="formatSettlementChannel"></el-table-column>
          <el-table-column label="交易流水号" prop="transactionNumber" min-width="140"></el-table-column>
          <el-table-column label="打款备注" prop="settlementMemo" min-width="120"></el-table-column>
          <el-table-column label="单据来源" prop="srcType" min-width="90">
            <template #default="{ row }">
              <span v-if="row.srcType == '0'">手动录入</span>
              <span v-else-if="row.srcType == '1'">财务系统</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="已认领金额" prop="verifiedAmount" min-width="100" numFormat></el-table-column>
          <el-table-column label="未认领金额" prop="unVerifiedAmount" min-width="100" numFormat></el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <el-collapse class="ion-collapse mt-4" model-value="1">
      <el-collapse-item title="认领/核销明细" name="1">
        <el-table :data="list" title="" height="100%" border>
          <el-table-column label="序号" type="index" width="60" fixed="left"></el-table-column>
          <el-table-column label="核销单号" prop="verifyCode" min-width="160"></el-table-column>
          <el-table-column label="核销单据" prop="revenueName" min-width="120"></el-table-column>
          <el-table-column label="费用周期" prop="revenuePeriodName" min-width="120"></el-table-column>
          <el-table-column label="核销客户" prop="contractEntityName" min-width="120"></el-table-column>
          <el-table-column label="核销明细类型" prop="revenueItemName" min-width="120"></el-table-column>
          <el-table-column label="所属科目" prop="revenueSubject" min-width="120" #default="{ row }">
            <span>{{ revenuSubject.find((t) => t.value == row.revenueSubject)?.label ?? '-' }} </span>
          </el-table-column>
          <el-table-column label="结算客户" prop="settlementEntityName" min-width="120"></el-table-column>
          <el-table-column label="核销金额" prop="verifyAmount" min-width="120"></el-table-column>
          <el-table-column label="核销人" prop="createUserName" min-width="120"></el-table-column>
          <el-table-column label="核销时间" prop="verifyTime" min-width="180"></el-table-column>
        </el-table>
        <div class="flex flex-row justify-end mt-4">
          <el-pagination
            layout="total, prev, pager, next, sizes"
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :page-sizes="pageSizes"
            :total="total"
            background
          />
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import * as api from './api';
import list from '@/mixins/list';
export default {
  mixins: [list],
  props: {
    settlementId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      receipt: [], // 收款信息
      list: [], // 核销明细
      revenuSubject: this.$useDict('settlement_revenue_subject') // 所属科目
    };
  },
  created() {
    this.getReceipt();
    this.search();
  },
  methods: {
    // 获取收款单信息
    getReceipt() {
      api.getReceipt({ settlementId: this.settlementId }).then((res) => {
        this.receipt = [res.data];
      });
    },
    // 查询核销明细
    search() {
      this.$modal.loading();
      api
        .getVerificationDetail({ settlementId: this.settlementId, ...this._pageInfo })
        .then((res) => {
          this.list = res.rows;
          this.total = res.total;
        })
        .finally(() => {
          this.$modal.loadingClose();
        });
    },
    // 格式化收款方式
    formatSettlementChannel(row) {
      //收款方式(00=银行公对公收款,01=招银收款通收款,02=中金自动收款,A0=银行公对公付款)
      if (row.settlementChannel === '00') {
        return '银行公对公收款';
      } else if (row.settlementChannel === '01') {
        return '招银收款通收款';
      } else if (row.settlementChannel === '02') {
        return '中金自动收款';
      } else if (row.settlementChannel === 'A0') {
        return '银行公对公付款';
      } else {
        return '-';
      }
    }
  }
};
</script>

<style scoped lang="scss"></style>

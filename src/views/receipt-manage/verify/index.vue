<!-- hickey 2024/05/08 -->
<template>
  <div class="receipt-manage-verify h-full flex flex-col">
    <div class="flex-1 p-2.5 overflow-auto">
      <div class="bg-white min-h-full p-4">
        <el-collapse model-value="1" class="ion-collapse">
          <el-collapse-item title="收款信息" name="1">
            <el-table :data="revenue" border>
              <el-table-column label="序号" type="index" width="60"></el-table-column>
              <el-table-column label="付方账户名称" prop="payEntityName" min-width="140"></el-table-column>
              <el-table-column label="付款金额" prop="settlementAmount" min-width="100" numFormat></el-table-column>
              <el-table-column label="付款时间" prop="payTime" min-width="200"></el-table-column>
              <el-table-column label="付方开户行" prop="payBankName" min-width="120"></el-table-column>
              <el-table-column label="已认领金额" prop="verifiedAmount" min-width="120" numFormat></el-table-column>
              <el-table-column label="未认领金额" prop="unVerifiedAmount" min-width="120" numFormat></el-table-column>
              <el-table-column label="摘要" prop="settlementMemo" min-width="120"></el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
        <el-collapse model-value="1" class="ion-collapse">
          <el-collapse-item title="认领明细" name="1">
            <div class="ion-bg-assist pl-4 pr-4 pt-2 pb-2 mb-2">
              <el-button type="primary" @click="drawer = true">选择核销单据</el-button>
              <el-button @click="deleteItem">删除</el-button>
            </div>
            <el-table class="hx-table" :data="list" border @selection-change="selectionChange">
              <el-table-column type="selection" width="60" fixed="left"></el-table-column>
              <el-table-column label="序号" type="index" width="60" fixed="left"></el-table-column>
              <el-table-column label="核销单据" prop="" min-width="160" #default="{ row }" fixed="left">
                <span v-if="row.verifyType == '0'">{{ row.revenueName }}</span>
                <span v-else>{{ row.refundName }}</span>
              </el-table-column>
              <el-table-column label="客户" prop="contractEntityName" min-width="120" fixed="left"></el-table-column>
              <el-table-column label="费用周期" prop="revenuePeriodName" min-width="120" #default="{ row }">
                <span v-if="row.verifyType == '0'">{{ row.revenuePeriodName }}</span>
                <span v-else>{{ row.refundPeriodName }}</span>
              </el-table-column>
              <el-table-column label="核销明细类型" prop="" min-width="120" #default="{ row }">
                <span v-if="row.verifyType == '0'">{{ revenueItemType.find((t) => t.value === row.revenueItemType)?.label ?? '-' }}</span>
                <span v-else>{{ refundType.find((t) => t.value === row.refundType)?.label ?? '-' }}</span>
              </el-table-column>
              <el-table-column label="所属科目" prop="" min-width="120" #default="{ row }">
                <span>{{ revenuSubject.find((t) => t.value == row.revenueSubject)?.label ?? '-' }} </span>
              </el-table-column>
              <el-table-column label="结算客户" prop="" min-width="120" #default="{ row }">
                <span v-if="row.verifyType == '0'">{{ row.settlementEntityName }}</span>
                <span v-else>{{ row.receiptEntityName }}</span>
              </el-table-column>
              <el-table-column label="单据金额" prop="" min-width="100" fixed="right" #default="{ row }" align="right">
                <span v-if="row.verifyType == '0'">{{ $formatNum.numSection(row.totalAmount, 2) }}</span>
                <span v-else>{{ $formatNum.numSection(row.refundAmount, 2) }}</span>
              </el-table-column>
              <el-table-column label="已核销金额" prop="_paymentAmount" min-width="100" fixed="right" numFormat> </el-table-column>
              <el-table-column label="未核销金额" prop="_unPaymentAmount" min-width="100" fixed="right" numFormat></el-table-column>
              <el-table-column label="本次核销金额" prop="" min-width="180" #default="{ row }" fixed="right">
                <el-form-item :error="row._verifyErr">
                  <el-input
                    v-model="row._verifyAmount"
                    placeholder="请填写核销金额"
                    type="number"
                    :decimal="2"
                    clearable
                    @change="verifyAmountChange(row)"
                  ></el-input>
                </el-form-item>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div class="bg-white p2 ion-footer-btns-shadow flex flex-row justify-center">
      <el-button type="primary" @click="submitVerify">收款认领/核销</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
    <el-drawer class="ion-drawer" v-model="drawer" title="选择核销单据" size="80%" :show-close="false" :close-on-click-modal="false">
      <div class="h-full flex flex-col overflow-hidden">
        <el-tabs model-value="1" class="flex-1 ion-tabs flex flex-col overflow-hidden">
          <el-tab-pane label="营收单" name="1" class="h-full">
            <RevenueList ref="revenueList" />
          </el-tab-pane>
          <el-tab-pane label="退款单" name="2" class="h-full">
            <RefundList ref="refundList" />
          </el-tab-pane>
        </el-tabs>
        <div class="flex fle-row justify-center">
          <el-button type="primary" @click="confirm">确定</el-button>
          <el-button @click="cancle">取消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import RevenueList from './revenue-list.vue';
import RefundList from './refund-list.vue';
import * as api from './api';
export default {
  name: 'ReceiptManageVerify',
  components: {
    RevenueList,
    RefundList
  },
  props: {
    // 收款单ID
    settlementId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      drawer: false, // 选择核销单据抽屉
      revenue: [], // 收款信息
      revenueMap: {}, // 选中的营收
      refundMap: {}, // 选中的退款
      selected: [], // 勾选的核销明细
      refundType: this.$useDict('settlement_refund_type'), // 退款类型
      revenueItemType: this.$useDict('settlement_revenue_item_type'), // 营收明细类型
      revenuSubject: this.$useDict('settlement_revenue_subject') // 所属科目
    };
  },
  created() {
    this.getReceipt();
  },
  computed: {
    // 核销明细列表
    list() {
      return Object.values(this.revenueMap).concat(Object.values(this.refundMap));
    }
  },
  methods: {
    // 获取收款单信息
    getReceipt() {
      this.$modal.loading();
      api
        .getReceipt({ settlementId: this.settlementId })
        .then((res) => {
          this.revenue = [res.data];
        })
        .finally(() => {
          this.$modal.loadingClose();
        });
    },
    // 确认选择
    confirm() {
      this.revenueConfirm();
      this.refundConfirm();
      this.drawer = false;
    },
    // 营收确认
    revenueConfirm() {
      let revenueMap = {};
      this.$refs.revenueList?.selected.forEach((item) => {
        item._verifyAmount = item.unPaymentAmount; // 本次核销金额
        item._paymentAmount = item.paymentAmount; // 已核销金额
        item._unPaymentAmount = item.unPaymentAmount; // 未核销金额
        item._verifyErr = ''; // 核销错误提示
        revenueMap[item.revenueItemId] = item;
      });
      this.revenueMap = revenueMap;
    },
    // 退款确认
    refundConfirm() {
      let refundMap = {};
      this.$refs.refundList?.selected.forEach((item) => {
        item._verifyAmount = item.unVerifyAmount; // 本次核销金额
        item._paymentAmount = item.verifyAmount; // 已核销金额
        item._unPaymentAmount = item.unVerifyAmount; // 未核销金额
        item._verifyErr = ''; // 核销错误提示
        refundMap[item.refundId] = item;
      });
      this.refundMap = refundMap;
    },
    // 取消选择
    cancle() {
      // 此处处理边界情况
      // 当用户打开抽屉后，在列表中勾选或者取消了部分项目，但最后点击了取消按钮
      // 此时需要将列表中的选中状态还原
      this.$refs.revenueList?.clearSelection();
      for (let item of Object.values(this.revenueMap)) {
        this.$refs.revenueList?.toggleRowSelection(item, true);
      }
      this.$refs.refundList?.clearSelection();
      for (let item of Object.values(this.refundMap)) {
        this.$refs.refundList?.toggleRowSelection(item, true);
      }
      this.drawer = false;
    },
    // 列表勾选
    selectionChange(val) {
      this.selected = val;
    },
    // 删除核销明细
    deleteItem() {
      if (this.selected.length === 0) {
        this.$message.warning('请选择要删除的核销明细');
        return;
      }
      this.$confirm('是否删除选中的核销明细？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 将选中删除的列表项的勾选状态取消
        this.selected.forEach((item) => {
          if (item.verifyType == '0') {
            Reflect.deleteProperty(this.revenueMap, item.revenueItemId);
            this.$refs.revenueList?.toggleRowSelection(item, false);
          } else if (item.verifyType == '1') {
            Reflect.deleteProperty(this.refundMap, item.refundId);
            this.$refs.refundList?.toggleRowSelection(item, false);
          }
        });
      });
    },
    // 核销金额变化
    verifyAmountChange(row) {
      if (!row._unPaymentAmount) {
        // 未核销金额不存在时，提示用户未核销金额不存在
        row._verifyErr = '未核销金额不存在';
      } else if (row._verifyAmount) {
        // 未核销金额存在并且核销金额存在时，校验核销金额
        if (row._unPaymentAmount > 0) {
          // 未核销金额大于0时，核销金额不能大于未核销金额，不能小于0
          if (row._verifyAmount > row._unPaymentAmount) {
            row._verifyErr = '填写不能高于未核销金额';
          } else if (row._verifyAmount <= 0) {
            row._verifyErr = '填写不能小于等于0';
          } else {
            row._verifyErr = '';
          }
        } else if (row._unPaymentAmount < 0) {
          // 未核销金额小于0时，核销金额不能小于未核销金额，不能大于0
          if (row._verifyAmount < row._unPaymentAmount) {
            row._verifyErr = '填写不能低于未核销金额';
          } else if (row._verifyAmount >= 0) {
            row._verifyErr = '填写不能大于等于0';
          } else {
            row._verifyErr = '';
          }
        }
      } else {
        // 核销金额不存在时, 提示用户填写核销金额
        row._verifyErr = '请填写核销金额';
      }
    },
    // 提交收款认领/核销
    submitVerify() {
      if (this.list.length === 0) {
        this.$message.warning('请添加核销明细');
        return;
      }
      for (let item of this.list) {
        if (item._verifyErr) {
          return;
        }
      }
      this.$modal.loading();
      api
        .submitVerify({
          settlementId: this.settlementId,
          verifyItemList: this.list.map((item) => {
            return {
              verifyType: item.verifyType,
              revenueItemId: item.revenueItemId,
              refundId: item.refundId,
              verifyAmount: item._verifyAmount
            };
          })
        })
        .then(() => {
          this.$message.success('收款认领/核销成功');
          this.cancel();
        })
        .finally(() => {
          this.$modal.loadingClose();
        });
    },
    // 取消核销
    cancel() {
      this.$router.push({ path: '/receipt-manage/index' });
    }
  }
};
</script>

<style scoped lang="scss">
.hx-table {
  :deep(.el-table__cell) {
    vertical-align: top !important;
  }
  :deep(.el-table__cell > .cell) {
    min-height: 32px;
    line-height: 32px;
  }
}
</style>

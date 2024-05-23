<!-- hickey 2024/04/12 -->
<template>
  <div class="bg-white flex-1 p-4 m-2.5">
    <div class="p-4 ion-bg-primary">
      <div class="flex flex-row justify-between text-xl font-bold">
        <div>{{ info.revenueName }}</div>
        <div>
          <span class="ion-text-primary">状态: </span>
          <span :class="[info.reviewStatus == '0' ? 'ion-wait' : info.reviewStatus == '1' ? 'ion-success' : 'ion-error']">{{
            reviewStatus.find((t) => t.value === info.reviewStatus)?.label ?? '-'
          }}</span>
        </div>
      </div>
      <div class="mt-2 ion-text-assist">营收单号：{{ info.revenueCode ?? '-' }}</div>
    </div>
    <el-collapse class="ion-collapse mt-4" model-value="1">
      <el-collapse-item title="基础信息" name="1">
        <el-descriptions class="pl-3 pr-3 pt-3">
          <el-descriptions-item label="项目名称">{{ info.projectName ?? '-' }}</el-descriptions-item>
          <el-descriptions-item label="客户类型">
            {{ info.contractEntityType == '0' ? '个人' : info.contractEntityType == '1' ? '法人' : '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="客户">{{ info.contractEntityName ?? '-' }}</el-descriptions-item>
          <el-descriptions-item label="营收名称">{{ info.revenueName ?? '-' }}</el-descriptions-item>
          <el-descriptions-item label="营收类型">
            {{ revenueType.find((t) => t.value == info.revenueType)?.label ?? '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="是否预收">
            {{ info.preRevenueFlag == '0' ? '非预收' : info.preRevenueFlag == '0' ? '预收' : '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="备注" :span="3">{{ info.revenueMemo ?? '-' }}</el-descriptions-item>
          <el-descriptions-item label="单据来源">
            {{ info.createType == '1' ? '运营系统' : info.createType == '0' ? '人工创建' : '-' }}
          </el-descriptions-item>
          <!-- <el-descriptions-item label="业务ID">{{ info.bizCode ?? '-' }}</el-descriptions-item> -->
          <el-descriptions-item label="录入人">
            {{ info.createUserName ?? '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="录入时间">{{ info.createTime ?? '-' }}</el-descriptions-item>
          <el-descriptions-item label="审核人">{{ info.reviewUserName ?? '-' }}</el-descriptions-item>
          <el-descriptions-item label="审核时间">{{ info.reviewTime ?? '-' }}</el-descriptions-item>
        </el-descriptions>
      </el-collapse-item>
    </el-collapse>
    <el-collapse class="ion-collapse mt-4" model-value="1">
      <el-collapse-item title="" name="1">
        <template #title>
          <span>营收明细</span>
          <div class="flex-1 flex justify-end mr-4">
            <el-button link type="primary" @click.stop="checkView">账单明细</el-button>
          </div>
        </template>
        <template #default>
          <el-table :data="info.revenueItemVoList" border show-summary :summary-method="volistSummary">
            <el-table-column label="序号" type="index" width="60"></el-table-column>
            <el-table-column label="营收明细类型" prop="revenueItemType" #default="{ row }">
              {{ revenueItemType.find((t) => t.value == row.revenueItemType)?.label ?? '-' }}
            </el-table-column>
            <el-table-column label="所属科目" prop="revenueSubject" #default="{ row }">
              {{ revenuSubject.find((t) => t.value == row.revenueSubject)?.label ?? '-' }}
            </el-table-column>
            <el-table-column label="营收金额" prop="revenueItemAmount" min-width="100" numFormat></el-table-column>
            <el-table-column label="逾期违约金" prop="lateFeeAmount" min-width="100" numFormat></el-table-column>
            <el-table-column label="减免金额" prop="minusFee" min-width="100" numFormat></el-table-column>
            <!-- <el-table-column label="税率" prop="taxRate"></el-table-column> -->
            <el-table-column label="合计应收(含税)" prop="includingTaxTotalAmount" min-width="100" numFormat></el-table-column>
            <el-table-column label="结算客户" prop="settlementEntityName"></el-table-column>
            <el-table-column label="已收款金额" prop="paymentAmount" min-width="100" numFormat></el-table-column>
          </el-table>
        </template>
      </el-collapse-item>
    </el-collapse>
    <el-collapse class="ion-collapse" model-value="1">
      <el-collapse-item title="结算规则" name="1">
        <el-descriptions :column="4" class="pl-3 pr-3 pt-3">
          <el-descriptions-item label="费用账期">{{ info.revenuePeriodName ?? '-' }}</el-descriptions-item>
          <el-descriptions-item label="结算周期">{{
            `${info.settlementStartDt ?? '无开始日期'} ~ ${info.settlementEndDt ?? '无结束日期'}`
          }}</el-descriptions-item>
          <el-descriptions-item label="是否收逾期违约金">-</el-descriptions-item>
          <el-descriptions-item label="违约金收取规则">-</el-descriptions-item>
          <el-descriptions-item label="逾期违约金减免金额">-</el-descriptions-item>
          <el-descriptions-item label="减免人">-</el-descriptions-item>
          <el-descriptions-item label="减免时间">-</el-descriptions-item>
        </el-descriptions>
      </el-collapse-item>
    </el-collapse>
    <el-collapse class="ion-collapse mt-4" model-value="1">
      <el-collapse-item title="收款明细" name="1">
        <el-table :data="info.verifySettlementItemVoList" border show-summary :summary-method="summary">
          <el-table-column label="序号" type="index" width="60"></el-table-column>
          <el-table-column label="收款日期" prop="settlementDtName" min-width="140"></el-table-column>
          <el-table-column label="收款明细类型" prop="revenueItemType" min-width="120" #default="{ row }">
            {{ revenueItemType.find((t) => t.value == row.revenueItemType)?.label ?? '-' }}
          </el-table-column>
          <el-table-column label="收款金额" prop="settlementAmount" min-width="100" numFormat></el-table-column>
          <el-table-column label="支付主体" prop="payEntityName" min-width="140"></el-table-column>
          <el-table-column label="本次核销金额" prop="verifyAmount" min-width="100" numFormat></el-table-column>
          <el-table-column label="核销单号/收款单号" prop="verifyCode" min-width="160"></el-table-column>
          <!-- <el-table-column label="备注" prop="revenueItemName" min-width="140"></el-table-column> -->
          <el-table-column label="操作人" prop="createUserName" min-width="100"></el-table-column>
          <el-table-column label="操作时间" prop="createTime" min-width="180"></el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
    <!-- <el-collapse class="ion-collapse mt-4" model-value="1">
        <el-collapse-item title="附件" name="1">
          <div class="flex flex-row flex-wrap pl-5">
            <div v-for="(c, index) in accessory" :key="index" class="mr-5 w-50">
              <div class="text-sm ion-text-assist mb-1">{{ c.name }}:</div>
              <el-preview-file
                class="border border-solid ion-border-primary w-full h-35"
                :file="c.first"
                :preview-src-list="c.list"
                :title="c.name"
                :fileList="c.fileList"
              ></el-preview-file>
              <div class="ion-bg-file-name text-center text-white pt-1 pb-1 pl-2.5 pr-2.5 cursor-pointer">{{ `共${c.list.length}张` }}</div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse> -->
  </div>
</template>

<script>
import * as api from './api';
export default {
  props: {
    revenueId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      info: {},
      reviewStatus: this.$useDict('settlement_review_status'), // 审核状态
      revenueType: this.$useDict('settlement_revenue_type'), // 营收类型
      revenueItemType: this.$useDict('settlement_revenue_item_type'), // 营收明细类型
      revenuSubject: this.$useDict('settlement_revenue_subject') // 所属科目
    };
  },
  created() {
    this.getDetail();
  },
  computed: {
    // 附件配置数据
    accessory() {
      let { batteryInvoiceFileList = [], otherFileList = [] } = this.info;
      const toUrlList = (l) => (Array.isArray(l) ? l.map((i) => i.fileUrl || '') : []);
      let accessory = [];
      if (batteryInvoiceFileList.length > 0) {
        accessory.push({
          name: '电池发票',
          list: toUrlList(batteryInvoiceFileList),
          first: batteryInvoiceFileList[0],
          fileList: batteryInvoiceFileList
        });
      }
      if (otherFileList.length > 0) {
        accessory.push({
          name: '其他附件',
          list: toUrlList(otherFileList),
          first: otherFileList[0],
          fileList: otherFileList
        });
      }
      return accessory;
    }
  },
  methods: {
    // 获取营收单详情
    getDetail() {
      this.$modal.loading();
      api
        .getRevenueDetail({ revenueId: this.revenueId })
        .then((res) => {
          this.info = res.data;
        })
        .finally(() => {
          this.$modal.loadingClose();
        });
    },
    // 查看账单明细
    checkView() {
      this.$router.push({ path: '/revenue-manage/check-detail', query: { revenueId: this.info.revenueId } });
    },
    // 收款明细列表合计列
    summary(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = h('div', '合计');
          return;
        }
        if (index === 3) {
          sums[index] = this.$formatNum.numSection(
            data.reduce((acc, item) => acc + Number(item.settlementAmount), 0),
            2
          );
          return;
        }
        if (index === 5) {
          sums[index] = this.$formatNum.numSection(
            data.reduce((acc, item) => acc + Number(item.verifyAmount), 0),
            2
          );
          return;
        }
        sums[index] = '';
      });
      return sums;
    },
    // 营收明细合计列
    volistSummary(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (column.type == 'index') {
          sums[index] = h('div', '合计');
          return;
        }
        if (column.property === 'revenueItemAmount') {
          sums[index] = this.$formatNum.numSection(
            data.reduce((acc, item) => acc + Number(item.revenueItemAmount), 0),
            2
          );
          return;
        }
        if (column.property == 'includingTaxTotalAmount') {
          sums[index] = this.$formatNum.numSection(
            data.reduce((acc, item) => acc + Number(item.includingTaxTotalAmount), 0),
            2
          );
          return;
        }
        if (column.property == 'paymentAmount') {
          sums[index] = this.$formatNum.numSection(
            data.reduce((acc, item) => acc + Number(item.paymentAmount), 0),
            2
          );
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

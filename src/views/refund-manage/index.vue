<!-- hickey 2024/04/08 -->
<template>
  <div class="refund-manage flex-1 m-2.5 bg-white flex flex-col overflow-hidden p-4">
    <el-form
      class="ion-search-area--bg pt-4 pl-4 pr-4"
      :model="form"
      label-min-width="auto"
      label-position="right"
      label-suffix=":"
      ref="form"
      inline
    >
      <el-form-item label="项目名称" prop="projectCode">
        <el-select v-model="form.projectCode" placeholder="请选择" filterable clearable>
          <el-option label="全部" value=""></el-option>
          <el-option v-for="p in projectList" :label="p.leaseProjectShortName" :value="p.projectCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户类型" prop="contractEntityType">
        <el-select v-model="form.contractEntityType" placeholder="请选择" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option label="个人" value="0"></el-option>
          <el-option label="企业" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户名称" prop="contractEntityCode">
        <el-select v-model="form.contractEntityCode" placeholder="请选择" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option v-for="c in customerList" :label="c.contractEntityName" :value="c.contractEntityCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="退款类型" prop="refundType">
        <el-select v-model="form.refundType" placeholder="请选择" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option v-for="t in refundType" :label="t.label" :value="t.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="退款状态" prop="refundStatus">
        <el-select v-model="form.refundStatus" placeholder="请选择" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option label="未退款" value="0"></el-option>
          <el-option label="部分退款" value="1"></el-option>
          <el-option label="已退款" value="9"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="费用周期" prop="periodRange">
        <el-date-picker
          v-model="form.periodRange"
          type="monthrange"
          value-format="YYYYMM"
          start-placeholder="起始月"
          end-placeholder="截止月"
          :disabled-date="
            (time) => {
              const now = new Date();
              return time.getTime() > new Date(now.getFullYear(), now.getMonth()).getTime();
            }
          "
          clearable
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="查询日期" prop="dateRange">
        <el-date-picker
          v-model="form.dateRange"
          type="daterange"
          value-format="YYYY-MM-DD"
          start-placeholder="起始日期"
          end-placeholder="查询日期"
          :disabled-date="(time) => time.getTime() > Date.now()"
          clearable
        ></el-date-picker>
      </el-form-item>
      <div class="float-right">
        <el-button type="primary" @click="search(true)">搜索</el-button>
        <el-button @click="() => $refs.form.resetFields()">重置</el-button>
      </div>
    </el-form>
    <el-table :data="list" border title="退款单" :setTable="[]" height="100%" v-loading="loading">
      <el-table-column label="序号" type="index" width="60" fixed="left"></el-table-column>
      <el-table-column label="项目名称" prop="projectShortName" min-width="160"></el-table-column>
      <el-table-column label="客户名称" prop="contractEntityName" min-width="210"></el-table-column>
      <el-table-column label="退款原因" prop="refundName" min-width="150"></el-table-column>
      <el-table-column label="退款单号" prop="refundNo" min-width="150"></el-table-column>
      <el-table-column label="退款类型" prop="refundType" min-width="150" #default="{ row }">
        {{ refundType.find((t) => t.value === row.refundType)?.label ?? '-' }}
      </el-table-column>
      <el-table-column label="退款金额" prop="refundAmount" min-width="120" numFormat></el-table-column>
      <!-- <el-table-column label="结算主体" prop="receiptEntityName" min-width="120"></el-table-column> -->
      <el-table-column label="费用周期" prop="refundPeriodName" min-width="120"></el-table-column>
      <el-table-column label="审核状态" prop="reviewStatus" min-width="120" #default="{ row }">
        <span
          :class="['ion-status', row.reviewStatus == '0' ? 'ion-status_wait' : row.reviewStatus == '1' ? 'ion-status_success' : 'ion-status_error']"
          >{{ reviewStatus.find((t) => t.value === row.reviewStatus)?.label ?? '-' }}</span
        >
        <span></span>
      </el-table-column>
      <el-table-column label="已退款金额" prop="paymentAmount" min-width="120" numFormat></el-table-column>
      <el-table-column label="备注" prop="refundMemo" min-width="120"></el-table-column>
      <el-table-column label="单据来源" prop="createType" min-width="120" #default="{ row }">
        <span v-if="row.createType == '0'">手工录入</span>
        <span v-else-if="row.createType == '1'">运营系统</span>
        <span v-else>-</span>
      </el-table-column>
      <el-table-column label="操作" width="140" fixed="right" #default="{ row }">
        <el-button v-if="row.paymentAmount < row.refundAmount" type="primary" link @click="() => $refs.refundDialog?.open?.(row)">退款</el-button>
        <el-button v-if="row.paymentAmount > 0" type="primary" link @click="() => $refs.refundRecord?.open?.(row)">退款明细</el-button>
      </el-table-column>
    </el-table>
    <div class="flex flex-row justify-end mt-2.5">
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
    <!-- 退款弹窗 -->
    <RefundDialog ref="refundDialog" @refund-success="search"></RefundDialog>
    <!-- 退款明细 -->
    <RefundRecord ref="refundRecord"></RefundRecord>
  </div>
</template>

<script>
import list from '@/mixins/list';
import * as api from './api';
import RefundDialog from './refund-dialog.vue';
import RefundRecord from './refund-record.vue';
export default {
  mixins: [list],
  components: {
    RefundDialog,
    RefundRecord
  },
  data() {
    return {
      form: {
        projectCode: '', // 项目编号
        contractEntityType: '', // 客户类型
        contractEntityCode: '', // 客户名称
        refundType: '', // 退款类型
        refundStatus: '', // 退款状态
        reviewStatus: '', // 审核状态
        periodRange: [], // 退款周期
        startRefundPeriod: '', // 退款账期开始
        endRefundPeriod: '', // 退款账期结束
        dateRange: [], // 退款申请时间
        createStartDateStr: '', // 退款申请开始时间
        endStartDateStr: '' // 退款申请结束时间
      },
      refundType: this.$useDict('settlement_refund_type'), // 退款类型
      reviewStatus: this.$useDict('settlement_review_status'), // 审核状态
      projectList: [], // 项目列表
      customerList: [], // 客户列表
      list: [] // 列表数据
    };
  },
  created() {
    this.getProjectList();
    this.getCustomerList();
    this.search();
  },
  watch: {
    'form.projectCode'() {
      this.getCustomerList();
    },
    'form.contractEntityType'() {
      this.getCustomerList();
    },
    'form.dateRange'(val) {
      if (val && val.length === 2) {
        this.form.createStartDateStr = val[0];
        this.form.endStartDateStr = val[1];
      } else {
        this.form.createStartDateStr = '';
        this.form.endStartDateStr = '';
      }
    },
    'form.periodRange'(val) {
      if (val && val.length === 2) {
        this.form.startRefundPeriod = val[0];
        this.form.endRefundPeriod = val[1];
      } else {
        this.form.startRefundPeriod = '';
        this.form.endRefundPeriod = '';
      }
    }
  },
  methods: {
    // 获取项目列表
    getProjectList() {
      api.getProjectList().then((res) => {
        this.projectList = res.data;
      });
    },
    // 获取客户列表
    getCustomerList() {
      api
        .getRefundCustomerList({
          projectCode: this.form.projectCode,
          contractEntityType: this.form.contractEntityType
        })
        .then((res) => {
          this.customerList = res.data;
        });
    },
    search(resetPage) {
      // 只有在显式传入 true 时，才重置页码
      if (typeof resetPage === 'boolean') {
        this.currentPage = 1;
      }
      this.loading = true;
      const { dateRange, periodRange, ...form } = this.form;
      api
        .getRefundList({
          ...form,
          ...this._pageInfo
        })
        .then((res) => {
          this.list = res.rows;
          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style scoped lang="scss"></style>

<!-- hickey 2024/05/09 -->
<template>
  <div class="h-full flex flex-col overflow-hidden">
    <el-form class="ion-search-area--bg pt-4 pl-4 pr-4 mb4" :model="form" ref="form" label-width="110px" :inline="true">
      <el-form-item label="项目名称" prop="projectCode">
        <el-select v-model="form.projectCode" placeholder="请选择" filterable clearable>
          <el-option label="全部" value=""></el-option>
          <el-option v-for="p in projectList" :label="p.leaseProjectShortName" :value="p.projectCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="退款类型" prop="refundType">
        <el-select v-model="form.refundType" placeholder="请选择" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option v-for="t in refundType" :label="t.label" :value="t.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="退款客户类型" prop="contractEntityType">
        <el-select v-model="form.contractEntityType" placeholder="请选择" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option label="个人" value="0"></el-option>
          <el-option label="企业" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="退款客户名称" prop="contractEntityCode">
        <el-select v-model="form.contractEntityCode" placeholder="请选择" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option v-for="c in customerList" :label="c.contractEntityName" :value="c.contractEntityCode"></el-option>
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
              return time.getTime() > new Date(now.getFullYear(), now.getMonth() + 1).getTime();
            }
          "
          clearable
        ></el-date-picker>
      </el-form-item>
      <!-- 备注 -->
      <el-form-item label="备注" prop="refundMemo">
        <el-input v-model="form.refundMemo" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <div class="float-right">
        <el-button type="primary" @click="search(true)">搜索</el-button>
        <el-button @click="() => $refs.form.resetFields()">重置</el-button>
      </div>
    </el-form>
    <el-table ref="table" :data="list" height="100%" border @selection-change="selectionChange" v-loading="loading" row-key="refundId">
      <el-table-column type="selection" width="60" fixed="left" :reserve-selection="true"></el-table-column>
      <el-table-column label="序号" type="index" width="60" fixed="left"></el-table-column>
      <el-table-column label="项目名称" prop="projectShortName" min-width="120" fixed="left"></el-table-column>
      <el-table-column label="退款客户" prop="contractEntityName" min-width="120" fixed="left"></el-table-column>
      <el-table-column label="退款原因" prop="refundName" min-width="150"></el-table-column>
      <el-table-column label="退款类型" prop="refundType" min-width="150" #default="{ row }">
        {{ refundType.find((t) => t.value === row.refundType)?.label ?? '-' }}
      </el-table-column>
      <el-table-column label="费用周期" prop="refundPeriodName" min-width="120"></el-table-column>
      <el-table-column label="备注" prop="refundMemo" min-width="120"></el-table-column>
      <el-table-column label="应退金额" prop="refundAmount" min-width="120" numFormat fixed="right"></el-table-column>
      <!-- <el-table-column label="已退款金额" prop="paymentAmount" min-width="120" numFormat fixed="right"></el-table-column>
      <el-table-column label="未退金额" prop="unPaymentAmount" min-width="120" numFormat fixed="right"></el-table-column> -->
      <el-table-column label="已核销金额" prop="verifyAmount" min-width="120" numFormat fixed="right"></el-table-column>
      <el-table-column label="未核销金额" prop="unVerifyAmount" min-width="120" numFormat fixed="right"></el-table-column>
    </el-table>
    <div class="flex flex-row justify-start mt-2.5">
      <div class="ml-4 font-bold ion-text-primary">
        {{
          `已选中${selected.length} 条，
          合计应退：${$formatNum.numSection(refundAmount, 2)} 元，
          合计未核销金额：${$formatNum.numSection(unVerifyAmount, 2)} 元`
        }}
      </div>
    </div>
  </div>
</template>

<script>
import * as api from './api';

export default {
  name: 'RevenueList',
  data() {
    return {
      form: {
        projectCode: '', // 项目编号
        refundType: '', // 退款类型
        contractEntityType: '', // 退款客户类型
        contractEntityCode: '', // 退款客户名称
        refundStatus: '', // 退款状态
        periodRange: [], // 退款周期
        startRefundPeriod: '', // 退款账期开始
        endRefundPeriod: '', // 退款账期结束
        refundMemo: '' // 备注
      },
      loading: false, // 加载状态
      refundType: this.$useDict('settlement_refund_type'), // 退款类型
      projectList: [], // 项目列表
      customerList: [], // 客户列表
      list: [], // 列表数据
      selected: [] // 选中的数据
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
  computed: {
    // 合计应收
    refundAmount() {
      return this.selected.reduce((total, item) => total + item.refundAmount, 0);
    },
    // 合计未核销金额
    unVerifyAmount() {
      return this.selected.reduce((total, item) => total + item.unVerifyAmount, 0);
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
    // 查询退款单列表
    search(resetPage) {
      // 只有在显式传入 true 时，才重置页码
      if (typeof resetPage === 'boolean') {
        this.currentPage = 1;
      }
      this.loading = true;
      const { periodRange, ...form } = this.form;
      api
        .getRefundList({
          ...form,
          ...this._pageInfo
        })
        .then((res) => {
          this.list = res.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 选中
    selectionChange(val) {
      this.selected = val;
    },
    // 改变选中状态
    toggleRowSelection(row, selected) {
      this.$refs.table?.toggleRowSelection(row, selected);
    },
    // 清空选中
    clearSelection() {
      this.$refs.table?.clearSelection();
    }
  }
};
</script>

<style scoped lang="scss"></style>

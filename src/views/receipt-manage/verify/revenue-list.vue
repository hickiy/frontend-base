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
      <el-form-item label="营收类型" prop="revenueType">
        <el-select v-model="form.revenueType" placeholder="请选择" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option v-for="t in revenueType" :label="t.label" :value="t.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="营收客户类型" prop="contractEntityType">
        <el-select v-model="form.contractEntityType" placeholder="请选择" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option label="个人" value="0"></el-option>
          <el-option label="企业" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="营收客户" prop="contractEntityCode">
        <el-select v-model="form.contractEntityCode" placeholder="请选择" filterable clearable>
          <el-option label="全部" value=""></el-option>
          <el-option v-for="c in customerList" :label="c.contractEntityName" :value="c.contractEntityCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="费用周期" prop="revenuePeriodList">
        <el-date-picker
          type="monthrange"
          v-model="form.revenuePeriodList"
          start-placeholder="起始月"
          end-placeholder="截止月"
          value-format="YYYYMM"
          clearable
          :disabled-date="
            (time) => {
              const now = new Date();
              return time.getTime() > new Date(now.getFullYear(), now.getMonth() + 1).getTime();
            }
          "
        ></el-date-picker>
      </el-form-item>
      <div class="float-right">
        <el-button type="primary" @click="search(true)">搜索</el-button>
        <el-button @click="() => $refs.form.resetFields()">重置</el-button>
      </div>
    </el-form>
    <el-table ref="table" :data="list" height="100%" border @selection-change="selectionChange" v-loading="loading" row-key="revenueItemId">
      <el-table-column type="selection" width="60" fixed="left" :reserve-selection="true"></el-table-column>
      <el-table-column label="序号" type="index" width="60" fixed="left"></el-table-column>
      <el-table-column label="营收单名称" prop="revenueName" min-width="220" fixed="left"></el-table-column>
      <el-table-column label="营收客户" prop="contractEntityName" min-width="120"  fixed="left"></el-table-column>
      <el-table-column label="费用周期" prop="revenuePeriodName" min-width="120"></el-table-column>
      <el-table-column label="营收明细类型" prop="revenueItemType" min-width="120"  #default="{ row }">
        {{ revenueItemType.find((t) => t.value === row.revenueItemType)?.label ?? '-' }}
      </el-table-column>
      <el-table-column label="营收金额" prop="revenueItemAmount" min-width="120" numFormat></el-table-column>
      <el-table-column label="所属科目" prop="revenueSubject" min-width="120" #default="{ row }">
        {{ revenuSubject.find((t) => t.value === row.revenueSubject)?.label ?? '-' }}
      </el-table-column>
      <el-table-column label="结算客户" prop="settlementEntityName" min-width="120" ></el-table-column>
      <el-table-column label="逾期违约金" prop="lateFeeAmount" min-width="120" numFormat></el-table-column>
      <el-table-column label="减免金额" prop="minusFee" min-width="120" numFormat></el-table-column>
      <el-table-column label="合计应收" prop="totalAmount" min-width="120" numFormat fixed="right"></el-table-column>
      <el-table-column label="已收款金额" prop="paymentAmount" min-width="120" numFormat fixed="right"></el-table-column>
      <el-table-column label="未收金额" prop="unPaymentAmount" min-width="120" numFormat fixed="right"></el-table-column>
    </el-table>
    <div class="flex flex-row justify-start mt-2.5">
      <div class="ml-4 font-bold ion-text-primary">
        {{
          `已选中${selected.length}条，
          合计应收：${$formatNum.numSection(totalAmount, 2)} 元，
          合计未收：${$formatNum.numSection(unPaymentAmount, 2)} 元`
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
        projectCode: '', // 项目名称
        contractEntityType: '', // 客户类型
        contractEntityCode: '', // 客户名称
        revenueType: '', // 营收类型
        revenuePeriodList: [], // 费用周期
        startRevenuePeriod: '', // 开始费用周期
        endRevenuePeriod: '' // 结束费用周期
      },
      loading: false, // 加载状态
      revenueType: this.$useDict('settlement_revenue_type'), // 营收类型
      revenuSubject: this.$useDict('settlement_revenue_subject'), // 所属科目
      revenueItemType: this.$useDict('settlement_revenue_item_type'), // 营收明细类型
      projectList: [], // 项目列表
      customerList: [], // 客户列表
      list: [], // 列表数据
      selected: [] // 选中的数据
    };
  },
  created() {
    this.search();
    this.getProjectList();
    this.getCustomerList();
  },
  watch: {
    'form.projectCode'() {
      this.getCustomerList();
    },
    'form.revenuePeriodList'(val) {
      if (val && val.length === 2) {
        this.form.startRevenuePeriod = val[0];
        this.form.endRevenuePeriod = val[1];
      } else {
        this.form.startRevenuePeriod = '';
        this.form.endRevenuePeriod = '';
      }
    }
  },
  computed: {
    // 合计应收
    totalAmount() {
      return this.selected.reduce((total, item) => total + item.totalAmount, 0);
    },
    // 合计未收
    unPaymentAmount() {
      return this.selected.reduce((total, item) => total + item.unPaymentAmount, 0);
    }
  },
  methods: {
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
    },
    // 获取项目列表
    getProjectList() {
      api.getProjectList().then((res) => {
        this.projectList = res.data;
      });
    },
    // 获取客户列表
    getCustomerList() {
      api.getContractCustomerList({ projectCode: this.form.projectCode }).then((res) => {
        this.customerList = res.data;
      });
    },
    // 营收类型格式化
    revenueTypeFormatter(row, col, val) {
      return this.revenueType.find((t) => t.value === val)?.label ?? '-';
    },
    // 查询营收单列表
    search(resetPage) {
      // 只有在显式传入 true 时，才重置页码
      if (typeof resetPage === 'boolean') {
        this.currentPage = 1;
      }
      this.loading = true;
      const { revenuePeriodList, ...form } = this.form;
      api
        .getRevenueList({
          ...form,
          ...this._pageInfo
        })
        .then((res) => {
          this.list = res.data;
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style scoped lang="scss"></style>

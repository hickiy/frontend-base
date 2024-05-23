<!-- hickey 2024/04/08 -->
<template>
  <div class="bg-white flex-1 p-4 m-2.5 flex flex-col overflow-hidden">
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
        <el-select v-model="form.contractEntityCode" placeholder="请选择" filterable clearable>
          <el-option label="全部" value=""></el-option>
          <el-option v-for="c in customerList" :label="c.contractEntityName" :value="c.contractEntityCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="营收类型" prop="revenueType">
        <el-select v-model="form.revenueType" placeholder="请选择" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option v-for="t in revenueType" :label="t.label" :value="t.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="费用周期" prop="revenuePeriod">
        <el-date-picker
          type="month"
          v-model="form.revenuePeriod"
          placeholder="请选择"
          value-format="YYYYMM"
          :disabled-date="
            (time) => {
              const now = new Date();
              return time.getTime() > new Date(now.getFullYear(), now.getMonth()).getTime();
            }
          "
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="审核状态" prop="reviewStatus">
        <el-select v-model="form.reviewStatus" placeholder="请选择" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option v-for="s in reviewStatus" :label="s.label" :value="s.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="查询日期" prop="dateRange">
        <el-date-picker
          type="daterange"
          v-model="form.dateRange"
          start-placeholder="起始日期"
          end-placeholder="截至日期"
          value-format="YYYY-MM-DD"
          :disabled-date="(time) => time.getTime() > Date.now()"
          clearable
        ></el-date-picker>
      </el-form-item>
      <div class="float-right">
        <el-button type="primary" @click="query">搜索</el-button>
        <el-button @click="() => $refs.form.resetFields()">重置</el-button>
      </div>
    </el-form>
    <el-table v-loading="loading" :data="list" height="100%" :setTable="[]" border>
      <template #prepend>
        <div class="ion-table-summary">
          <div class="summary-item">
            <div class="item-label">累计营收</div>
            <span class="item-content" data-unit="元">{{ $formatNum.numSection(summary.totalRevenueAmount ?? 0, 2) }}</span>
          </div>
          <div class="summary-item">
            <div class="item-label">累计实收</div>
            <span class="item-content" data-unit="元">{{ $formatNum.numSection(summary.totalPayedAmount ?? 0, 2) }}</span>
          </div>
          <div class="summary-item">
            <div class="item-label">本月营收</div>
            <span class="item-content" data-unit="元">{{ $formatNum.numSection(summary.currentRevenueAmount ?? 0, 2) }}</span>
          </div>
        </div>
      </template>
      <el-table-column label="序号" type="index" width="60" fixed="left"></el-table-column>
      <el-table-column label="项目名称" prop="projectShortName" min-width="140" fixed="left"></el-table-column>
      <el-table-column label="客户名称" prop="contractEntityName" min-width="240" fixed="left" :show-overflow-tooltip="false">
        <template #default="{ row }">
          <el-button type="primary" link truncated @mouseover="showCustomerInfo($event, row)">{{ row.contractEntityName ?? '-' }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="营收名称" prop="revenueName" min-width="200" fixed="left" :show-overflow-tooltip="false">
        <template #default="{ row }">
          <el-button type="primary" link @click="toRevenueDetail(row)">{{ row.revenueName }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="营收类型" prop="revenueType" min-width="120" :formatter="revenueTypeFormatter"></el-table-column>
      <el-table-column label="营收单号" prop="revenueCode" min-width="160"></el-table-column>
      <el-table-column label="营收金额" prop="revenueAmount" min-width="100" numFormat></el-table-column>
      <el-table-column label="是否预收" prop="preRevenueFlag" min-width="100">
        <template #default="{ row }">
          <span v-if="row.preRevenueFlag == '0'">非预收</span>
          <span v-else-if="row.preRevenueFlag == '1'">预收</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="费用账期" prop="revenuePeriod" min-width="100">
        <template #default="{ row }">
          {{ row.revenuePeriod?.replace?.(/(\d{4})(\d{2})/, '$1-$2') ?? '-' }}
        </template>
      </el-table-column>
      <el-table-column label="审核状态" prop="reviewStatus" min-width="130">
        <template #default="{ row }">
          <span :class="['ion-status', reviewStatusClass(row)]">
            {{ reviewStatus.find((s) => s.value === row.reviewStatus)?.label ?? '-' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="逾期天数" prop="lateDays" min-width="100"></el-table-column>
      <el-table-column label="逾期违约金" prop="lateFeeAmount" min-width="100" numFormat></el-table-column>
      <el-table-column label="减免金额" prop="minusFee" min-width="100" numFormat></el-table-column>
      <el-table-column label="合计应收" prop="totalAmount" min-width="100" numFormat></el-table-column>
      <el-table-column label="已收款金额" prop="totalPayedAmount" min-width="100" numFormat></el-table-column>
      <el-table-column label="结算开始日" prop="settlementStartDt" min-width="120"></el-table-column>
      <el-table-column label="结算结束日" prop="settlementEndDt" min-width="120"></el-table-column>
      <!-- <el-table-column label="合同编号" prop="contractCode" min-width="120" strTruncate></el-table-column> -->
      <el-table-column label="备注/收款原因" prop="revenueMemo" min-width="140"></el-table-column>
      <el-table-column label="单据来源" prop="createType" min-width="100">
        <template #default="{ row }">
          <span v-if="row.createType == '0'">手工录入</span>
          <span v-else-if="row.createType == '1'">运营系统</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="开票状态" prop="invoiceStatus" min-width="100">
        <template #default="{ row }">
          <span v-if="row.invoiceStatus == '0'" class="ion-status ion-status_wait">未开票</span>
          <span v-else-if="row.invoiceStatus == '1'" class="ion-status ion-status_success">已开票</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="已开票金额" prop="invoiceAmount" min-width="100" numFormat></el-table-column>
      <el-table-column label="未开票金额" prop="unInvoiceAmount" min-width="100" numFormat></el-table-column> -->
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
    <el-popover :virtual-ref="popoverTigger" placement="top" trigger="hover" width="450px" virtual-triggering>
      <el-descriptions title="客户信息" :column="1">
        <el-descriptions-item label="客户名称:" label-class-name="w-32 inline-block">{{ popoverInfo?.contractEntityName }}</el-descriptions-item>
        <el-descriptions-item label-class-name="w-32 inline-block">
          <template #label>
            <span v-if="popoverInfo?.contractEntityType == '0'">身份证号:</span>
            <span v-else-if="popoverInfo?.contractEntityType == '1'">统一社会信用代码:</span>
            <span v-else>-</span>
          </template>
          {{ popoverInfo?.contractEntityCode ?? '-' }}
        </el-descriptions-item>
      </el-descriptions>
    </el-popover>
  </div>
</template>
<script>
import list from '@/mixins/list';
import * as api from './api';
export default {
  name: 'RevenueList',
  mixins: [list],
  data() {
    return {
      form: {
        projectCode: '', // 项目名称
        contractEntityType: '', // 客户类型
        contractEntityCode: '', // 客户名称
        revenueType: '', // 营收类型
        revenuePeriod: '', // 费用周期
        dateRange: [], // 查询日期
        createStartDateStr: '', // 查询日期
        endStartDateStr: '', // 查询日期
        reviewStatus: '' // 审核状态
      },
      revenueType: this.$useDict('settlement_revenue_type'), // 营收类型
      reviewStatus: this.$useDict('settlement_review_status'), // 审核状态
      projectList: [], // 项目列表
      customerList: [], // 客户列表
      summary: {}, // 营收单汇总
      list: [], // 营收单列表
      loading: false, // 加载状态
      popoverTigger: null, // 客户信息显示触发器
      popoverInfo: null // 客户信息
    };
  },
  created() {
    this.getProjectList();
    this.getCustomerList();
    this.query();
  },
  watch: {
    'form.projectCode'() {
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
    }
  },
  methods: {
    // 查询
    query() {
      this.getRevenueSummary();
      this.search(true);
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
    // 查询营收单汇总
    getRevenueSummary() {
      const { dateRange, ...form } = this.form;
      api.getRevenueSummaryList(form).then((res) => {
        this.summary = res.data;
      });
    },
    // 查询营收单列表
    search(resetPage) {
      // 只有在显式传入 true 时，才重置页码
      if (typeof resetPage === 'boolean') {
        this.currentPage = 1;
      }
      this.loading = true;
      const { dateRange, ...form } = this.form;
      api
        .getRevenueList({
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
    },
    // 营收类型格式化
    revenueTypeFormatter(row, col, val) {
      return this.revenueType.find((t) => t.value === val)?.label ?? '-';
    },
    // 跳转到营收详情
    toRevenueDetail(row) {
      this.$router.push({ path: '/revenue-manage/detail', query: { revenueId: row.revenueId } });
    },
    // 显示客户信息
    showCustomerInfo(ev, row) {
      this.popoverInfo = row;
      this.popoverTigger = ev.target;
    },
    // 根据审核状态计算样式类名
    reviewStatusClass(row) {
      switch (row.reviewStatus) {
        case '0':
          return 'ion-status_wait';
        case '1':
          return 'ion-status_success';
        case '9':
          return 'ion-status_error';
        default:
          return '';
      }
    }
  }
};
</script>

<style scoped lang="scss"></style>

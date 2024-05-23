<template>
  <div class="bg-white flex-1 p-4 m-2.5 flex flex-col overflow-hidden">
    <div class="p-4 ion-bg-primary">
      <div class="text-xl font-bold">{{ info.revenueName ?? '-' }}账单明细</div>
      <div class="flex flex-row">
        <div class="mt-2 ion-text-assist mr-4">营收单号: {{ info.revenueCode ?? '-' }}</div>
        <div class="mt-2 ion-text-assist mr-4">项目名称: {{ info.projectName ?? '-' }}</div>
        <div class="mt-2 ion-text-assist">客户名称: {{ info.contractEntityName ?? '-' }}</div>
      </div>
    </div>
    <el-table v-loading="loading" :data="list" height="100%" border>
      <el-table-column label="序号" type="index" width="60"></el-table-column>
      <el-table-column label="资产编号(如:电池编码)" prop="batteryCode" min-width="140"></el-table-column>
      <el-table-column label="备注(如:车辆VIN)" prop="vinCode" min-width="140" ></el-table-column>
      <el-table-column label="营收金额" prop="revenueAmount" min-width="100" numFormat></el-table-column>
      <el-table-column label="租金" prop="rent" min-width="100" numFormat></el-table-column>
      <el-table-column label="服务费" prop="serviceCharge" min-width="100" numFormat></el-table-column>
      <el-table-column label="电池使用费" prop="batteryUseFee" min-width="100" numFormat></el-table-column>
      <el-table-column label="超里程租金" prop="mileRent" min-width="100" numFormat></el-table-column>
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
  </div>
</template>

<script>
import list from '@/mixins/list';
import * as api from './api';
export default {
  mixins: [list],
  props: {
    revenueId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      info: {}, // 营收单详情
      list: [] // 营收详情列表
    };
  },
  created() {
    this.getDetail();
    this.search();
  },
  methods: {
    // 获取营收单详情
    getDetail() {
      this.loading = true;
      api
        .getRevenueDetail({ revenueId: this.revenueId })
        .then((res) => {
          this.info = res.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 查询营收单列表
    search(resetPage) {
      // 只有在显式传入 true 时，才重置页码
      if (typeof resetPage === 'boolean') {
        this.currentPage = 1;
      }
      this.loading = false;
      api
        .getRevenueDetailList({
          revenueId: this.revenueId,
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

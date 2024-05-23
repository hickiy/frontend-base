<!-- hickey 2024/04/08 -->
<template>
  <div class="bg-white p-4 m-2.5 flex-1 flex flex-col overflow-hidden">
    <div class="flex flex-row ion-search-area--bg pt-4 pl-4 pr-4">
      <el-form :model="form" label-min-width="auto" label-position="right" label-suffix=":" ref="form" inline>
        <el-form-item label="付方账户名称" prop="payEntityName">
          <el-input v-model="form.payEntityName" placeholder="请输入付方账户名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="核销状态" prop="verifyStatus">
          <el-select v-model="form.verifyStatus" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="c in verifyStatusList" :label="c.label" :value="c.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收方开户网点名称" prop="receiveBankName">
          <el-select v-model="form.receiveBankName" placeholder="请选择" filterable>
            <el-option label="全部" value=""></el-option>
            <el-option v-for="n in receiveBankNameList" :label="n" :value="n"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款日期" prop="payPeriod">
          <el-date-picker
            type="daterange"
            v-model="form.payPeriod"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            :disabled-date="(time) => time.getTime() > Date.now()"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div class="flex-shrink-0">
        <el-button type="primary" @click="query">搜索</el-button>
        <el-button @click="() => $refs.form.resetFields()">重置</el-button>
      </div>
    </div>
    <el-table v-loading="loading" :data="list" height="100%" :setTable="[]" border @selection-change="selectionChange">
      <template #prepend>
        <div class="flex flex-row items-center">
          <div class="ion-table-summary">
            <div class="summary-item">
              <div class="item-label">累计收款</div>
              <span class="item-content" data-unit="元">{{ $formatNum.numSection(summary.settlementTotalAmount, 2) }}</span>
            </div>
            <div class="summary-item">
              <div class="item-label">已认领/核销</div>
              <span class="item-content" data-unit="元">{{ $formatNum.numSection(summary.verifiedTotalAmount, 2) }}</span>
            </div>
            <div class="summary-item">
              <div class="item-label">未认领/核销</div>
              <span class="item-content" data-unit="元">{{ $formatNum.numSection(summary.unverifiedTotalAmount, 2) }}</span>
            </div>
          </div>
          <el-button type="primary" v-hasPermi="['smt:receipt:import']" @click="importCollectionRecord">收款导入</el-button>
          <el-button type="primary" v-hasPermi="['smt:receipt:delete']" @click="deleteReceipt">删除</el-button>
        </div>
      </template>
      <el-table-column type="selection" width="60" :selectable="(row) => row.verifyFlag"></el-table-column>
      <el-table-column label="序号" type="index" width="60"></el-table-column>
      <el-table-column label="付方账户名称" prop="payEntityName" min-width="120"></el-table-column>
      <el-table-column label="付款金额" prop="settlementAmount" min-width="120" numFormat></el-table-column>
      <el-table-column label="付款时间" prop="payLastTime" min-width="180"></el-table-column>
      <el-table-column label="摘要" prop="settlementMemo" min-width="120"></el-table-column>
      <el-table-column label="付方开户网点名称" prop="payBankName" min-width="140"></el-table-column>
      <el-table-column label="付方账号" prop="payEntityAccount" min-width="200"></el-table-column>
      <el-table-column label="已核销金额" prop="verifiedAmount" min-width="120" numFormat></el-table-column>
      <el-table-column label="未核销金额" prop="unverifiedAmount" min-width="120" numFormat></el-table-column>
      <el-table-column label="收方账户名称" prop="receiveEntityName" min-width="120"></el-table-column>
      <el-table-column label="收方开户网点名称" prop="receiveBankName" min-width="140"></el-table-column>
      <el-table-column label="收方账号" prop="receiveEntityAccount" min-width="200"></el-table-column>
      <el-table-column label="交易流水号" prop="transactionNumber" min-width="200"></el-table-column>
      <el-table-column label="单据来源" prop="srcType" min-width="120" #default="{ row }">
        <span v-if="row.srcType == '0'">手工录入</span>
        <span v-else-if="row.srcType == '1'">财务系统</span>
        <span v-else>-</span>
      </el-table-column>
      <el-table-column label="操作" width="170" fixed="right" #default="{ row }">
        <el-button v-if="row.unverifiedAmount > 0" link type="primary" @click="verifyReceipt(row)">收款核销</el-button>
        <el-button link type="primary" @click="toDetail(row)" v-if="!row.verifyFlag">核销明细</el-button>
      </el-table-column>
    </el-table>
    <div class="flex flex-row justify-end mt-4">
      <!-- <div class="ml-4 font-bold ion-text-primary">
        已选中 {{ selectedList.length }} 条记录，合计 {{ $formatNum.numSection(unVerifiedAmountTotal) }} 元
      </div> -->
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
<script lang="jsx">
import list from '@/mixins/list';
import * as api from './api';
export default {
  // name: 'ReceiptManage',
  mixins: [list],
  data() {
    return {
      form: {
        payEntityName: '', // 付方账户名称
        verifyStatus: '', // 核销状态
        receiveBankName: '', // 收方开户网点名称
        payStartTime: '', // 付款开始时间
        payEndTime: '', // 付款结束时间
        payPeriod: [] // 付款日期范围
      },
      loading: false, // 加载状态
      verifyStatusList: this.$useDict('settlement_verify_status'), // 核销状态列表
      receiveBankNameList: [], // 收方开户网点名称列表
      list: [], // 列表数据
      summary: {}, // 汇总数据
      selectedList: [] // 选中的数据
    };
  },
  created() {
    this.getBankList();
    this.query();
  },
  computed: {
    // 未核销金额合计
    // unVerifiedAmountTotal() {
    //   return this.selectedList.reduce((total, item) => total + item.unverifiedAmount, 0);
    // }
  },
  watch: {
    // 付款日期范围处理
    'form.payPeriod'(val) {
      if (val && val.length === 2) {
        this.form.payStartTime = val[0];
        this.form.payEndTime = val[1];
      } else {
        this.form.payStartTime = '';
        this.form.payEndTime = '';
      }
    }
  },
  methods: {
    query() {
      this.search(true);
      this.getSummary();
    },
    // 获取收方开户网点名称列表
    getBankList() {
      api.getBankList().then((res) => {
        this.receiveBankNameList = res.data;
      });
    },
    // 搜索
    search(isReset) {
      if (isReset) {
        this.currentPage = 1;
      }
      this.loading = true;
      const { payPeriod, ...rest } = this.form;
      api
        .getReceiptList({ ...this._pageInfo, ...rest })
        .then((res) => {
          this.list = res.rows;
          this.total = res.total;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 获取汇总数据
    getSummary() {
      const { payPeriod, ...rest } = this.form;
      api.getReceiptStatistics(rest).then((res) => {
        this.summary = res.data;
      });
    },
    // 删除收款记录
    deleteReceipt() {
      if (this.selectedList.length === 0) {
        this.$message.warning('请选择要删除的收款记录');
        return;
      } else if (this.selectedList.some((item) => item.verifiedAmount != null && item.verifiedAmount != 0)) {
        this.$message.warning('已核销的收款记录不能删除');
        return;
      }
      this.$confirm('确定删除该收款记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.selectedList.map((item) => item.settlementId);
        api.deleteReceipt(ids).then(() => {
          this.$message.success('删除成功');
          this.search();
          this.getSummary();
        });
      });
    },
    // 收款核销
    verifyReceipt(row) {
      this.$router.push({ path: '/receipt-manage/verify', query: { settlementId: row.settlementId } });
    },
    // 导入收款记录
    importCollectionRecord() {
      let file = null;
      this.$msgbox({
        title: '收款导入',
        message: () => [
          <el-upload
            drag
            list-type="text"
            auto-upload={false}
            accept=".xls, .xlsx"
            limit={1}
            on-change={(f) => (file = f)}
            on-remove={() => (file = null)}
          >
            {{
              default: () => [
                <el-icon class="el-icon--upload" size={60}>
                  <upload-filled />
                </el-icon>,
                <div class="el-upload__text">点击或拖拽上传收款记录</div>
              ],
              tip: () => <div class="el-upload__tip">请按指定模板导入收款记录</div>
            }}
          </el-upload>,
          <el-button
            type="primary"
            text
            onClick={() => this.$download('/files/lease/template/收款明细导入模板.xlsx', { baseURL: '', fileName: '收款明细导入模板.xlsx' })}
          >
            下载导入模板
          </el-button>
        ],
        customClass: 'ion-upload-dialog',
        customStyle: { '--el-messagebox-width': '600px' },
        showClose: false,
        closeOnClickModal: false,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            if (!file) {
              this.$message.warning('请上传文件');
              return;
            }
            instance.confirmButtonLoading = true;
            const formData = new FormData();
            formData.append('file', file.raw);
            api
              .importReceipt(formData)
              .then(() => {
                this.$message.success('导入成功');
                this.search();
                this.getSummary();
                done();
              })
              .finally(() => {
                instance.confirmButtonLoading = false;
              });
          } else {
            done();
          }
        }
      });
    },
    // 选中数据
    selectionChange(val) {
      this.selectedList = val;
    },
    // 跳转到核销明细
    toDetail(row) {
      this.$router.push({ path: '/receipt-manage/detail', query: { settlementId: row.settlementId } });
    }
  }
};
</script>

<style scoped lang="scss"></style>

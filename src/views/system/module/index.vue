<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="模块名称" prop="moduleName">
        <el-input v-model="queryParams.moduleName" placeholder="请输入模块名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="路由地址" prop="path">
        <el-input v-model="queryParams.path" placeholder="请输入路由地址" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="路由参数" prop="paramPath">
        <el-input v-model="queryParams.paramPath" placeholder="请输入路由参数" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="模块显隐状态" prop="hideModule">
        <el-input v-model="queryParams.hideModule" placeholder="请输入模块显隐状态" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="显示顺序" prop="sort">
        <el-input v-model="queryParams.sort" placeholder="请输入显示顺序" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="公共模块" prop="isCommon">
        <el-input v-model="queryParams.isCommon" placeholder="请输入公共模块" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="默认模块" prop="isDefault">
        <el-input v-model="queryParams.isDefault" placeholder="请输入默认模块" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd" v-hasPermi="['system:module:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" :disabled="single" @click="handleUpdate" v-hasPermi="['system:module:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:module:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" @click="handleExport" v-hasPermi="['system:module:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="moduleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="模块Id" align="center" prop="moduleId" />
      <el-table-column label="模块名称" align="center" prop="moduleName" />
      <el-table-column label="模块logo" align="center" prop="logo" show-overflow-tooltip />
      <el-table-column label="路由地址" align="center" prop="path" />
      <el-table-column label="路由参数" align="center" prop="paramPath" />
      <el-table-column label="模块类型" align="center" prop="type" />
      <el-table-column label="模块显隐状态" align="center" prop="hideModule" />
      <el-table-column label="显示顺序" align="center" prop="sort" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="{ row }">
          <el-switch v-model="row.status" active-value="0" inactive-value="1" @change="handleStatusChange(row)"> </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="公共模块" align="center" prop="isCommon" />
      <el-table-column label="默认模块" align="center" prop="isDefault" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button text icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:module:edit']">修改</el-button>
          <el-button text icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:module:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改模块信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="模块名称" prop="moduleName">
          <el-input v-model="form.moduleName" placeholder="请输入模块名称" />
        </el-form-item>
        <el-form-item label="模块logo" prop="logo">
          <ImageUpload :limit="1" :value="form.logo" @input="uploaded" />
        </el-form-item>
        <el-form-item label="路由地址" prop="path">
          <el-input v-model="form.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item label="路由参数" prop="paramPath">
          <el-input v-model="form.paramPath" placeholder="请输入路由参数" />
        </el-form-item>
        <el-form-item label="模块显隐状态" prop="hideModule">
          <el-input v-model="form.hideModule" placeholder="请输入模块显隐状态" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入显示顺序" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="公共模块" prop="isCommon">
          <el-input v-model="form.isCommon" placeholder="请输入公共模块" />
        </el-form-item>
        <el-form-item label="默认模块" prop="isDefault">
          <el-input v-model="form.isDefault" placeholder="请输入默认模块" />
        </el-form-item>
        <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listModule, getModule, delModule, addModule, updateModule, updateModuleInfo } from '@/api/system/module';
import ImageUpload from '@/components/ImageUpload';

export default {
  components: { ImageUpload },
  name: 'Module',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 模块信息表格数据
      moduleList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        moduleName: null,
        logo: null,
        path: null,
        paramPath: null,
        type: null,
        hideModule: null,
        sort: null,
        status: null,
        isCommon: null,
        isDefault: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        moduleName: [{ required: true, message: '模块名称不能为空', trigger: 'blur' }],
        logo: [{ required: true, message: '模块logo不能为空', trigger: 'blur' }],
        path: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '模块类型不能为空', trigger: 'change' }],
        hideModule: [{ required: true, message: '模块显隐状态不能为空', trigger: 'blur' }],
        sort: [{ required: true, message: '显示顺序不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
        isCommon: [{ required: true, message: '公共模块不能为空', trigger: 'blur' }],
        isDefault: [{ required: true, message: '默认模块不能为空', trigger: 'blur' }],
        delFlag: [{ required: true, message: '删除标志不能为空', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    uploaded(logo) {
      this.form.logo = logo;
    },
    /** 查询模块信息列表 */
    getList() {
      this.loading = true;
      listModule(this.queryParams).then((response) => {
        this.moduleList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        moduleId: null,
        moduleName: null,
        logo: null,
        path: null,
        paramPath: null,
        type: null,
        hideModule: null,
        sort: null,
        status: '0',
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        isCommon: null,
        isDefault: null,
        delFlag: null,
        tenantId: null
      };
      this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.moduleId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加模块信息';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const moduleId = row.moduleId || this.ids;
      getModule(moduleId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = '修改模块信息';
      });
    },
    // 角色状态修改
    handleStatusChange(row) {
      let text = row.status === '0' ? '启用' : '停用';
      this.$modal
        .confirm('确认要"' + text + '""' + row.moduleName + '"模块吗？')
        .then(function () {
          return updateModule(row.moduleId, row.status);
        })
        .then(() => {
          this.$modal.success(text + '成功');
        })
        .catch(function () {
          row.status = row.status === '0' ? '1' : '0';
        });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.moduleId != null) {
            updateModuleInfo(this.form).then((response) => {
              this.$modal.success('修改成功');
              this.open = false;
              this.getList();
            });
          } else {
            addModule(this.form).then((response) => {
              this.$modal.success('新增成功');
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const moduleIds = row.moduleId || this.ids;
      this.$modal
        .confirm('是否确认删除模块信息编号为"' + moduleIds + '"的数据项？')
        .then(function () {
          return delModule(moduleIds);
        })
        .then(() => {
          this.getList();
          this.$modal.success('删除成功');
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'system/module/export',
        {
          ...this.queryParams
        },
        `module_${new Date().getTime()}.xlsx`
      );
    }
  }
};
</script>

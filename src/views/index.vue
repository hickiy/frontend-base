<template>
  <div>
    <el-form :model="form">
      <el-form-item label="附件上传" prop="fileList" :rules="[{ required: true, type: 'array', min: 1, message: 'xxxxx' }]">
        <el-upload v-model:file-list="form.fileList" :limit="1" list-type="picture-card" accept=".png">
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Plus } from '@element-plus/icons-vue';
export default {
  components: {
    Plus
  },
  data() {
    return {
      form: {
        fileList: []
      }
    };
  }
};
</script>

<template>
  <div>
    <el-upload v-model:file-list="fileList" list-type="picture-card" accept=".png">
      <el-icon><Plus /></el-icon>
    </el-upload>
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Plus } from '@element-plus/icons-vue';

const fileList = ref([]);

const dialogImageUrl = ref('');
const dialogVisible = ref(false);
</script>

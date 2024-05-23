<template>
  <div>
    <el-dialog :visible.sync="visible" top="20vh" :title="title">
      <div class="flex flex-row flex-wrap pl-5">
        <div v-for="(c, index) in fileList" :key="index" class="mr-5 w-50">
          <div class="text-sm ion-text-assist mb-1">{{ c.name }}:</div>
          <el-preview-file
            class="border border-solid ion-border-primary w-full h-35"
            :file="c"
            :preview-src-list="fileList.map((i) => i.fileUrl || i.url)"
          ></el-preview-file>
          <div class="ion-bg-file-name text-center text-white pt-1 pb-1 pl-2.5 pr-2.5 cursor-pointer" :title="c.fileName || c.name">
            {{ c.fileName || c.name || '无文件名称' }}
          </div>
        </div>
      </div>
    </el-dialog>
    <el-image ref="single-img" style="display: none" :src="src" :preview-src-list="previewImgList"></el-image>
  </div>
</template>

<script>
export default {
  name: 'file-viewer',
  data() {
    return {
      visible: false, // 是否显示
      fileList: [], // 文件列表
      src: '', // 视图url
      previewImgList: [], // 预览图片列表
      title: '附件查看' // 标题
    };
  },
  methods: {
    showFile(fileList, title) {
      if (title) this.title = title;
      if (Array.isArray(fileList) && fileList.length > 0) {
        if (fileList.length > 1) {
          this.fileList = fileList;
          this.visible = true;
        } else {
          const file = fileList[0];
          if (/pdf$/i.test(file.fileUrl || file.url)) {
            open(file.fileUrl || file.url, '_blank');
          } else {
            this.src = file.fileUrl || file.url;
            this.previewImgList = [this.src];
            setTimeout(this.$refs['single-img'].clickHandler, 0);
          }
        }
      } else {
        this.$message.warning('无可供预览附件');
      }
    }
  }
};
</script>

<style></style>

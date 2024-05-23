<template>
  <div class="preview-file">
    <el-image
      v-if="this.src"
      @click.capture.stop="clickHandler($event)"
      fit="contain"
      ref="viewer"
      class="w-full h-full"
      :src="src"
      :preview-src-list="previewSrcList"
    ></el-image>
    <FileViewer ref="file-viewer"></FileViewer>
  </div>
</template>

<script>
import { getFrameByPageOfPdf } from '@/api/common.js';
import { parseOfdDocument, renderOfd } from 'ion-ofd/lib/ofd.common';

import axios from 'axios';

import zipIcon from '@/assets/svg/zip.svg';
import xlsIcon from '@/assets/images/excel.png';

// 1-image，2-pdf, 3-zip, 4-ofd, 5-xls
const IMAGE = 1,
  PDF = 2,
  ZIP = 3,
  OFD = 4,
  XLS = 5;
export default {
  name: 'el-preview-file',
  props: {
    // 文件对象
    file: {
      type: [String, Object],
      required: true
    },
    // 预览图片列表
    previewSrcList: {
      type: Array,
      default: () => []
    },
    // 文件列表
    fileList: {
      type: Array,
      default: () => []
    },
    // 标题
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      src: '', // 视图url
      fileType: null,
      fileUrl: '' // 文件url
    };
  },
  created() {
    this.init();
  },
  watch: {
    file: {
      deep: true,
      handler() {
        this.init();
      }
    }
  },
  beforeDestroy() {
    URL.revokeObjectURL(this.url);
  },
  methods: {
    init() {
      const pdfReg = /pdf$/i;
      const zipReg = /zip$/i;
      const ofdReg = /ofd$/i;
      const xlsReg = /xlsx?$/i;
      let fileTypeText = '';
      let localUrl = '';
      if (Object.prototype.toString.call(this.file) == '[object Object]') {
        const { fileUrl, url, name } = this.file;
        if (fileUrl) {
          fileTypeText = fileUrl;
        } else if (/\..+$/.test(url)) {
          fileTypeText = url;
        } else {
          fileTypeText = name;
        }
        localUrl = fileUrl || url;
      } else if (typeof this.file == 'string') {
        fileTypeText = this.file;
        localUrl = this.file;
      }
      if (pdfReg.test(fileTypeText)) {
        this.renderPdf(localUrl);
        this.fileType = PDF;
      } else if (ofdReg.test(fileTypeText)) {
        this.renderOfd(localUrl);
        this.fileType = OFD;
      } else if (zipReg.test(fileTypeText)) {
        this.src = zipIcon;
        this.fileType = ZIP;
      } else if (xlsReg.test(fileTypeText)) {
        this.src = xlsIcon;
        this.fileType = XLS;
      } else {
        this.src = localUrl;
        this.fileType = IMAGE;
      }
      this.fileUrl = localUrl;
    },
    clickHandler(ev) {
      if (this.fileType == PDF) {
        if (this.fileList.length >= 2) {
          this.$refs['file-viewer'].showFile(this.fileList, this.title);
        } else {
          this.viewPdf(this.fileUrl);
        }
      } else if (this.fileType == XLS) {
        this.downloadFile(this.fileUrl);
      } else if (this.previewSrcList.length) {
        this.$refs.viewer.clickHandler(ev);
      }
    },
    viewPdf(href) {
      window.open(href, '_plant');
    },
    downloadFile(url) {
      const fileName = url.split('/').pop();
      this.$download(url, {
        baseURL: '/',
        fileName
      });
    },
    renderPdf(pdfPath) {
      if (!pdfPath) return console.warn('文件路径不存在');
      getFrameByPageOfPdf({ url: pdfPath })
        .then((res) => {
          this.src = URL.createObjectURL(res);
        })
        .catch(console.log);
    },
    renderOfd(ofdUrl) {
      if (!ofdUrl) return console.warn('文件路径不存在');
      axios
        .get(ofdUrl, {
          responseType: 'blob'
        })
        .then((res) => {
          var that = this;
          parseOfdDocument({
            ofd: new File([res.data], {}),
            success(res) {
              var divs = renderOfd(1060, res[0]);
              const xmlSerializer = new XMLSerializer();
              const html = xmlSerializer.serializeToString(divs[0]);
              const svg = `
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='1060px'
                  height='700px'
                >
                  <foreignObject
                    x='0'
                    y='0'
                    width='100%'
                    height='100%'
                  >
                    ${html}
                  </foreignObject>
                </svg>
              `;
              that.src = `data:image/svg+xml;charset=utf-8,${svg}`;
              if (that.previewSrcList.length) {
                that.previewSrcList.splice(0, 1, that.src);
              }
            },
            fail(error) {
              console.warn('解析ofd失败');
            }
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.tip {
  display: block;
  height: 30px;
  line-height: 30px;
  color: #fff;
  background: #999;
}
</style>

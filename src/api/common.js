import request from '@/utils/request';

// pdf分页获取
export function getFrameByPageOfPdf(data) {
  return request({
    url: '/file/pdfFile/getPdfPageImage',
    method: 'post',
    responseType: 'blob',
    data,
    headers: {
      repeatSubmit: false
    }
  });
}



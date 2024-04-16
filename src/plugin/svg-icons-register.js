import request from '@/utils/request';

request({
  baseURL: '/',
  url: '/icons.svg',
  method: 'get',
}).then(res => {
  const body = document.body;
  function loadSvg() {
    const Domeparser = new DOMParser();
    const svgDom = Domeparser.parseFromString(res, 'image/svg+xml').documentElement;
    body.insertBefore(svgDom, body.firstChild);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSvg);
  } else {
    loadSvg()
  }
});
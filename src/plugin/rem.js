/**
 * @param {uiDsingWidth} 设计图宽度 默认 1920
 * @param {splitCount} 分为多少份，默认24份
 *  */

import { uiDsingWidth, baseRemUnit } from '@/config.js'
const splitCount = uiDsingWidth / baseRemUnit;

import { debounce } from '@/utils/debounce.js'

const resizeHandler = function () {
  let doc = document.documentElement;
  let vw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  let scale = vw / uiDsingWidth;
  let baseSize = uiDsingWidth / splitCount;
  let size = (baseSize * scale).toFixed();
  doc.style.fontSize = size + 'px';
};

resizeHandler();

window.addEventListener('resize', debounce(resizeHandler))

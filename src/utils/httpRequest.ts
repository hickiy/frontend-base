import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router/index';
import { getToken } from '@/utils/cookies';

import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const http = axios.create({
  timeout: 1000 * 3600 * 2,
  baseURL: '/api',
  withCredentials: true
});

/**
 * 请求拦截
 */
http.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  if (getToken()) {
    config.headers['Authorization'] = 'Bearer ' + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config;
});

/**
 * 响应拦截
 */

http.interceptors.response.use(
  (res: AxiosResponse) => {
    if (res?.data?.code == 200) {
      return res.data;
    } else {
      switch (res?.data?.code) {
        case 401:
          router.push('/login');
          break;
        default:
      }
      if (res?.data?.msg) {
        ElMessage.error(res?.data?.msg);
      }
      return Promise.reject(res?.data);
    }
  },
  (err) => {
    if (err?.response) {
      switch (err.response?.status) {
        case 400:
          err.msg = '请求错误(400)';
          break;
        case 401:
          err.msg = '未授权，请重新登录(401)';
          break;
        case 403:
          err.msg = '拒绝访问(403)';
          break;
        case 404:
          err.msg = '请求出错(404)';
          break;
        case 408:
          err.msg = '请求超时(408)';
          break;
        case 500:
          err.msg = '服务器错误(500)';
          break;
        case 501:
          err.msg = '服务未实现(501)';
          break;
        case 502:
          err.msg = '网络错误(502)';
          break;
        case 503:
          err.msg = '服务不可用(503)';
          break;
        case 504:
          err.msg = '网络超时(504)';
          break;
        case 505:
          err.msg = 'HTTP版本不受支持(505)';
          break;
        default:
          err.msg = `连接出错(${err.response.status})!`;
      }
    } else {
      if (/Network\sError/i.test(err.msg)) {
        err.msg = '网络错误';
      } else if (/timeout\sof/.test(err.msg)) {
        err.msg = '网络请求超时';
      }
    }
    if (err.msg) {
      ElMessage.error(err.msg);
    }
    return Promise.reject(err);
  }
);

export default http;

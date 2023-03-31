import { defineStore } from 'pinia';
import request from '@/utils/httpRequest';
import { setToken } from '@/utils/cookies';

export default defineStore('user', {
  state: () => {
    return {
      userInfo: {},
      menus: []
    };
  },
  actions: {
    login(data: any) {
      return request({
        method: 'post',
        url: '/login',
        data,
        headers: {
          isToken: false
        }
      }).then((res: any) => {
        setToken(res.token);
      });
    },
    getUserInfo() {
      return request({
        method: 'get',
        url: '/getInfo'
      }).then((res: any) => {
        this.userInfo = res.user;
      });
    },
    getMenu() {
      return request({
        method: 'get',
        url: '/getRouters'
      }).then((res: any) => {
        this.menus = res.data;
      });
    }
  }
});

import { defineStore } from 'pinia';
import request from '@/utils/httpRequest';

export default defineStore('user', {
  state: () => {
    return {
      userInfo: {},
      menus: []
    };
  },
  actions: {
    async init() {
      await this.getUserInfo();
      await this.getMenu();
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

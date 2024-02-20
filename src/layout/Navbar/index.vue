<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      class="hamburger-container cursor-pointer"
      :is-active="appStore.sidebar.opened"
      @toggleClick="toggleSideBar"
    />
    <a href="/">
      <img class="right-logo" style="width: 140px" src="@/assets/images/home_logo@2x.png" />
    </a>
    <el-divider direction="vertical"></el-divider>
    <div class="text-xl font-bold grow">{{ title }}</div>
    <el-icon><Bell /></el-icon>
    <div class="avatar-container pr-5">
      <el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper flex items-center">
          <img src="@/assets/images/profile.jpg" class="user-avatar mr-5" />
          <span class="text-sm font-bold">{{ userStore.name }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/user/profile">
              <el-dropdown-item>个人中心</el-dropdown-item>
            </router-link>
            <el-dropdown-item command="setting">
              <router-link to="/system/user">
                <span>设置</span>
              </router-link>
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup name="Navbar">
import { ElIcon, ElMessageBox } from 'element-plus';
import Hamburger from '@/components/Hamburger';
import useAppStore from '@/store/modules/app';
import useUserStore from '@/store/modules/user';

const appStore = useAppStore();
const userStore = useUserStore();

const title = import.meta.env.VITE_TITLE;

function toggleSideBar() {
  appStore.toggleSideBar();
}

function handleCommand(command) {
  switch (command) {
    case 'logout':
      logout();
      break;
    default:
      break;
  }
}

function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      userStore.logOut().then(() => {
        location.href = '/index';
      });
    })
    .catch(() => {});
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.module.scss';
.navbar {
  height: $base-navbar-height;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    font-size: 18px;
    color: #5a5e66;
    vertical-align: text-bottom;
    &.hover-effect {
      cursor: pointer;
    }
    .user-avatar {
      cursor: pointer;
      width: 24px;
      height: 24px;
      border-radius: 20px;
    }
  }
}
</style>

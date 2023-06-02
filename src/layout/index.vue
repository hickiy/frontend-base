<!-- hickey 2023 -->
<template>
  <div v-if="inIframe">
    <router-view></router-view>
  </div>
  <div class="h-screen" v-else>
    <el-container class="h-full">
      <el-aside width="250px" class="bg-blue-600">
        <SideBar></SideBar>
      </el-aside>
      <el-container>
        <el-header>
          <Header></Header>
        </el-header>
        <el-main>
          <router-view v-slot="{ Component }">
            <transition name="el-fade-in-linear" mode="out-in">
              <keep-alive>
                <component :is="Component"></component>
              </keep-alive>
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import Header from '@/layout/header.vue';
import SideBar from '@/layout/sidebar.vue';

const inIframe: Boolean = self !== top;
</script>

<style></style>

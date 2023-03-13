<!-- hickey 2023 -->
<template>
  <div class="min-h-screen flex flex-col items-center justify-center">
    <el-form class="w-[400px]" ref="loginRef" :model="loginForm" :rules="loginRules">
      <h3 class="title"></h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" size="large" auto-complete="off" placeholder="账号">
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" size="large" auto-complete="off" placeholder="密码"
          @keyup.enter="handleLogin">
        </el-input>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item>
        <el-button size="large" style="width:100%;" @click="handleLogin">登 录</el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <span class="absolute bottom-8">Copyright © 2018-2023 hickey.ionrocking All Rights Reserved.</span>
  </div>
</template>

<script setup>
import Cookies from "js-cookie";

const loginForm = ref({
  username: "admin",
  password: "admin123",
  rememberMe: false,
});

const loginRules = {
  username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
  password: [{ required: true, trigger: "blur", message: "请输入您的密码" }],
  code: [{ required: true, trigger: "change", message: "请输入验证码" }]
};

const loading = ref(false);



function handleLogin() {

}

function getCookie() {
  const username = Cookies.get("username");
  const password = Cookies.get("password");
  const rememberMe = Cookies.get("rememberMe");
  loginForm.value = {
    username: username === undefined ? loginForm.value.username : username,
    password: password === undefined ? loginForm.value.password : decrypt(password),
    rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
  };
}

</script>

<style></style>

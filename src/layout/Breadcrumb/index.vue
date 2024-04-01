<template>
  <el-breadcrumb id="breadcrumb-container" class="breadcrumb-container app-breadcrumb w-full ml-15px" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.id">
        <span v-if="item.redirect === 'noRedirect' || index == breadcrumbs.length - 1" class="no-redirect">{{
          item.title
        }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup name="Breadcrumb">
import useViewsStore from '@/store/modules/views';
const router = useRouter();
const { breadcrumbs } = useViewsStore();
function handleLink(item) {
  if (item.routeType == 'folder') return;
  router.push({ path: item.fullPath });
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 40px;
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
@/store/modules/views

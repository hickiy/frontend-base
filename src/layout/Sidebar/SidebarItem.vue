<template>
  <div v-if="!item.hidden">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path, onlyOneChild.query)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <svg-icon class="mr-2 text-base" :icon-class="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"></svg-icon>
          <template #title>
            <span class="menu-title" :title="hasTitle(onlyOneChild.meta.title)">{{ onlyOneChild.meta.title }}</span>
          </template>
        </el-menu-item>
      </app-link>
    </template>
    <el-sub-menu
      :class="{ 'is-collapse': !isCollapse }"
      v-else
      ref="subMenu"
      :index="resolvePath(item.path)"
      teleported
    >
      <template #title>
        <svg-icon class="mr-2 text-base" :icon-class="item.meta && item.meta.icon"></svg-icon>
        <span v-if="item.meta && isCollapse" class="menu-title" :title="hasTitle(item.meta.title)">{{
          item.meta.title
        }}</span>
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :isCollapse="true"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script setup>
import { isExternal } from '@/utils/validate';
import AppLink from './Link';
// 返回项目路径
function getNormalPath(p) {
  if (p.length === 0 || !p || p == 'undefined') {
    return p;
  }
  let res = p.replace('//', '/');
  if (res[res.length - 1] === '/') {
    return res.slice(0, res.length - 1);
  }
  return res;
}

const props = defineProps({
  // route object
  item: {
    type: Object,
    required: true
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ''
  },
  isCollapse: {
    type: Boolean,
    default: false
  }
});

const onlyOneChild = ref({});

function hasOneShowingChild(children = [], parent) {
  if (!children) {
    children = [];
  }
  const showingChildren = children.filter((item) => {
    if (item.hidden) {
      return false;
    } else {
      // Temp set(will be used if only has one showing child)
      onlyOneChild.value = item;
      return true;
    }
  });

  // When there is only one child router, the child router is displayed by default
  if (showingChildren.length === 1) {
    return true;
  }

  // Show parent if there are no child router to display
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true };
    return true;
  }

  return false;
}

function resolvePath(routePath, routeQuery) {
  if (isExternal(routePath)) {
    return routePath;
  }
  if (isExternal(props.basePath)) {
    return props.basePath;
  }
  if (routeQuery) {
    let query = JSON.parse(routeQuery);
    return { path: getNormalPath(/^\//.test(routePath) ? routePath : props.basePath + '/' + routePath), query: query };
  }
  return getNormalPath(/^\//.test(routePath) ? routePath : props.basePath + '/' + routePath);
}

function hasTitle(title) {
  if (title.length > 5) {
    return title;
  } else {
    return '';
  }
}
</script>
<style scoped lang="scss">
.is-collapse:deep() {
  .el-sub-menu__title {
    padding-right: 0 !important;
  }
  .el-sub-menu__icon-arrow{
    right: 12px;
  }
}
</style>

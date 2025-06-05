<script setup>
import ExtractionPage from "./page/ExtractionPage.vue";
import {theme} from "ant-design-vue";
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import Index from "./page/index.vue";

</script>

<template>
  <a-config-provider
      :theme="{
        token: {
          colorPrimary: '#52c41a',
          // algorithm: theme.darkAlgorithm,
          borderRadius: 8
        }
      }"
      :locale="zhCN"
      >
  <router-view></router-view>
  </a-config-provider>
</template>

<style scoped>
html,body,#app{
  width: 100%;
  height: 100%;
  margin: 0 0;
  padding: 0;
}
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}
</style>

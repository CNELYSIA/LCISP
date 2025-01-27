<script setup>
import ExtractionPage from "./page/ExtractionPage.vue";
import {theme} from "ant-design-vue";
import zhCN from 'ant-design-vue/es/locale/zh_CN';

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

    <ExtractionPage />

  </a-config-provider>

</template>

<style scoped>

</style>

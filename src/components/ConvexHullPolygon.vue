<template>
  <div ref="chartContainer" style="height: 400px;"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
const props = defineProps({
  Data: Object
})

const chartContainer = ref(null);
const data = props.Data

onMounted(() => {
  const chart = echarts.init(chartContainer.value);
  const flatData = data.map(item => item[0]); // 将嵌套数组转换为平面数组
  const option = {
    xAxis: {
      type: 'value',
      min: Math.min(...flatData.map(point => point[0])) - 10,
      max: Math.max(...flatData.map(point => point[0])) + 10
    },
    yAxis: {
      type: 'value',
      min: Math.min(...flatData.map(point => point[1])) - 10,
      max: Math.max(...flatData.map(point => point[1])) + 10,
      inverse: true
    },
    series: [{
      type: 'line',
      coordinateSystem: 'cartesian2d',
      data: [...flatData, flatData[0]], // Closing the loop by adding the first point at the end
      smooth: true,
      symbol: 'none'
    }]
  };
  chart.setOption(option);
});
</script>

<style scoped>
/* Add any necessary styles here */
</style>

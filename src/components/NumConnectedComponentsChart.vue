<template>
  <div ref="numConnectedComponentsChart" style="width: 110%; height:20vh;"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
const props = defineProps({
  Data: {
    type: String,
    required: true
  },

})
const numConnectedComponentsChart = ref(null);
const numConnectedComponents = props.Data;

onMounted(() => {
  const numConnectedComponentsChartInstance = echarts.init(numConnectedComponentsChart.value);
  const option = {
    title: {
      text: '连通区数量',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: ['测量值']
    },
    yAxis: {
      type: 'value',
      name: '数量',
      scale: true,
      position: 'left'
    },
    series: [
      {
        data: [numConnectedComponents],
        type: 'bar',
        itemStyle: {
          color: '#fac858'
        }
      }
    ]
  };
  numConnectedComponentsChartInstance.setOption(option);
});
</script>

<style scoped>
/* Add any necessary styles here */
</style>

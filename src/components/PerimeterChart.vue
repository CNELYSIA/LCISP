<template>
  <div ref="perimeterChart" style=" width: 110%; height:20vh;"></div>
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
const perimeterChart = ref(null);
const perimeter = props.Data;

onMounted(() => {
  const perimeterChartInstance = echarts.init(perimeterChart.value);
  const option = {
    title: {
      text: '周长',
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
      data: ['测量值'],
    },
    yAxis: {
      type: 'value',
      name: '单位',
      scale: true,
      position: 'left'
    },
    series: [
      {
        data: [perimeter],
        type: 'bar',
        itemStyle: {
          color: '#5470c6'
        }
      }
    ]
  };
  perimeterChartInstance.setOption(option);
});
</script>

<style scoped>
/* Add any necessary styles here */
</style>

<template>
  <div ref="circularityChart" style="width: 110%; height:20vh"></div>
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
const circularityChart = ref(null);
const circularity = props.Data;

onMounted(() => {
  const circularityChartInstance = echarts.init(circularityChart.value);
  const option = {
    title: {
      text: '圆度',
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
      name: '单位',
      scale: true,
      position: 'left'
    },
    series: [
      {
        data: [circularity],
        type: 'bar',
        itemStyle: {
          color: '#91cc75'
        }
      }
    ]
  };
  circularityChartInstance.setOption(option);
});
</script>

<style scoped>
/* Add any necessary styles here */
</style>

<template>
  <div ref="chart" style="width: 100%; height: 20vh;"></div>
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
const chart = ref(null);
const fillFactor = props.Data;

onMounted(() => {
  const myChart = echarts.init(chart.value);

  const option = {
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '30',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: fillFactor * 100, name: '填充区域', itemStyle: { color: '#5470c6' } },
          { value: (1 - fillFactor) * 100, name: '非填充区域', itemStyle: { color: '#eee' } }
        ]
      }
    ]
  };

  myChart.setOption(option);
});
</script>

<style scoped>
/* Add any necessary styles here */
</style>




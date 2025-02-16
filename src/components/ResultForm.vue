<script setup>
// 定义Props
import {getCurrentInstance, onMounted, ref} from "vue";
import ConvexHullPolygon from "./ConvexHullPolygon.vue";
import OrientationAngle from "./OrientationAngle.vue";
import FillFactor from "./FillFactor.vue";
import PerimeterChart from "./PerimeterChart.vue";
import CircularityChart from "./CircularityChart.vue";
import NumConnectedComponentsChart from "./NumConnectedComponentsChart.vue";

const {proxy} = getCurrentInstance()
const props = defineProps({
  Result: {
    type: Object,
    required: true
  },

})
let Others = ref({
  "numConnectedComponents": 1,
})
// 环形图相关数据和配置
const area = props.Result.area;
const overallArea = props.Result.overallArea;
const otherArea = overallArea - area;
const areaRatio = (area / overallArea).toFixed(10);
const otherAreaRatio = ((overallArea - area) / overallArea).toFixed(10);
console.log(otherArea)
const chartOption = {
  // title: {
  //   text: '区域面积占比',
  //   left: 'center'
  // },
  // tooltip: {
  //   trigger: 'item',
  //   formatter: function(params) {
  //     if (params.name === 'Mask区域') {
  //       return `面积: ${area}<br>占比: ${parseFloat(areaRatio * 100).toFixed(2)}%`;
  //     } else {
  //       return `面积: ${otherArea}<br>占比: ${parseFloat(otherAreaRatio * 100).toFixed(2)}%`;
  //     }
  //   }
  // },
  series: [
    {
      type: 'pie',
      radius: ['45%', '70%'],
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '20',
          fontWeight: 'bold',
          formatter: function(params) {
            if (params.name === 'Mask区域') {
              return `面积: ${area}\n占比: ${parseFloat(areaRatio * 100).toFixed(2)}%`;
            } else {
              return `面积: ${otherArea}\n占比: ${parseFloat(otherAreaRatio * 100).toFixed(2)}%`;
            }
          }
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: area, name: 'Mask区域' },
        { value: otherArea, name: '其他区域' }
      ]
    }
  ]
};
</script>

<template>
  <div style="background: #ffffff; padding: 10px">
    <a-row style="margin-bottom:10px ">
      <a-col :span="8">
        <a-card hoverable title="面积占比" style="margin-right: 10px">
          <div class="vChartPie" style=" height: 20vh">
            <e-charts :option="chartOption" />
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card hoverable title="方向角" style="margin-right: 10px">
          <OrientationAngle :Data="props.Result.orientationAngle"></OrientationAngle>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card hoverable title="填充率" >
          <FillFactor :Data="props.Result.fillFactor"></FillFactor>
        </a-card>
      </a-col>
    </a-row>
      <a-row style="margin-bottom:10px ">
      <a-col :span="8">
        <a-card hoverable title="周长" style="margin-right: 10px">
          <PerimeterChart :Data="props.Result.perimeter" ></PerimeterChart>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card hoverable title="圆度" style="margin-right: 10px">
          <CircularityChart :Data="props.Result.circularity"></CircularityChart>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card hoverable title="连通区数量" >
          <NumConnectedComponentsChart :Data="props.Result.numConnectedComponents" ></NumConnectedComponentsChart>
        </a-card>
      </a-col>
    </a-row>
    <a-card hoverable title="凸包"  style="margin-bottom: 10px">
      <ConvexHullPolygon :Data="props.Result.convexHull"></ConvexHullPolygon>
    </a-card>
  </div>
</template>

<style scoped>
</style>

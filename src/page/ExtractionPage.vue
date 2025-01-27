<script setup>
import OLMap from "../components/OLMap.vue";
import ROIForm from "../components/ROIForm.vue";
import ArgsForm from "../components/ArgsForm.vue";
import {CheckOutlined, LeftOutlined, RightOutlined} from '@ant-design/icons-vue';
import ResultForm from "../components/ResultForm.vue";
import DrawFeature from "../components/DrawFeature.vue";
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Draw, {createBox} from 'ol/interaction/Draw';
import {onMounted, ref} from "vue";
import { OverviewMap, ScaleLine, MousePosition, defaults } from "ol/control";
import {createStringXY} from 'ol/coordinate';
import 'ol/ol.css'
import { Map, View } from 'ol'
import Tile from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import {GeoJSON} from "ol/format";
import axios from "axios";
import {transform} from "ol/proj";
import {notification} from "ant-design-vue";

const map = ref(null)
function initMap() {
  map.value = new Map({
    target: 'map',
    layers: [
      new Tile({
        name: "高德",
        source: new XYZ({
          url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
        })
      }),
    ],
    view: new View({
      projection: "EPSG:3857",
      center: [13045531.126063729, 4394596.281632625],
      zoom: 15
    }),
    controls: defaults({
      // 添加其他控件
    }).extend([
      new ScaleLine({
        units: 'metric',
        bar: true,
        steps: 4,
        minWidth: 250, // 设置比例尺最小宽度
        maxWidth: 300, // 设置比例尺最大宽度
        targetSize: 300, // 设置比例尺目标大小
      }),
    ])
  });
}

onMounted(() => {
  initMap()
})
function requestJSON(data){
  showVector(data)
}

//GeoJSON显示
//region
let JSONData = ref({})
let JSONLayer = ref(null)
let Center = ref([]) //原坐标单出拿出来一份备用，后期可删
//endregion
function showVector(data) {
  axios.get(data.value)
      .then((res) => {
        JSONData.value = res.data;
        Center.value = JSONData.value.features[0].properties.center;

        JSONLayer.value = new VectorLayer({
          name: "Vector",
          source: new VectorSource({
            url: data.value,
            format: new GeoJSON()
          }),
        });

        const Coordinate = transform(Center.value, 'EPSG:4326', 'EPSG:3857');
        console.log(Center.value[0]);
        console.log(Coordinate);

        map.value.addLayer(JSONLayer.value);
        map.value.getView().animate({
          center: Coordinate,
          zoom: 7,
          rotation: undefined,
          duration: 1000
        });

        // ElNotification({
        //   title: 'Success',
        //   message: 'ROI已显示',
        //   type: 'success',
        // });
      })
      .catch(function (error) {
        console.log(error);
      });
}
// 步骤条绑定
const currentStep = ref(0);
// 步骤条样式
const stepStyle = {
  // marginBottom: '60px',
  boxShadow: '0px -1px 0 0 #e8e8e8 inset',
};
//绘图事件
// region
let geometryFunction;
const draw = ref(null);
const vectorLayer = ref(null);
const vectorSource = ref(null);

// endregion
function drawInteraction(val) {
  if (draw.value) {
    // 判断draw是否为空，若不为空移除上一个绘图交互
    map.value.removeInteraction(draw.value);
  }
  switch (val) {
    case "Cancel": // 取消绘制
      break;
    case "Clear": // 清空绘制
      notification.success({
        message: '清除成功',
        description:
            '矢量要素已从地图上移除',
      });
      vectorSource.value = null; // 矢量图层源置空
      if (vectorLayer.value) {
        vectorLayer.value.setSource(vectorSource.value); // 设置空的矢量图层源

      }
      map.value.removeLayer(vectorLayer.value);
      map.value.getLayers().forEach(item => {
        if (item.get("name") === 'Vector')
          map.value.removeLayer(item);
      });
      break;
    case "ArbPolygon": // 绘制不规则图形
      drawFea(map, draw, vectorLayer, "Polygon", vectorSource, undefined, true);
      break;
    case "Rectangle": // 绘制矩形
      // 定义一个矩形几何函数
      geometryFunction = createBox()
      drawFea(map, draw, vectorLayer, "Circle", vectorSource, geometryFunction, true);
      break;
    default: // 绘制点、圆、折线、规则多边形
      geometryFunction = undefined;
      drawFea(map, draw, vectorLayer, val, vectorSource, undefined, false);
  }
}

//绘制图形
function drawFea(map, draw, layer, type, source, geometryFunction, freehand) {
  // 判断source是否为空，若为空，创建一个VectorSource对象，并设置为矢量图层的源
  if (!layer.value) {
    layer.value = new VectorLayer({
      name: "Vector"
    })
  }
  if (!source.value) {
    source.value = new VectorSource({
      wrapX: false,
    })
    map.value.addLayer(layer.value);
  }
  layer.value.setSource(source.value);
  // 创建绘图工具
  draw.value = new Draw({
    type, // 绘制图形类型
    source: source.value, // 绘制的目标源
    geometryFunction, // 绘图的几何函数
    freehand // 绘图时鼠标点击后是否松手进行绘制
  });
  draw.value.on('drawend', function (e) {
    map.value.removeInteraction(draw.value);//移除绘制状态，一次只绘制一个图形
    let drawJSON = JSON.parse(new GeoJSON().writeFeature(e.feature));//将绘制图层转为geojson
    let json = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "geometry": drawJSON["geometry"]
        }
      ]
    }
    let array = drawJSON["geometry"]["coordinates"][0]
    array = array.map(items => items.map(item => item / 20037508.34 * 180))
    array = array.map(function (items) {
      return [items[0], 180 / Math.PI * (2 * Math.atan(Math.exp(items[1] * Math.PI / 180)) - Math.PI / 2)]
    });
    json["features"][0]["geometry"]["coordinates"][0] = array

    // JSONData.value = json
  })


  // 给地图添加绘图交互
  map.value.addInteraction(draw.value);
}
const stepItem = [
  {
    title: 'ROI选取',
    description: '选取或上传ROI区域',
    disabled: true,
  },
  {
    title: '参数设置',
    description: '设置提取参数',
    disabled: true,
  },
  {
    title: '查看结果',
    description: '获取提取结果',
    disabled: true,
  },
];

// 下一步
function formNext() {
  if (currentStep.value !== 1)
    currentStep.value++;
}
// 上一步
function formPrev() {
  if (currentStep.value !== 0)
    currentStep.value--;
}
</script>

<template>
  <div style="background-color: #e4e4e4; height: 100%; padding: 20px; position: absolute;width: 100%">
    <a-row :gutter="16">
      <a-col :span="10">
        <a-card >
          <div id="map" v-show="currentStep === 0" ></div>
        </a-card>
      </a-col>
      <a-col :span="14">
        <a-card class="formCard">
          <template #actions>
            <a-button type="primary" shape="round" @click="formPrev" :disabled="currentStep !== 1">
              <template #icon>
                <LeftOutlined />
              </template>
              上一步
            </a-button>
            <a-button type="primary" shape="round" @click="formNext" :disabled="currentStep !== 0">
              <template #icon>
                <RightOutlined />
              </template>
              下一步
            </a-button>
            <a-button type="primary" shape="round" :disabled="currentStep !== 1">
              <template #icon>
                <CheckOutlined/>
              </template>
              提交
            </a-button>

          </template>
          <template #title>
            <div style="height: 15px"></div>
            <a-steps
                v-model:current="currentStep"
                type="navigation"
                :style="stepStyle"
                :items="stepItem"
            ></a-steps>
          </template>
            <div v-if="currentStep === 0">
              <ROIForm @GeoJSONUrl="requestJSON">
                <DrawFeature @drawInteraction="drawInteraction"></DrawFeature>
              </ROIForm>
            </div>
          <div v-if="currentStep === 1">
            <ArgsForm></ArgsForm>
          </div>
          <div v-if="currentStep === 2">
            <ResultForm></ResultForm>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
html, body{
  height: 100%;
  margin: 0;
}
:deep(.ant-card-body) {
  padding: 10px;
}
.formCard{
  height: 96.10vh;
  overflow: auto;
  scrollbar-color: #ccc #f0f0f0;
  -ms-overflow-style: none;  /* 隐藏滚动条 */
  scrollbar-width: none; /* 隐藏滚动条 */
}

#map {
  height: 93.8vh; /* 设置地图高度为视口高度 */
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.81);
  overflow: hidden;
}
</style>



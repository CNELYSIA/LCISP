<script setup>
import ROIForm from "../components/ROIForm.vue";
import ArgsForm from "../components/ArgsForm.vue";
import {CheckOutlined, LeftOutlined, RightOutlined} from '@ant-design/icons-vue';
import ResultForm from "../components/ResultForm.vue";
import DrawFeature from "../components/DrawFeature.vue";
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Draw, {createBox} from 'ol/interaction/Draw';
import {onMounted, ref, getCurrentInstance} from "vue";
import { ScaleLine, defaults } from "ol/control";
import 'ol/ol.css'
import { Map, View } from 'ol'
import Tile from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import {GeoJSON} from "ol/format";
import axios from "axios";
import {transform} from "ol/proj";
import {message, notification} from "ant-design-vue";
import {ElRadioButton,ElRadioGroup,ElCheckboxButton} from 'element-plus'
import 'element-plus/es/components/radio-button/style/css'
import 'element-plus/es/components/radio-group/style/css'
import 'element-plus/es/components/checkbox-button/style/css'
import 'element-plus/es/components/checkbox-group/style/css'
const map = ref(null)
const {proxy} = getCurrentInstance()
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
      new Tile({
        name: "谷歌地图",
        source: new XYZ({
          url: "https://mt2.google.com/vt/lyrs=s@157&hl=en&gl=us&src=app&x={x}&y={y}&z={z}"
        }),
        visible: false
      }),
      new Tile({
        name: "天地图",
        source: new XYZ({
          url: "http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=87522ceca48f384fc741bc830ebeace8"
        }),
        visible: false
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

        notification.success({
          message: 'ROI已显示',
          description:
              '请查看地图组件',
          duration: 2,
        });
      })
      .catch(function (error) {
        console.log(error);
        notification.error({
          message: 'ROI显示失败',
          description:
              '请检查Url地址是否有误',
          duration: 2,
        });
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
      notification.success({
        message: '取消成功',
        description:
            '绘制控件已从地图上移除',
        duration: 2,
      });
      break;
    case "Clear": // 清空绘制
      notification.success({
        message: '清除成功',
        description:
            '矢量要素已从地图上移除',
        duration: 2,
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
    console.log(array)
    array = array.map(items => items.map(item => item / 20037508.34 * 180))
    array = array.map(function (items) {
      return [items[0], 180 / Math.PI * (2 * Math.atan(Math.exp(items[1] * Math.PI / 180)) - Math.PI / 2)]
    });
    json["features"][0]["geometry"]["coordinates"][0] = array

    JSONData.value = json
    console.log(json)
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
  if (currentStep.value !== 1){
    nextLoading.value = true;
    eeDownloadData.value.ROIArgs.Geojson = JSONData.value
    notification.success({
      message: '请求已发送',
      description:
          '请稍等片刻',
      duration: 2,
    });
    proxy.postRequest('eeDownload/', eeDownloadData.value.ROIArgs).then((res) => {
      console.log(res.data)
      if (res.status === 200){
        currentStep.value++;
        nextLoading.value = false;
        Args.value = res.data
        imgSrc = "http://127.0.0.1:8000/getThumbnail/" + res.data.file
        setTimeout(() => {
          mapShow.value = false;
        }, 400);
      }
    }).catch(() => {
      nextLoading.value = false;
      notification.error({
        message: '执行失败',
        description:
            '请检查参数是否正确',
        duration: 2,
      });
    })
  }

}
// 上一步
function formPrev() {
  if (currentStep.value === 1){
    currentStep.value--;
    setTimeout(() => {
      mapShow.value = true;
    }, 400);
  }
  if (currentStep.value === 2){
    currentStep.value--;
    setTimeout(() => {
      mapShow.value = false;
    }, 400);
  }

}

// 图层切换
let currentLayer = ref("高德");

function changeLayer(e) {
  console.log(e.target.value)
  // 更换当前图层名字为所点单选框的值
  currentLayer.value = e.target.value;
  // 遍历map的图层数组，将name与当前图层名字一致的图层设为可见，其余设为不可见
  map.value.getLayers().forEach(item => {
    if (item.get("name") === currentLayer.value) {
      item.setVisible(true);
    } else if (item.get("name") === 'Vector') {
      item.setVisible(true);
    } else {
      item.setVisible(false);
    }
  });
  message.success({
    content: () => '切换成功',
    style: {
      marginLeft: '-50vw',
    },
  });
}
message.config({
  top: '5vh',
  duration: 2,
  maxCount: 1,
  rtl: true,
});
//矢量图层开关
let ifShow = ref(true)

function switchVector() {
  // 遍历map的图层数组，将name与当前图层名字一致的图层设为可见，其余设为不可见
  map.value.getLayers().forEach(item => {
    if (item.get("name") === 'Vector')
      item.setVisible(ifShow.value);
  });
  message.success({
    content: () => '切换成功',
    style: {
      marginLeft: '-50vw',
    },
  });
}

// 接收子组件传来的值
let eeDownloadData = ref()

const nextLoading = ref(false)
let Args = ref(null)
let imgSrc = ref("")
const mapShow = ref(true)
</script>

<template>
  <div class="puff-in-center" style="background-color: #e4e4e4; height: 100%; padding: 20px; position: absolute;width: 100%">
    <a-row :gutter="16">
      <a-col :span="13" class="animated-card" :class="{'shrink-move-enlarge': currentStep !== 0, 'shrink-move-enlarge-out': currentStep !== 1}">
        <a-card>
          <div id="map" v-show="mapShow" ></div>
          <div id="MapSwitcher" v-show="mapShow">
            <!-- 图层切换控件 -->
              <el-radio-group v-model="currentLayer" >
                <el-radio-button value="高德" label="高德" @change="changeLayer"/>
                <el-radio-button value="天地图" label="天地图" @change="changeLayer"/>
                <el-radio-button value="谷歌地图" label="谷歌地图" @change="changeLayer"/>
                <el-checkbox-button v-model="ifShow" checked value="矢量图层" label="矢量图层" @change="switchVector"></el-checkbox-button>
              </el-radio-group>
          </div>
          <div id="imgContain" v-show="!mapShow">
            <div v-show="currentStep === 1">
              <a-image  :src=imgSrc />
            </div>
            <div v-show="currentStep === 2">
              <a-image  :src=imgSrc />
            </div>

          </div>
        </a-card>
      </a-col>
      <a-col :span="11" class="animated-card" :class="{ 'move-left': currentStep === 1 }">
        <a-card class="formCard">
          <template #actions>
            <a-button type="primary" shape="round" @click="formPrev" :disabled="currentStep === 0">
              <template #icon>
                <LeftOutlined />
              </template>
              上一步
            </a-button>
            <a-button type="primary" shape="round" @click="formNext" :disabled="currentStep !== 0" :loading="nextLoading">
              <template #icon>
                <RightOutlined />
              </template>
              下一步
            </a-button>
            <a-button type="primary" shape="round" :disabled="currentStep !== 1" @click="currentStep = 2">
              <template #icon>
                <CheckOutlined/>
              </template>
              提交
            </a-button>

          </template>
          <template #title>
            <div style="height: 5px"></div>
            <a-steps
                v-model:current="currentStep"
                type="navigation"
                :style="stepStyle"
                :items="stepItem"
            ></a-steps>
          </template>
            <div v-if="currentStep === 0">
              <ROIForm @GeoJSONUrl="requestJSON" ref="eeDownloadData" >
                <DrawFeature @drawInteraction="drawInteraction"></DrawFeature>
              </ROIForm>
            </div>
          <div v-if="currentStep === 1">
            <ArgsForm :Args="Args"></ArgsForm>
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

.puff-in-center {
  -webkit-animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  animation: fade-in-left 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}

@-webkit-keyframes fade-in-left {
  0% {
    -webkit-transform: translateX(-50px);
    transform: translateX(-50px);
    opacity: 0;
    -webkit-filter: blur(40px);
    filter: blur(40px);
  }
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
    -webkit-filter: blur(0px);
    filter: blur(0px);
  }
}
@keyframes fade-in-left {
  0% {
    -webkit-transform: translateX(-50px);
    transform: translateX(-50px);
    opacity: 0;
    -webkit-filter: blur(40);
    filter: blur(40);
  }
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    opacity: 1;
    -webkit-filter: blur(0);
    filter: blur(0);
  }
}


html, body{
  height: 100%;
  margin: 0;
}
:deep(.ant-card-body) {
  padding: 10px;
  position: relative;
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
#imgContain{
  height: 93.8vh; /* 设置地图高度为视口高度 */
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.81);
  overflow: hidden;
}
#MapSwitcher {
  position: absolute;
  top: 2%;
  right: 2%;
  backdrop-filter: blur(10px);
  box-shadow: rgba(142, 142, 142, 0.19) 0 6px 15px 0;
  border-radius: 8px;
  overflow: hidden;
  padding: 10px
}
.animated-card {
  transition: transform 0.8s cubic-bezier(0.42, 0, 0.47, 1),
  width 0.8s cubic-bezier(0.42, 0, 0.47, 1),
  opacity 0.8s cubic-bezier(0.42, 0, 0.47, 1),
  visibility 0.6s cubic-bezier(0.42, 0, 0.47, 1);
}

.move-left {
  transform: translateX(-118.5%);
}

.shrink-move-enlarge {
  animation: shrink-move-enlarge 0.8s cubic-bezier(0.42, 0, 0.47, 1) both;
}
.shrink-move-enlarge-out{
  animation: shrink-move-enlarge-out 0.8s cubic-bezier(0.42, 0, 0.47, 1) both;
}

@keyframes shrink-move-enlarge-out {
  0% {
    transform: scale(1) translateX(84.5%);
    opacity: 1;
  }
  33% {
    transform: scale(0.8) translateX(80%);
    opacity: 0.8;
  }
  66% {
    transform: scale(0.8) translateX(0);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) translateX(0);
    opacity: 1;
  }
}

@keyframes shrink-move-enlarge {
  0% {
    transform: scale(1) translateX(0);
    opacity: 1;
  }
  33% {
    transform: scale(0.8) translateX(0);
    opacity: 0.8;
  }
  66% {
    transform: scale(0.8) translateX(80%);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) translateX(84.5%);
    opacity: 1;
  }
}



/* 确保卡片在初始状态下可见 */
a-card {
  opacity: 1;
  transform: scale(1);
  visibility: visible;
}
</style>



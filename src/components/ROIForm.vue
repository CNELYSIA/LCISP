<script setup>
import {createVNode, h, reactive, ref} from 'vue';
import dayjs from 'dayjs';
import {
  CloudUploadOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  setTwoToneColor
} from '@ant-design/icons-vue'
const emit = defineEmits(['GeoJSONUrl'])
import {message, Modal} from 'ant-design-vue';
import ArgsForm from "./ArgsForm.vue";

const collapsible = ref("header");


setTwoToneColor('#52c41a');

const fileList = ref([]);

const handleChangeImage = async (info) => {
  const status = info.file.status;
  if (status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (status === 'done') {
    message.success(`${info.file.name} 文件上传成功`);
    // 禁止其他操作
    collapsible.value = 'disabled'
    // 处理上传成功的响应数据
    const response = info.file.response;
    if (response && response.filename) {
      ROIArgs.Option.UserImage = response.filename
      // uploadedFilename.value = response.filename;
    }
  } else if (status === 'error') {
    message.error(`${info.file.name} 文件上传失败`);
  }
};

const handleChangeModule = async (info) => {
  const status = info.file.status;
  if (status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (status === 'done') {
    message.success(`${info.file.name} 文件上传成功`);
    // 处理上传成功的响应数据
    const response = info.file.response;
    if (response && response.filename) {
      ROIArgs.Option.UserModule = response.filename
      // console.log(response.filename)
      // uploadedFilename.value = response.filename;
    }
  } else if (status === 'error') {
    message.error(`${info.file.name} 文件上传失败`);
  }
};

function handleDrop(e) {
  console.log(e);
}

// 时间快速选中
const rangePresets = ref([
  {
    label: '过去7天',
    value: [dayjs().add(-7, 'd'), dayjs()],
  },
  {
    label: '过去14天',
    value: [dayjs().add(-14, 'd'), dayjs()],
  },
  {
    label: '过去30天',
    value: [dayjs().add(-30, 'd'), dayjs()],
  },
  {
    label: '过去90天',
    value: [dayjs().add(-90, 'd'), dayjs()],
  },
  {
    label: '过去180天',
    value: [dayjs().add(-180, 'd'), dayjs()],
  },
  {
    label: '过去365天',
    value: [dayjs().add(-365, 'd'), dayjs()],
  },
]);
// 影像参数
const ROIArgs = reactive({
  Option:{
    Sensor: 'COPERNICUS/S2_SR_HARMONIZED',
    FileName: Date.now().toString(),
    Crs: 'EPSG:4326',
    Scale: '30',
    StartDate: '2024-01-01' ,
    EndDate: '2024-12-31',
    Bands: 'B[2,3,4]',
    Filter:[
        'CLOUDY_PIXEL_PERCENTAGE',
        '10'
    ],
    // 用户自定义影像
    UserImage: null,
    // 用户自定义模块
    UserModule: null
  },
  Geojson: null
});

const SensorOptions = [
  '谷歌地图瓦片',
  'COPERNICUS/S2_SR_HARMONIZED',
  'LANDSAT/LC09/C02/T1_L2',
]

const FilterOptions = [
  'CLOUDY_PIXEL_PERCENTAGE',
  'CLOUD_COVER'
]

// 获取用户选取的时间范围
function DatePickerChange(_, dateString) {
  ROIArgs.Option.StartDate = dateString[0];
  ROIArgs.Option.EndDate = dateString[1];
  collapsible.value = 'header'
  ROIArgs.Option.UserImage = null
  fileList.value = []
}

const onFinish = values => {
  console.log('Success:', values);
};
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};
const Url = ref('')

function updateURL() {
  collapsible.value = 'header'
  ROIArgs.Option.UserImage = null
  fileList.value = []
  emit('GeoJSONUrl', Url)
}

const AliUrl = "https://datav.aliyun.com/portal/school/atlas/area_selector"
function jumpURL() {
  window.open(AliUrl)
  console.log(ROIArgs)

}
const pyModule = ref([])
// 暴露方法和属性给父组件
defineExpose({ROIArgs})

const maxCount = ref(1);

function selectSensorChanged(value){
  if (value === '谷歌地图瓦片'){
    Modal.confirm({
      title: '确定要使用谷歌地图瓦片作为数据源吗？',
      icon: createVNode(ExclamationCircleOutlined),
      content: h('div', {}, [
        h('p', ''),
        h('p', '使用时请将底图切换为谷歌地图，影像数据较大，请耐心等待'),
        h('p', '若选取范围较大，建议使用平台提供的下载页下载，使用上传方式完成提取，减少时间浪费'),
      ]),
      okType: 'danger',
      width: '550px',
      style: {
        "margin-top": '24vh',
      },
      bodyStyle: {
        "margin-top": '13px',
        "margin-left": '5px'
      },
    });
  }
}
</script>

<template>
  <a-form
      :model="ROIArgs"
      name="ROIForm"
      autocomplete="off"
      layout='vertical'
      class="form"

  >

    <a-divider :plain="true" style="color: #cccccc">选取ROI区域</a-divider>
    <a-descriptions bordered size="small" layout="vertical">

      <a-descriptions-item label="GeoJSON上传" span="2" style="width: 100%">
        <a-input v-model:value="Url" style="width: 100%" @pressEnter="updateURL" @dblclick="jumpURL" />
      </a-descriptions-item>
      <a-descriptions-item label="区域绘制" span="1" style="width: 100%">
        <slot></slot>
      </a-descriptions-item>
      <a-descriptions-item label="日期范围" span="3">
        <a-range-picker style="width: 100%" :presets="rangePresets" @change="DatePickerChange" />
      </a-descriptions-item>
    </a-descriptions>

<div style="height: 10px"></div>
    <a-collapse  :bordered="false">
      <a-collapse-panel header="高级选项" :collapsible="collapsible">
        <a-descriptions bordered size="small" layout="vertical">
          <a-descriptions-item label="影像来源" span="2">
              <a-auto-complete
                  v-model:value = "ROIArgs.Option.Sensor"
                  :data-source="SensorOptions"
                  placeholder="input here"
                  style="width: 100%"
                  :defaultValue="SensorOptions[0]"
                  @change="selectSensorChanged"
              />
          </a-descriptions-item>
          <a-descriptions-item label="处理模块" span="1">
            <a-flex>
              <a-upload-dragger
                  v-model:fileList="pyModule"
                  name="file"
                  :multiple="false"
                  style="width: 100%"
                  accept=".py"
                  action="http://127.0.0.1:8000/uploadPyModule"
                  @change="handleChangeModule"
                  @drop="handleDrop"
                  :maxCount="maxCount"
                  :showUploadList="false"
              >
                <a-button type="dashed" block>
                  <template #icon>
                    <CloudUploadOutlined />
                  </template>
                  上传
                </a-button>
              </a-upload-dragger>

              <a-divider type="vertical" style="height: 100%;"></a-divider>
              <a-tooltip color="#52c41a">
                <template #title>请确保上传的.py文件中只包含一个函数，且函数名必须为"userProcess"</template>
                <InfoCircleOutlined style="font-size: 24px" />
              </a-tooltip>

            </a-flex>
          </a-descriptions-item>

          <a-descriptions-item label="筛选条件" span="1">
            <a-auto-complete
                v-model:value = "ROIArgs.Option.Filter[0]"
                :data-source="FilterOptions"
                placeholder="input here"
                style="width: 100%"
                :defaultValue="FilterOptions[0]"
            />
          </a-descriptions-item>
          <a-descriptions-item label="筛选阈值" span="1">
            <a-input v-model:value="ROIArgs.Option.Filter[1]" style="width: 100%" />
          </a-descriptions-item>
          <a-descriptions-item label="波段范围" span="1">
            <a-input v-model:value="ROIArgs.Option.Bands" style="width: 100%" />
          </a-descriptions-item>
          <a-descriptions-item label="坐标系统" span="1">
            <a-input v-model:value="ROIArgs.Option.Crs" style="width: 100%" />
          </a-descriptions-item>
          <a-descriptions-item label="空间尺度" span="1">
            <a-input v-model:value="ROIArgs.Option.Scale" style="width: 100%" />
          </a-descriptions-item>
          <a-descriptions-item label="文件名称" span="1">
            <a-input v-model:value="ROIArgs.Option.FileName" style="width: 100%" />
          </a-descriptions-item>

        </a-descriptions>
      </a-collapse-panel>
    </a-collapse>

    <a-divider :plain="true" style="color: #cccccc">或上传自定义影像</a-divider>
    <a-form-item name="DatePicker">
    <a-upload-dragger
        v-model:fileList="fileList"
        name="file"
        :multiple="false"
        accept=".tif, .png, .jpg, .jpeg, .bmp"
        action="http://127.0.0.1:8000/uploadImage"
        @change="handleChangeImage"
        @drop="handleDrop"
        list-type="picture"
        :maxCount="maxCount"

    >
      <p class="ant-upload-drag-icon" style="margin-top: 12px">
        <CloudUploadOutlined />
      </p>
    </a-upload-dragger>
    </a-form-item>
  </a-form>
</template>

<style scoped>
  .form{
    height: 76.42vh;
  }
</style>

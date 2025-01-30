<script setup>
import {reactive, ref} from 'vue';
import dayjs from 'dayjs';
import { defineEmits } from 'vue'
import {CloudUploadOutlined,InfoCircleOutlined,InfoCircleTwoTone, setTwoToneColor,UploadOutlined} from '@ant-design/icons-vue'
const emit = defineEmits(['GeoJSONUrl'])



import { message } from 'ant-design-vue';
setTwoToneColor('#52c41a');
const fileList = ref([]);
const handleChange = info => {
  const status = info.file.status;
  if (status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (status === 'done') {
    message.success(`${info.file.name} file uploaded successfully.`);
  } else if (status === 'error') {
    message.error(`${info.file.name} file upload failed.`);
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
  }
});

const SensorOptions = [
'LANDSAT/LC09/C02/T1_L2',
]

const FilterOptions = [
 'CLOUD_COVER',
]

// 获取用户选取的时间范围
function DatePickerChange(_, dateString) {
  ROIArgs.Option.StartDate = dateString[0];
  ROIArgs.Option.EndDate = dateString[1];
}

const onFinish = values => {
  console.log('Success:', values);
};
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};
const Url = ref('')

function updateURL() {
  emit('GeoJSONUrl', Url)
}

const AliUrl = "https://datav.aliyun.com/portal/school/atlas/area_selector"
function jumpURL() {
  window.open(AliUrl)

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
      <a-collapse-panel header="高级选项">
        <a-descriptions bordered size="small" layout="vertical">
          <a-descriptions-item label="影像来源" span="2">
              <a-auto-complete
                  v-model="ROIArgs.Option.Sensor"
                  :data-source="SensorOptions"
                  placeholder="input here"
                  style="width: 100%"
                  :defaultValue="SensorOptions[0]"
              />
          </a-descriptions-item>
          <a-descriptions-item label="处理模块" span="1">
            <a-flex>
              <a-upload-dragger
                  v-model:fileList="fileList"
                  name="file"
                  :multiple="false"
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  @change="handleChange"
                  style="width: 100%"
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
                <template #title>模块命名</template>
                <InfoCircleOutlined style="font-size: 24px" />
              </a-tooltip>

            </a-flex>
          </a-descriptions-item>

          <a-descriptions-item label="筛选条件" span="1">
            <a-auto-complete
                v-model="ROIArgs.Option.Filter[0]"
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
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        @change="handleChange"
        @drop="handleDrop"
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

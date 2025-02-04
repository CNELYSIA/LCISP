<script setup>
import {getCurrentInstance, reactive,ref} from 'vue';
import {CloudUploadOutlined} from "@ant-design/icons-vue";
import {message} from "ant-design-vue";


// 定义Props
const props = defineProps({
  Args: Object
})

// 影像参数
const ExtractArgs = reactive({
  FileName: props.Args.file,
  ModelName: 'LangSAM',
  Extraction: '耕地',
  Weights: null,
});



const handleChangePth = async (info) => {
  const status = info.file.status;
  if (status !== 'uploading') {
    console.log(info.file, info.fileList);
  }
  if (status === 'done') {
    message.success(`${info.file.name} 文件上传成功`);
    // 处理上传成功的响应数据
    const response = info.file.response;
    if (response && response.filename) {
      ExtractArgs.Weights = response.filename
    }
  } else if (status === 'error') {
    message.error(`${info.file.name} 文件上传失败`);
  }
};

const ModelOptions = [
'langSAM','YoloSAM'
]
const ExtractOptions = [
  '耕地','道路','屋顶'
]

let fileList = ref([])
defineExpose({ExtractArgs})
</script>

<template>
  <div id="ArgsForm">
    <a-descriptions bordered size="small" layout="vertical">

      <a-descriptions-item label="模型类别" span="2" style="width: 50%">
        <a-auto-complete
            v-model:value = "ExtractArgs.ModelName"
            :data-source="ModelOptions"
            placeholder="input here"
            style="width: 100%"
            :defaultValue="ModelOptions[0]"
        />
      </a-descriptions-item>
      <a-descriptions-item label="提取类别" span="1" style="width: 100%">
        <a-auto-complete
            v-model:value = "ExtractArgs.Extraction"
            :data-source="ExtractOptions"
            placeholder="input here"
            style="width: 100%"
            :defaultValue="ExtractOptions[0]"
        />
      </a-descriptions-item>
      <a-descriptions-item label="自定义权重文件" span="3">
        <a-upload-dragger
            v-model:fileList="fileList"
            name="file"
            :multiple="false"
            @change="handleChangePth"
            accept=".pth"
            action="http://127.0.0.1:8000/uploadPth"
            list-type="text"
            :maxCount=1

        >
          <p class="ant-upload-drag-icon" style="margin-top: 12px">
            <CloudUploadOutlined />
          </p>
          <p class="ant-upload-text">点击或拖拽以上传文件</p>
          <p class="ant-upload-hint">
            仅支持上传对应模型的权重文件（ .pth ）
          </p>
        </a-upload-dragger>
      </a-descriptions-item>
    </a-descriptions>
  </div>

</template>

<style scoped>
#ArgsForm{
  height: 79.28vh;
}
</style>

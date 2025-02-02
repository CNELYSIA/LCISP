<script setup>
import {getCurrentInstance, reactive} from 'vue';
const formState = reactive({
  username: '',
  password: '',
  remember: true,
});
const onFinish = values => {
  console.log('Success:', values);
};
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};


// 定义Props
const props = defineProps({
  Args: Object
})

const imgSrc = "http://127.0.0.1:8000/getThumbnail/" + props.Args.file

</script>

<template>
  <a-descriptions bordered size="small" layout="vertical">

    <a-descriptions-item label="模型类别" span="2" style="width: 100%">

    </a-descriptions-item>
    <a-descriptions-item label="提取类别" span="1" style="width: 100%">

    </a-descriptions-item>
    <a-descriptions-item label="权重文件" span="3">

    </a-descriptions-item>
  </a-descriptions>
</template>

<style scoped>

</style>

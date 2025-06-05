<script setup>

import {onBeforeUnmount, onDeactivated, onMounted, ref} from "vue";
import axios from "axios";
import { ElNotification, ElCol, ElDescriptions, ElDescriptionsItem, ElCard, ElProgress, ElSelect, ElOption, ElInput, ElButton,  ElRow, ElText} from "element-plus";
import 'element-plus/es/components/radio-button/style/css'
import 'element-plus/es/components/radio-group/style/css'
import 'element-plus/es/components/checkbox-button/style/css'
import 'element-plus/es/components/checkbox-group/style/css'
import 'element-plus/es/components/card/style/css'
import 'element-plus/es/components/col/style/css'
import 'element-plus/es/components/descriptions/style/css'
import 'element-plus/es/components/descriptions-item/style/css'
import 'element-plus/es/components/progress/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/option/style/css'
import {ElScrollbar} from "element-plus";
import 'element-plus/es/components/scrollbar/style/css'
import 'element-plus/es/components/text/style/css'
let userType = ref('')
let userModel = ref('')
let modelList = ref([])
const typeList = [
  {
    value: "0",
    label: "模型库"
  },
  {
    value: "1",
    label: "自定义模型"
  }
]

let extractNum = ref('')
let batchSize = ref('')
let epochNum = ref('')
let lr = ref('')
let lrDecay = ref('')
let momentum = ref('')
let userPy = ref('')
let pyList = ref([])
let userLog = ref('')
let logList = ref([])

function ModelSource() {
  axios.get(`http://127.0.0.1:8080/source/${userType.value}`)
      .then((res) => {
        modelList.value = res.data
      })
}

function updateList() {
  axios.get(`http://127.0.0.1:8000/update`)
      .then((res) => {
        ElNotification({
          title: '状态',
          message: '更新成功',
          type: 'success',
        });
        pyList.value = res.data["pyScript"]
        logList.value = res.data["logDirectories"]
      })
}

function startTrain() {
  ElNotification({
    title: '状态',
    message: '开始训练',
    type: 'success',
  });
  let CONFIG = {
    "userType": userType.value,
    "userLog":userLog.value,
    "userPy":userPy.value,
    "num_classes": Number(extractNum.value),
    "batch_size": Number(batchSize.value),
    "num_epoch": Number(epochNum.value),
    "lr": Number(lr.value),
    "weight_decay": Number(lrDecay.value),
    "momentum": Number(momentum.value),
    "train_list": "../User/Train/Train.txt",
    "test_list": "../User/Train/Test.txt",

    "train_model": {
      "select": 0,
      "model": [userModel.value]
    },
    "save_model": {
      "save": true,
      "save_path": "../User"
    }
  }
  axios.post(`http://127.0.0.1:8000/train`,CONFIG)
      .then((res) => {

      })
}
let consoleLog = ref('')
function getLogs(){
  let config = {
    "userType": Number(userType.value),
    "userLog":userLog.value,
    "userModel":userModel.value
  }
  axios.post(`http://127.0.0.1:8080/log`,config)
      .then((res) => {
        console.log(res.data)
        consoleLog.value = res.data
      })
}
let timer = null
onMounted(() => {
  timer = setInterval(() =>{
    getLogs();
  },10000);//间隔3秒运行
})
onBeforeUnmount(() => {
  clearInterval(timer);
  timer = null
})
</script>

<template>
  <div style="margin: 20px;border-radius: 10px;overflow-y: auto;box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);">
  <el-descriptions :column="3"
                   border
                   direction="vertical"
                   style="width: 100%"
  >
    <el-descriptions-item label="模型来源">
      <el-select
          v-model="userType"
          filterable
          placeholder="请选择模型来源"
          @change="ModelSource"
          style="width: 100%;"
      >
        <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </el-descriptions-item>
    <el-descriptions-item label="提取模型">
      <el-select
          v-model="userModel"
          change
          filterable
          allow-create
          placeholder="请选择深度学习模型"
          style="width: 100%;"
      >
        <el-option
            v-for="item in modelList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </el-descriptions-item>

  </el-descriptions>

  <el-descriptions :column="3"
                   border
                   direction="vertical"
                   style="width: 100%"
  >
    <el-descriptions-item label="类别数量">
      <el-input v-model="extractNum" clearable placeholder="请输入提取类别数量"/>
    </el-descriptions-item>
    <el-descriptions-item label="批次容量">
      <el-input v-model="batchSize" clearable placeholder="请设置批次大小"/>
    </el-descriptions-item>
    <el-descriptions-item label="迭代次数">
      <el-input v-model="epochNum" clearable placeholder="请设置总迭代次数"/>
    </el-descriptions-item>
    <el-descriptions-item label="学习速率">
      <el-input v-model="lr" clearable placeholder="请设置学习速率"/>
    </el-descriptions-item>
    <el-descriptions-item label="衰减速率">
      <el-input v-model="lrDecay" clearable placeholder="请设置学习率衰减速率"/>
    </el-descriptions-item>
    <el-descriptions-item label="动量">
      <el-input v-model="momentum" clearable placeholder="请设置动量，建议设置在0-1之间"/>
    </el-descriptions-item>
  </el-descriptions>

  <el-descriptions :column=3
                   border
                   direction="vertical"
                   style="width: 100%"
  >
    <el-descriptions-item label="自定义模型训练请填写此列">
      <el-select
          v-model="userPy"
          change
          filterable
          placeholder="请选择脚本文件"
          style="width: 100%;"
      >
        <el-option
            v-for="item in pyList"
            :key="item"
            :label="item"
            :value="item"
        />
      </el-select>

    </el-descriptions-item>

    <el-descriptions-item>
      <el-select
          v-model="userLog"
          change
          filterable
          placeholder="请选择log文件输出目录"
          style="width: 100%;"
      >
        <el-option
            v-for="item in logList"
            :key="item"
            :label="item"
            :value="item"
        />
      </el-select>

    </el-descriptions-item>

  </el-descriptions>

  <el-descriptions :column=3
                   border
                   direction="vertical"
                   style="width: 100%"
  >
    <el-descriptions-item>
      <el-button type="primary" @click="updateList">更新列表</el-button>
      <el-button type="primary" @click="startTrain">开始训练</el-button>

    </el-descriptions-item>
  </el-descriptions>

    <div style="background: #2c3e50;width: 100%;white-space: pre-line;height: 462px" >
      <el-scrollbar>
        <div style="padding: 20px">
          <el-text size="large" style="color: #67c23a; font-family: 'Consolas';font-size: 22px">{{ consoleLog }}</el-text>
        </div>
      </el-scrollbar>
    </div>

  </div>
</template>

<style scoped>

</style>

<template>
  <el-scrollbar>
  <a-layout style="min-height: 100vh">
    <a-float-button type="primary"
                    :style="{
      right: '12px',
      top: '12px'
    }" @click="showDrawer" >
      <template #icon>
        <QuestionCircleOutlined />
      </template>
    </a-float-button>
    <a-layout-sider v-model:collapsed="collapsed" collapsible >
      <div style="height: 32px; display: flex; align-items: center; margin: 16px;margin-top: 20px" class="logo">
        <el-image src="/logo.svg" style="width: 32px; height: 32px;"></el-image>
        <p style="background: linear-gradient(to right, #52c41a, #52c41a); -webkit-background-clip: text; color: transparent; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);margin-top: 33px; font-size: 32px; margin-left: 8px; font-weight: bold; font-family: Arial; letter-spacing: 6px;">LCISP</p>

      </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="0">
          <HomeOutlined />
          <span style="font-family: 微软雅黑;font-weight: bold">首页</span>
        </a-menu-item>
        <a-menu-item key="1">
          <pie-chart-outlined />
          <span style="font-family: 微软雅黑;font-weight: bold">地表覆盖提取</span>
        </a-menu-item>
        <a-menu-item key="2">
          <desktop-outlined />
          <span style="font-family: 微软雅黑;font-weight: bold">模型训练</span>
        </a-menu-item>
        <a-menu-item key="3">
          <CloudOutlined />
          <span style="font-family: 微软雅黑;font-weight: bold">GEE环境集成</span>
        </a-menu-item>
        <a-menu-item key="7">
          <NodeIndexOutlined />
          <span style="font-family: 微软雅黑;font-weight: bold">K均值聚类</span>
        </a-menu-item>
        <a-menu-item key="8">
          <NodeIndexOutlined />
          <span style="font-family: 微软雅黑;font-weight: bold">随机森林分类</span>
        </a-menu-item>
        <a-menu-item key="4">
          <CloudServerOutlined />
          <span style="font-family: 微软雅黑;font-weight: bold">性能监测</span>
        </a-menu-item>
        <a-menu-item key="5">
          <FileImageOutlined />
          <span style="font-family: 微软雅黑;font-weight: bold">AI智能图像处理</span>
        </a-menu-item>
        <a-menu-item key="6">
          <NodeIndexOutlined />
          <span style="font-family: 微软雅黑;font-weight: bold">AI知识图谱生成</span>
        </a-menu-item>
        <a-menu-item key="9">
          <NodeIndexOutlined />
          <span style="font-family: 微软雅黑;font-weight: bold">AI智能任务链构建</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="padding: 0;  background-size: cover;
  background: #fff url('/TOPBG.png') no-repeat fixed center;" />
      <a-layout-content class="BG">
        <div v-if="selectedKeys[0] === '0'" style="height: 92vh; overflow: auto;">
          <div style="margin: 20px">
            <a-row>
              <a-col>
                <a-card style="width: 60vw;height: 25vh;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);">
                  <a-row>
                    <a-col>
                      <p style="font-family: 微软雅黑 ;font-size: 45px; font-weight: bold; margin-bottom: 0;margin-left: 20px; background: linear-gradient(to right, #1890ff, #ff7eb3); -webkit-background-clip: text; color: transparent; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);">
                        欢迎您使用LCISP地表覆盖智慧服务平台
                      </p>
                      <p style="font-size: 30px; margin-left: 20px;font-weight: bold; margin-bottom: 30px; background: linear-gradient(to right, #1890ff, #ff7eb3); -webkit-background-clip: text; color: transparent; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);">
                       {{ currentDate }}
                      </p>
                      <a-row>
                        <a-col></a-col>
                        <a-col>
                          <p style="font-size: 25px; margin-left: 20px;font-weight: bold; margin-bottom: 5px; background: linear-gradient(to right, #1890ff, #ff7eb3); -webkit-background-clip: text; color: transparent;">
                            用户名称: <span>{{ userData.user }}</span>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;用户权限: <span>{{ userData.role === 'admin' ? '管理员' : '普通用户' }}</span>
                          </p>
                        </a-col>
                      </a-row>
                    </a-col>
                    <a-col>
                      <a-avatar src="/avatar_1.jpg" style="margin-top: 10px;margin-left: 100px" :size="180">

                      </a-avatar>
                    </a-col>
                  </a-row>
                </a-card>
                <a-card style="width: 60.027vw; margin-top: 20px;height: 62vh;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);overflow: hidden;border-radius: 10px ">
                  <a-card-grid @click="selectedKeys[0] = '1'" style="width: 12vw; text-align: center;height: 31vh;overflow: hidden;padding: 0">
                    <p style="font-size: 20px;font-weight: bold;margin-bottom: 5px;margin-top: 8px">地表覆盖提取</p>
                    <el-image style="height: 100%;width: 100%" src="/DBTQ.png" fit="cover"></el-image>
                  </a-card-grid>
                  <a-card-grid @click="selectedKeys[0] = '2'" style="width: 12vw; text-align: center;height: 31vh;overflow: hidden;padding: 0">
                    <p style="font-size: 20px;font-weight: bold;margin-bottom: 5px;margin-top: 8px">模型训练</p>
                    <el-image style="height: 100%;width: 100%" src="/MXXL.png" fit="cover"></el-image>
                  </a-card-grid>
                  <a-card-grid @click="selectedKeys[0] = '3'" style="width: 12vw; text-align: center;height: 31vh;overflow: hidden;padding: 0">
                    <p style="font-size: 20px;font-weight: bold;margin-bottom: 5px;margin-top: 8px">GEE环境集成</p>
                    <el-image style="height: 100%;width: 100%" src="/GEE.png" fit="cover"></el-image>
                  </a-card-grid>
                  <a-card-grid @click="selectedKeys[0] = '7'" style="width: 12vw; text-align: center;height: 31vh;overflow: hidden;padding: 0">
                    <p style="font-size: 20px;font-weight: bold;margin-bottom: 5px;margin-top: 8px">K均值聚类</p>
                    <el-image style="height: 100%;width: 100%" src="/KMEANS.png" fit="cover"></el-image>
                  </a-card-grid>
                  <a-card-grid @click="selectedKeys[0] = '8'" style="width: 12vw; text-align: center;height: 31vh;overflow: hidden;padding: 0">
                    <p style="font-size: 20px;font-weight: bold;margin-bottom: 5px;margin-top: 8px">随机森林分类</p>
                    <el-image style="height: 100%;width: 100%" src="/SJSL.png" fit="cover"></el-image>
                  </a-card-grid>
                  <a-card-grid @click="selectedKeys[0] = '4'" style="width: 12vw; text-align: center;height: 31vh;overflow: hidden;padding: 0">
                    <p style="font-size: 20px;font-weight: bold;margin-bottom: 5px;margin-top: 8px">性能监测</p>
                    <el-image style="height: 100%;width: 100%" src="/XNJC.png" fit="cover"></el-image>
                  </a-card-grid>
                  <a-card-grid @click="open = true;" style="width: 12vw; text-align: center;height: 31vh;overflow: hidden;padding: 0">
                    <p style="font-size: 20px;font-weight: bold;margin-bottom: 5px;margin-top: 8px">AI地学知识问答</p>
                    <el-image style="height: 100%;width: 100%" src="/COMB.png" fit="cover"></el-image>
                  </a-card-grid>
                  <a-card-grid @click="selectedKeys[0] = '5'" style="width: 12vw; text-align: center;height: 31vh;overflow: hidden;padding: 0">
                    <p style="font-size: 20px;font-weight: bold;margin-bottom: 5px;margin-top: 8px">AI智能图像处理</p>
                    <el-image style="height: 100%;width: 100%" src="/TXCL.png" fit="cover"></el-image>
                  </a-card-grid>
                  <a-card-grid @click="selectedKeys[0] = '6'" style="width: 12vw; text-align: center;height: 31vh;overflow: hidden;padding: 0">
                    <p style="font-size: 20px;font-weight: bold;margin-bottom: 5px;margin-top: 8px">AI知识图谱生成</p>
                    <el-image style="height: 100%;width: 100%" src="/ZSTP.png" fit="cover"></el-image>
                  </a-card-grid>
                  <a-card-grid @click="selectedKeys[0] = '9'" style="width: 12vw; text-align: center;height: 31vh;overflow: hidden;padding: 0">
                    <p style="font-size: 20px;font-weight: bold;margin-bottom: 5px;margin-top: 8px">AI智能任务链构建</p>
                    <el-image style="height: 100%;width: 100%" src="/CHAIN.png" fit="cover"></el-image>
                  </a-card-grid>

                </a-card>
              </a-col>
              <a-col>
                <a-card style="width: 26.7vw;height: 89vh;margin-left: 20px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15)">
                  <a-list :data-source="logs" class="log-list" style="height: 84vh">
                    <template #renderItem="{ item }">
                      <a-list-item>
                        <a-list-item-meta
                            :description=item
                        >
                          <template #title>
                            操作记录
                          </template>
                          <template #avatar>
                            <a-avatar src="/avatar_3.jpg" />
                          </template>
                        </a-list-item-meta>
                      </a-list-item>
                    </template>
                  </a-list>
                </a-card>
              </a-col>
            </a-row>
          </div>
        </div>
          <div v-if="selectedKeys[0] === '1'" class="extraction-wrapper">
            <ExtractionPage/>
          </div>
        <div v-if="selectedKeys[0] === '2'">
          <ModelTrainer v-if="userData.role === 'admin'" ></ModelTrainer>
          <RoleError v-if="userData.role !== 'admin'"></RoleError>
        </div>
        <div v-if="selectedKeys[0] === '3'">
          <iframe v-if="userData.role === 'admin'" frameborder="0" style="width: 97.7%;height: 89vh;overflow-y: hidden;border-radius: 10px;margin: 20px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);" src="http://127.0.0.1:8888/lab"></iframe>
          <RoleError v-if="userData.role !== 'admin'"></RoleError>
        </div>
          <div v-if="selectedKeys[0] === '4'" style="height: 92vh; overflow: auto;">
            <SystemMonitor/>
          </div>
        <div v-if="selectedKeys[0] === '5'">
          <iframe frameborder="0" style="width: 97.7%;height: 89vh;overflow-y: hidden;border-radius: 10px;margin: 20px;" src="http://127.0.0.1:7865"></iframe>
        </div>
        <div v-if="selectedKeys[0] === '6'">
          <KnowledgeGraph></KnowledgeGraph>
        </div>
        <div v-if="selectedKeys[0] === '7'">
          <iframe frameborder="0" style="width: 97.7%;height: 89vh;overflow-y: hidden;border-radius: 10px;margin: 20px;" src="http://127.0.0.1:7875"></iframe>
        </div>
        <div v-if="selectedKeys[0] === '8'">
          <iframe frameborder="0" style="width: 97.7%;height: 89vh;overflow-y: hidden;border-radius: 10px;margin: 20px;" src="http://127.0.0.1:7880"></iframe>
        </div>
        <div v-if="selectedKeys[0] === '9'">
          <iframe frameborder="0" style="width: 97.7%;height: 89vh;overflow-y: hidden;border-radius: 10px;margin: 20px;" src="http://127.0.0.1:7870"></iframe>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
  <a-drawer
      v-model:open="open"
      class="custom-class"
      root-class-name="root-class-name"
      placement="right"
      style="padding: 0"
      body-style="padding:0; overflow-y:hidden"
      @after-open-change="afterOpenChange"
      :closable="false"
      size="large"
  >
    <iframe frameborder="0" style="width: 100%;height: 100%;overflow-y: hidden" src="http://127.0.0.1:7860/?__theme=dark"></iframe>
  </a-drawer>
  </el-scrollbar>

</template>
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
const collapsed = ref(false);
const selectedKeys = ref(['0']);
const open = ref(false);
import {ElScrollbar, ElImage} from "element-plus";
import 'element-plus/es/components/scrollbar/style/css'
import 'element-plus/es/components/image/style/css'
import { storeToRefs } from "pinia";
import { UserData } from "../stores/User/User";

const userData = UserData();
const afterOpenChange = bool => {
  console.log('open', bool);
};
const currentDate = ref('');
const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要+1
  const day = String(date.getDate()).padStart(2, '0');
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const weekday = weekdays[date.getDay()];
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  currentDate.value = `${year}年${month}月${day}日 星期${weekday} ${hours}时${minutes}分${seconds}秒`;
};
const showDrawer = () => {
  open.value = true;
};
import {
  PieChartOutlined,
    DesktopOutlined,
    UserOutlined,
  HomeOutlined,
    TeamOutlined,
    FileOutlined,
    NodeIndexOutlined,
  FileImageOutlined,
  CloudOutlined,
  CloudServerOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons-vue'
import ExtractionPage from "./ExtractionPage.vue";
import SystemMonitor from "../components/SystemMonitor.vue";
import ModelTrainer from "../components/ModelTrainer.vue";
import KnowledgeGraph from '../components/KnowledgeGraph.vue';
import RoleError from "../components/RoleError.vue";
const logs = ref([]);
const fetchLogs = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/getlogs'); // 替换为实际的后端API地址
    logs.value = response.data.logs;
  } catch (error) {
    console.error('Error fetching logs:', error);
  }
};
onMounted(() => {
  fetchLogs();
  getCurrentDate();
  setInterval(fetchLogs, 5000); // 每5秒更新一次
  setInterval(getCurrentDate, 1000);
});
</script>
<style scoped>
.log-list {
  height: 100%;
  overflow-y: auto;

}
.log-list p {
  margin: 0;
  font-size: 14px;
  color: #333;
}
.BG {
  margin: 0;
  background-image: url('/LCISPBG.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}
.extraction-wrapper {
  transform: scale(0.8); /* 调整缩放比例 */
  transform-origin: left top; /* 控制缩放基点 */
  width: 125%; /* 补偿缩放后的宽度 (100%/0.8=125%) */
  height: 125%;
  overflow: hidden; /* 隐藏溢出内容 */
}
.site-layout .site-layout-background {
  background: #fff;
}
[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
div::-webkit-scrollbar {
  display: none; /* 隐藏滚动条 */
}
</style>

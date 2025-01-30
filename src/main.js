import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import App from "./App.vue";
import './styles/index.scss'
import router from './router'
// 引入封装好的请求
import {postRequest,putRequest,getRequest,deleteRequest} from "./api";

const app = createApp(App);
// 插件形式使用请求
app.config.globalProperties.postRequest = postRequest;
app.config.globalProperties.putRequest = putRequest;
app.config.globalProperties.getRequest = getRequest;
app.config.globalProperties.deleteRequest = deleteRequest;

app.use(router);
app.use(Antd).mount('#app');

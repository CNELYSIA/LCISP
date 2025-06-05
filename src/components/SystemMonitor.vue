<template>
<div style="padding: 20px;" class="infoPanel">
  <div>
    <el-descriptions
        direction="vertical"
        :column="3"
        :size="'large'"
        border
        style="margin-bottom: 10px; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);border-radius: 10px;overflow-y: hidden"
    >
      <el-descriptions-item label="CPU使用率" align="center">
        <el-progress type="dashboard"  width="200" stroke-width="20" :percentage="Number(cpuTotle)" :color="customColor(cpuTotle)" />
      </el-descriptions-item>
      <el-descriptions-item label="内存使用率" align="center">
        <el-progress type="dashboard"  width="200" stroke-width="20"  :percentage="Number(memTotle)" :color="customColor(memTotle)"/>
      </el-descriptions-item>
      <el-descriptions-item label="JVM内存使用率" align="center">
        <el-progress type="dashboard"  width="200" stroke-width="20" :percentage="Number(jvmTotle)" :color="customColor(jvmTotle)"/>
      </el-descriptions-item>
      <el-descriptions-item label="硬盘使用率">
        <div v-for="(disk, index) in diskUsed" :key="index">
          <p></p>
          <el-progress
              :class="{'text-danger': disk[1] > 70}"
              :percentage= "Number(disk[1])"
              :text-inside="true"
              :stroke-width="24"
              :color="customColor(disk[1])"
          >
            <span>{{disk[0]}}</span>
            <span>&nbsp&nbsp</span>
            <span>{{disk[1]}}%</span>
          </el-progress>
        </div>
      </el-descriptions-item>
    </el-descriptions>


    <el-col :span="24" style="margin-bottom: 10px">
      <el-card style="border-radius: 10px">
        <div slot="header" class="el-icon-help"><b> 服务器信息</b></div>
        <div class="el-table el-table--enable-row-hover el-table--medium">
          <table cellspacing="0" style="width: 100%;">
            <tbody>
            <tr>
              <td class="el-table__cell is-leaf"><div class="cell">服务器名称</div></td>
              <td class="el-table__cell is-leaf"><div class="cell" v-if="sysInfo">{{ sysInfo.computerName }}</div></td>
              <td class="el-table__cell is-leaf"><div class="cell">操作系统</div></td>
              <td class="el-table__cell is-leaf"><div class="cell" v-if="sysInfo">{{ sysInfo.osName }}</div></td>
            </tr>
            <tr>
              <td class="el-table__cell is-leaf"><div class="cell">服务器IP</div></td>
              <td class="el-table__cell is-leaf"><div class="cell" v-if="sysInfo">{{ sysInfo.computerIp }}</div></td>
              <td class="el-table__cell is-leaf"><div class="cell">系统架构</div></td>
              <td class="el-table__cell is-leaf"><div class="cell" v-if="sysInfo">{{ sysInfo.osArch }}</div></td>
            </tr>
            <tr>
              <td class="el-table__cell is-leaf"><div class="cell">运行时间</div></td>
              <td class="el-table__cell is-leaf"><div class="cell" v-if="jvmInfo">{{ jvmInfo.runTime }}</div></td>
            </tr>
            </tbody>
          </table>
        </div>
      </el-card>
    </el-col>

    <el-row>

      <el-col :span="12" style="margin-bottom: 10px;padding-right: 5px">
        <el-card style="height: 100%;border-radius: 10px">
          <div slot="header" class="el-icon-cpu"><b>CPU</b></div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;">
              <thead>
              <tr>
                <th class="el-table__cell is-leaf"><div class="cell">属 性</div></th>
                <th class="el-table__cell is-leaf"><div class="cell">值</div></th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td class="el-table__cell is-leaf"><div class="cell">核心数</div></td>
                <td class="el-table__cell is-leaf"><div class="cell" v-if="cpuInfo">{{ cpuInfo.cpuNum }}</div></td>
              </tr>
              <tr>
                <td class="el-table__cell is-leaf"><div class="cell">用户使用率</div></td>
                <td class="el-table__cell is-leaf"><div class="cell" v-if="cpuInfo">{{ cpuInfo.user }}</div></td>
              </tr>
              <tr>
                <td class="el-table__cell is-leaf"><div class="cell">系统使用率</div></td>
                <td class="el-table__cell is-leaf"><div class="cell" v-if="cpuInfo">{{ cpuInfo.cSys }}</div></td>
              </tr>
              <tr>
                <td class="el-table__cell is-leaf"><div class="cell">当前空闲率</div></td>
                <td class="el-table__cell is-leaf"><div class="cell" v-if="cpuInfo">{{ cpuFree }}</div></td>
              </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" style="margin-bottom: 10px;padding-left: 5px">
        <el-card style="height: 100%;border-radius: 10px">
          <div slot="header" class="el-icon-folder"><b>内存</b></div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;">
              <thead>
              <tr>
                <th class="el-table__cell is-leaf"><div class="cell">属 性</div></th>
                <th class="el-table__cell is-leaf"><div class="cell">内 存</div></th>
                <th class="el-table__cell is-leaf"><div class="cell">JVM</div></th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td class="el-table__cell is-leaf"><div class="cell">总内存</div></td>
                <td class="el-table__cell is-leaf"><div class="cell" v-if="memInfo">{{ memInfo.total }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell" v-if="jvmInfo">{{ jvmInfo.total }}</div></td>
              </tr>
              <tr>
                <td class="el-table__cell is-leaf"><div class="cell">已用内存</div></td>
                <td class="el-table__cell is-leaf"><div class="cell" v-if="memInfo">{{ memInfo.used }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell" v-if="jvmInfo">{{ jvmInfo.user }}</div></td>
              </tr>
              <tr>
                <td class="el-table__cell is-leaf"><div class="cell">剩余内存</div></td>
                <td class="el-table__cell is-leaf"><div class="cell" v-if="memInfo">{{ memInfo.free }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell" v-if="jvmInfo">{{ jvmInfo.free }}</div></td>
              </tr>
              <tr>
                <td class="el-table__cell is-leaf"><div class="cell">使用率</div></td>
                <td class="el-table__cell is-leaf"><div class="cell" v-if="memInfo" :class="{'text-danger': memInfo.usage > 70}">{{ memInfo.usageRate }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell" v-if="jvmInfo" :class="{'text-danger': jvmInfo.usage > 70}">{{ jvmInfo.usageRate }}</div></td>
              </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>



      <el-col :span="24" style="margin-bottom: 10px;">
        <el-card style="border-radius: 10px">
          <div slot="header" class="el-icon-copy-document"><b> 磁盘状态</b></div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;">
              <thead>
              <tr>
                <th class="el-table__cell el-table__cell is-leaf"><div class="cell">盘符路径</div></th>
                <th class="el-table__cell is-leaf"><div class="cell">文件系统</div></th>
                <th class="el-table__cell is-leaf"><div class="cell">盘符类型</div></th>
                <th class="el-table__cell is-leaf"><div class="cell">总大小</div></th>
                <th class="el-table__cell is-leaf"><div class="cell">可用大小</div></th>
                <th class="el-table__cell is-leaf"><div class="cell">已用大小</div></th>
                <th class="el-table__cell is-leaf"><div class="cell">已用百分比</div></th>
              </tr>
              </thead>
              <tbody v-if="sysFileInfo">
              <tr v-for="(sysFile, index) in sysFileInfo" :key="index">
                <td class="el-table__cell is-leaf"><div class="cell">{{ sysFile.dirName }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">{{ sysFile.sysTypeName }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">{{ sysFile.typeName }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">{{ sysFile.total }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">{{ sysFile.free }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">{{ sysFile.used }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell" :class="{'text-danger': sysFile.usage > 70}">{{ sysFile.usage }}</div></td>
              </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" style="margin-bottom: 10px;">
        <el-card style="border-radius: 10px">
          <div slot="header" class="el-icon-copy-document"><b> GPU信息</b></div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;">
              <thead>
              <tr>
                <th class="el-table__cell el-table__cell is-leaf"><div class="cell">GPU型号</div></th>
                <th class="el-table__cell is-leaf"><div class="cell">驱动版本</div></th>
                <th class="el-table__cell is-leaf"><div class="cell">供应商</div></th>
                <th class="el-table__cell is-leaf"><div class="cell">VRam容量</div></th>
              </tr>
              </thead>
              <tbody v-if="graphicsInfo">
              <tr v-for="(graphicsCard, index) in graphicsInfo" :key="index">
                <td class="el-table__cell is-leaf"><div class="cell">{{ graphicsCard.deviceName }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">{{ graphicsCard.deviceVersion }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">{{ graphicsCard.deviceVendor }}</div></td>
                <td class="el-table__cell is-leaf"><div class="cell">{{ graphicsCard.deviceVRam }}</div></td>
              </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

    </el-row>
  </div>


  </div>

</template>
<script setup>import axios from 'axios';
import { ElNotification, ElCol, ElDescriptions, ElDescriptionsItem, ElCard, ElProgress, ElRow } from "element-plus";
import 'element-plus/es/components/radio-button/style/css'
import 'element-plus/es/components/radio-group/style/css'
import 'element-plus/es/components/checkbox-button/style/css'
import 'element-plus/es/components/checkbox-group/style/css'
import 'element-plus/es/components/card/style/css'
import 'element-plus/es/components/col/style/css'
import 'element-plus/es/components/descriptions/style/css'
import 'element-plus/es/components/descriptions-item/style/css'
import 'element-plus/es/components/progress/style/css'
import 'element-plus/es/components/row/style/css'
import { ref, onMounted, onBeforeUnmount } from 'vue';

let ifFirst = ref(0);

const cpuInfo = ref([]);
const jvmInfo = ref([]);
const memInfo = ref([]);
const sysInfo = ref([]);
const sysFileInfo = ref([]);
const graphicsInfo = ref([]);
const cpuFree = ref("");
const cpuTotle = ref(0);
const memTotle = ref(0);
const jvmTotle = ref(0);
const diskUsed = ref([]);

const monitor = () => {
  axios.get('http://127.0.0.1:8080/info')
      .then((res) => {
        if (ifFirst.value === 0) {
          ElNotification({
            title: '状态',
            message: '加载完成',
            type: 'success',
          });
          ifFirst.value = 1;
        }
        cpuInfo.value = res.data.cpuInfo;
        jvmInfo.value = res.data.jvmInfo;
        memInfo.value = res.data.memInfo;
        sysInfo.value = res.data.sysInfo;
        sysFileInfo.value = res.data.sysFileInfo;
        graphicsInfo.value = res.data.graphicsInfo;

        cpuFree.value = ((1 - Number(cpuInfo.value.idle.replace("%", "")) * 0.01) * 100).toFixed(2) + "%";
        cpuTotle.value = Number(cpuInfo.value.idle.replace("%", "")).toFixed(0);
        memTotle.value = Number(memInfo.value.usageRate.replace("%", "")).toFixed(0);
        jvmTotle.value = Number(jvmInfo.value.usageRate.replace("%", "")).toFixed(0);
        let COUNT = 0;
        for (const diskDrives of sysFileInfo.value) {
          diskUsed.value[COUNT] = [diskDrives.dirName, Number(diskDrives.usage.replace("%", "")).toFixed(0)];
          COUNT++;
        }
        COUNT = 0;
      })
      .catch(function (error) {
        console.log(error);
      });
};

const customColor = (threshold) => {
  if (threshold > 70) {
    return 'red';
  }
};

onMounted(() => {
  ElNotification({
    title: '状态',
    message: '加载中',
    type: 'info',
  });
  const timer = setInterval(monitor, 5000); // 间隔5秒运行
  onBeforeUnmount(() => {
    clearInterval(timer);
  });
});
</script>
<style>
</style>

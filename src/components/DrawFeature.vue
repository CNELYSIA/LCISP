<template>
    <div class="drawFeature" style="display: flex">
      <a-select
          v-model="featureName"
          placeholder="Select"
          style="margin-right: 10px; margin-left: 10px"
          @change="updateFeatureName"
      >
        <a-select-option
            v-for="item in typeList"
            :key="item.value"
            :value="item.value"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
      <a-button type="primary" @click="cancelDraw">取消绘制</a-button>
      <a-button type="primary" @click="clearFeature">清除</a-button>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue';
function updateFeatureName(data){
  featureName.value = data;
}
const typeList = [
  {
    value: 'Rectangle',
    label: '矩形',
  },
  {
    value: 'Polygon',
    label: '规则多边形',
  },
  {
    value: 'ArbPolygon',
    label: '不规则图形',
  },
]

// 绘制图形的类型名
const featureName = ref(null);

// 接收事件
const emits = defineEmits(["drawInteraction"]);

// 监听类型名的变化，发生变化时提交事件
watch(featureName, newVal => {
  if (newVal) {
    emits("drawInteraction", newVal);
  }
})

// 取消绘制
function cancelDraw() {
  featureName.value = null; // 类型名置空
  emits("drawInteraction", "Cancel"); // 提交事件
}

// 清空绘制的图形
function clearFeature() {
  featureName.value = null; // 类型名置空
  emits("drawInteraction", "Clear"); // 提交事件
}

</script>

<style>
.drawFeature {
    width: 500px;
    position: static;
    top: 40px;
    right: 45px;
    z-index: 100;
}
</style>

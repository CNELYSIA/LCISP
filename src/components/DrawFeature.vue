<template>
    <div class="drawFeature">
      <a-space>
        <a-select
            v-model="featureName"
            placeholder="Select"
            @change="updateFeatureName"
            style="width: 200px"
        >
          <a-select-option
              v-for="item in typeList"
              :key="item.value"
              :value="item.value"

          >
            {{ item.label }}
          </a-select-option>
        </a-select>
        <a-button type="primary" @click="cancelDraw" :disabled="isDraw"> 取消绘制</a-button>
        <a-button type="primary" @click="clearFeature" :disabled="canClear" >清除</a-button>
      </a-space>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue';
const isDraw = ref(true);
const canClear = ref(true);
function updateFeatureName(data){
  isDraw.value = false;
  canClear.value = false;
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
  isDraw.value = true;
  emits("drawInteraction", "Cancel"); // 提交事件
}

// 清空绘制的图形
function clearFeature() {
  canClear.value = true;
  featureName.value = null; // 类型名置空
  emits("drawInteraction", "Clear"); // 提交事件
}

</script>

<style>
.drawFeature {
  width: 100%;
}
</style>

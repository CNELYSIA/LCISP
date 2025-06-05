<template>
    <div class="knowledge-graph-container">
      <div class="html-viewer" style="background-color: #ffffff">
        <iframe style="overflow-y: hidden;border-width: 0cap;" scrolling="no" :src="htmlFilePath" frameborder="0" class="html-frame"></iframe>
      </div>
      <div class="input-section">
        <textarea
          v-model="inputText"
          placeholder="请输入知识图谱内容..."
          class="text-input"
        ></textarea>
        <a-button @click="saveAndDisplay" class="submit-btn">生成知识图谱</a-button>
      </div>
    </div>
  </template>

  <script>
import axios from 'axios'
export default {
  data() {
    return {
      inputText: '',
      htmlFilePath: '',
      refreshInterval: null  // 新增：存储定时器
    }
  },
  methods: {
    async saveAndDisplay() {
      try {
        const response = await axios.post('http://127.0.0.1:8000/knowledgeGraph', {
          content: this.inputText
        });
        this.htmlFilePath = `http://127.0.0.1:8000${response.data.htmlPath}`;
        this.startAutoRefresh();  // 新增：开始自动刷新
      } catch (error) {
        console.error('保存失败:', error);
      }
    },
    // 新增：自动刷新方法
    startAutoRefresh() {
      // 先清除已有定时器
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
      }
      // 设置新的定时器（每30秒刷新一次）
      this.refreshInterval = setInterval(() => {
        if (this.htmlFilePath) {
          // 通过添加时间戳参数强制刷新
          this.htmlFilePath = `${this.htmlFilePath.split('?')[0]}?t=${Date.now()}`;
        }
      }, 30000);  // 30秒间隔
    }
  },
  // 新增：组件销毁时清除定时器
  beforeDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
}
</script>
  <style scoped>
.card {
  border: none !important;
  overflow: hidden !important;
}
#mynetwork {
  width: 100%;
  height: 100%;
  border: 0 !important;
  overflow: hidden !important;
}
  .knowledge-graph-container {
    display: flex;
    flex-direction: column;
    height: 89vh;
    padding: 10px;
    padding-top: 2px;
    border-radius: 10px;
    border-color: #379310;
    background-color: #ffffff;
    border-style: solid;
    margin: 20px;
  }

  .html-viewer {
    flex: 1;
    overflow: hidden;

    margin-bottom: 10px;
  }

  .html-frame {
    width: 100%;
    height: 100%;
    border: none;
    overflow: hidden;
    display: block;
  }

  .input-section {
    display: flex;
    flex-direction: column;
    height: 30%;
  }

  .text-input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: none;
    margin-bottom: 10px;
  }

  .submit-btn {
    background-color: #388a0f;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .submit-btn:hover {
    background-color: #45a049;
    color: white;
  }
  </style>

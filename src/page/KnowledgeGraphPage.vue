<template>
  <div class="knowledge-graph-page">
    <h1>知识图谱生成器</h1>
    <KnowledgeGraph />
  </div>
</template>

<script>
import KnowledgeGraph from '../components/KnowledgeGraph.vue'

export default {
  name: 'KnowledgeGraphPage',
  components: {
    KnowledgeGraph
  }
}
</script>

<style scoped>
.knowledge-graph-page {
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #52C41A;
}
</style> 
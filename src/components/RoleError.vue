<script setup>
// 不再需要导入 Element Plus 图标
</script>

<template>
  <div class="error-wrapper">
    <div class="role-error-container">
      <img src="/ERROR.svg" alt="错误图标" class="warning-icon" />
      <p class="error-message">当前账号无权限访问此内容，请检查权限状态</p>
    </div>
  </div>
</template>

<style scoped>
.error-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 20px;
}

.role-error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.1);
  min-width: 500px;
}

.warning-icon {
  width: 100px;
  height: 100px;
  margin-bottom: 2rem;
}

.error-message {
  font-size: 24px;
  color: #606266;
  text-align: center;
  margin: 0;
  line-height: 1.5;
  font-weight: 500;
}
</style>
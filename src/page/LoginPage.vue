<script setup>
import { ref, onMounted } from 'vue';
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { message } from 'ant-design-vue';
import { storeToRefs } from "pinia";
import { UserData } from "../stores/User/User";

const userData = UserData();
const { role, user } = storeToRefs(userData);
const isFocused = ref(false);
const isBlurred = ref(false);
// 新增响应式数据
const username = ref('');
const password = ref('');
const isLoading = ref(false);
const isRegisterMode = ref(false);
const confirmPassword = ref('');
const isLoaded = ref(false);

const handleFocus = () => {
  isFocused.value = true;
  isBlurred.value = true;
};

const handleBlur = () => {
  isFocused.value = false;
  isBlurred.value = false;
  setTimeout(() => {
    isBlurred.value = false; // 确保退出动画生效
    document.documentElement.style.overflow = 'hidden'; // 强制隐藏滚动条
    document.body.style.overflow = 'hidden'; // 强制隐藏滚动条
  }, 0);
};

const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value;
  username.value = '';
  password.value = '';
  confirmPassword.value = '';
};

const handleSubmit = () => {
  console.log('Submit button clicked, mode:', isRegisterMode.value ? 'register' : 'login');
  if (isRegisterMode.value) {
    handleRegister();
  } else {
    handleLogin();
  }
};

const handleLogin = async () => {
  console.log('Login button clicked');
  if (!username.value || !password.value) {
    message.error('请输入用户名和密码');
    return;
  }

  try {
    console.log('Attempting login...');
    isLoading.value = true;
    const response = await fetch(`http://127.0.0.1:8000/login?username=${encodeURIComponent(username.value)}&password=${encodeURIComponent(password.value)}`);
    console.log('Login response:', response);
    
    if (!response.ok) {
      throw new Error('登录失败');
    }

    const data = await response.json();
    console.log('Login successful:', data);
    message.success(data.message);

    // 新增日志记录
    const now = new Date();
    const timestamp = `${now.getFullYear()}年${(now.getMonth()+1).toString().padStart(2,'0')}月${now.getDate().toString().padStart(2,'0')}日 ${now.getHours().toString().padStart(2,'0')}时${now.getMinutes().toString().padStart(2,'0')}分${now.getSeconds().toString().padStart(2,'0')}秒`;

    try {
      // 修改后的日志记录代码
      await fetch(`http://127.0.0.1:8000/addLog?log_content=${encodeURIComponent(
          `于 ${timestamp} 登录 用户权限: ${data.role}`
      )}`, {
        method: 'GET',  // 改为GET方法
        // 移除headers和body参数
      });
    } catch (logError) {
      console.error('日志记录失败:', logError);
    }

    window.location.href = '/Home';
    role.value = data.role;
    user.value = data.username;

  } catch (error) {
    console.error('Login error:', error);
    message.error(error.message || '用户名或密码错误');
  } finally {
    isLoading.value = false;
  }
};

const handleRegister = async () => {
  console.log('Starting registration process');
  if (!username.value || !password.value || !confirmPassword.value) {
    message.error('请填写所有字段');
    return;
  }

  if (password.value !== confirmPassword.value) {
    message.error('两次输入的密码不一致');
    return;
  }

  try {
    isLoading.value = true;
    console.log('Sending registration request');
    
    const response = await fetch(`http://127.0.0.1:8000/register?username=${encodeURIComponent(username.value)}&password=${encodeURIComponent(password.value)}`, {
      method: 'GET'
    });

    console.log('Registration response received:', response);

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('用户名已存在');
      } else {
        const error = await response.json();
        throw new Error(error.detail || '注册失败');
      }
    }

    const data = await response.json();
    console.log('Registration successful:', data);
    message.success('注册成功');
    isRegisterMode.value = false;
    // 清空输入框
    username.value = '';
    password.value = '';
    confirmPassword.value = '';
  } catch (error) {
    console.error('Registration error:', error);
    message.error(error.message);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
});
</script>

<template>
  <div class="background-container" :class="{ 'blur-background': isBlurred }">
    <div class="platform-title" :class="{ 'title-loaded': isLoaded }">
      <div class="title-wrapper">
        <div class="vertical-text">
          <div class="sub-title">地表覆盖智能服务平台</div>
          <div class="main-title">智绘未来</div>
        </div>
      </div>
    </div>
  </div>
  <div class="glass-container" :class="{ 'container-loaded': isLoaded }">
    <div class="login-form" :class="{ 'focused': isFocused }">
      <h2 class="form-title">{{ isRegisterMode ? '注册' : '登录' }}</h2>
      <div class="form-content">
        <a-input
          @focus="handleFocus"
          @blur="handleBlur"
          v-model:value="username"
          size="large"
          placeholder="用户名"
          class="custom-input"
        >
          <template #prefix>
            <UserOutlined class="input-icon" />
          </template>
        </a-input>
        
        <a-input
          @focus="handleFocus"
          @blur="handleBlur"
          v-model:value="password"
          size="large"
          type="password"
          placeholder="密码"
          class="custom-input"
        >
          <template #prefix>
            <LockOutlined class="input-icon" />
          </template>
        </a-input>

        <a-input
          v-if="isRegisterMode"
          @focus="handleFocus"
          @blur="handleBlur"
          v-model:value="confirmPassword"
          size="large"
          type="password"
          placeholder="确认密码"
          class="custom-input"
        >
          <template #prefix>
            <LockOutlined class="input-icon" />
          </template>
        </a-input>

        <a-button
          type="primary"
          size="large"
          class="submit-button"
          :loading="isLoading"
          @click="handleSubmit"
        >
          {{ isRegisterMode ? '注册' : '登录' }}
        </a-button>

        <div class="toggle-mode">
          <a @click="toggleMode">
            {{ isRegisterMode ? '已有账号？点击登录' : '没有账号？点击注册' }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600&display=swap');

html, body {
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
}

.background-container {
  background-image: url('/earth.jpg');
  background-size: cover;
  background-position: -280px center;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.glass-container {
  position: fixed;
  top: -50px;
  right: 0;
  transform: scale(0.7);
  background: #1e2837;
  padding: 50px;
  width: 35%;
  height: calc(100vh + 50px);
  min-width: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: -8px 0 32px 0 rgba(15, 23, 42, 0.3);
  opacity: 0;
  visibility: hidden;
  transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
  border-top-left-radius: 500px;
  border-bottom-left-radius: 500px;
}

.container-loaded {
  transform: scale(1);
  opacity: 1;
  visibility: visible;
}

.platform-title {
  position: fixed;
  top: 40px;
  left: 20px;
  transform: scale(0.7);
  opacity: 0;
  visibility: hidden;
  transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
}

.title-wrapper {
  display: flex;
  justify-content: flex-start;
}

.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0;
  position: relative;
  padding-left: 40px;
}

.main-title {
  font-size: 85px;
  font-family: "华文行楷", "行楷", "STXingkai", cursive;
  font-weight: normal;
  letter-spacing: 16px;
  color: #ffffff;
  margin: 0;
  line-height: 1.2;
  position: relative;
  right: -20px;
  text-shadow: 
    0 0 10px rgba(255, 255, 255, 0.8),
    0 0 20px rgba(255, 255, 255, 0.4),
    0 0 30px rgba(255, 255, 255, 0.2);
  animation: glow 2s ease-in-out infinite alternate;
}

.sub-title {
  font-size: 38px;
  font-family: "华文行楷", "行楷", "STXingkai", cursive;
  font-weight: normal;
  letter-spacing: 12px;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  line-height: 1.2;
  position: relative;
  right: -40px;
  top: 200px;
  text-shadow: 
    0 0 8px rgba(255, 255, 255, 0.6),
    0 0 15px rgba(255, 255, 255, 0.3);
}

.form-title {
  color: #ffffff;
  text-align: center;
  margin-bottom: 40px;
  font-size: 32px;
  font-weight: 400;
  letter-spacing: 2px;
}

.custom-input {
  margin-bottom: 25px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.custom-input:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.custom-input:focus-within {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.05);
}

.custom-input input {
  background: transparent !important;
  color: #ffffff;
  height: 45px;
  font-size: 16px;
  padding: 0 15px;
}

.custom-input :deep(.ant-input) {
  background: transparent !important;
  color: #ffffff;
}

.custom-input input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.input-icon {
  color: rgba(255, 255, 255, 0.6);
  font-size: 18px;
  margin: 0 10px;
  transition: color 0.3s ease;
}

.custom-input:focus-within .input-icon {
  color: rgba(255, 255, 255, 0.8);
}

.submit-button {
  width: 100%;
  height: 50px;
  margin-top: 30px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  border: none;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 1px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
}

.submit-button:hover {
  background: linear-gradient(135deg, #66BB6A 0%, #388E3C 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(46, 125, 50, 0.4);
}

.submit-button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 8px rgba(46, 125, 50, 0.3);
}

.toggle-mode {
  text-align: center;
  margin-top: 25px;
}

.toggle-mode a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 16px;
  transition: all 0.3s ease;
  position: relative;
  padding-bottom: 2px;
}

.toggle-mode a:hover {
  color: #ffffff;
}

.toggle-mode a::after {
  background: rgba(255, 255, 255, 0.6);
}

.background-container.blur-background {
  filter: blur(5px);
  transform: scale(1.02);
  transition: all 0.3s ease;
}

.login-form {
  width: 100%;
  max-width: 500px;
  padding: 20px;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 1;
}

.login-form.focused {
  transform: scale(1.02);
}

@keyframes scanline {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

.glass-container::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 2px;
  background: linear-gradient(90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: scanline 2s linear infinite;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.container-loaded::before {
  opacity: 1;
}

.title-loaded {
  transform: scale(1);
  opacity: 1;
  visibility: visible;
}

@keyframes glow {
  from {
    text-shadow: 
      0 0 10px rgba(255, 255, 255, 0.8),
      0 0 20px rgba(255, 255, 255, 0.4),
      0 0 30px rgba(255, 255, 255, 0.2);
  }
  to {
    text-shadow: 
      0 0 15px rgba(255, 255, 255, 0.9),
      0 0 25px rgba(255, 255, 255, 0.5),
      0 0 35px rgba(255, 255, 255, 0.3);
  }
}

@media (max-width: 1200px) {
  .platform-title {
    top: 30px;
    left: 15px;
  }
  
  .main-title {
    font-size: 70px;
    right: -15px;
  }
  
  .sub-title {
    font-size: 32px;
    right: -30px;
    top: 160px;
    letter-spacing: 10px;
  }

  .vertical-text {
    padding-left: 30px;
  }
}

@media (max-width: 768px) {
  .platform-title {
    top: 20px;
    left: 10px;
  }
}
</style>

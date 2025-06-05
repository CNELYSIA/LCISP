import { createRouter, createWebHistory } from 'vue-router'
import index from '../page/index.vue'
import LoginPage from "../page/LoginPage.vue";
import KnowledgeGraphPage from "../page/KnowledgeGraphPage.vue";
const routes = [
    {
        path: '/Home',
        name: 'Home',
        component: index,
        meta: {
            requiresAuth: true, // 添加 requiresAuth 属性，表示需要登录才能访问
        },
    },
    {
        path: '/knowledge-graph',
        name: 'KnowledgeGraph',
        component: KnowledgeGraphPage,
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/',
        name: 'Login',
        component: LoginPage
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
    // 检查目标路由是否需要登录
    if (to.meta.requiresAuth) {
        // 检查用户是否已登录，这里假设使用 localStorage 存储登录状态
        const isLoggedIn = sessionStorage.getItem('role');
        if (!isLoggedIn) {
            // 未登录，重定向到登录页面
            next('/');
        } else {
            // 已登录，继续导航
            next();
        }
    } else {
        // 不需要登录验证，直接导航
        next();
    }
});


export default router

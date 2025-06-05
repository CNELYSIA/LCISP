import { defineStore } from 'pinia'
export const UserData = defineStore('user', {
    /**
     * 类似组件的 SysData, 用于存储全局的的状态
     * 注意:
     *    1.必须是函数, 为了在服务端渲染的时候避免交叉请求导致的数据交叉污染
     *    2.必须是箭头函数, 为了更好的 TS 类型推导
     */
    state: () => {
        return {
            role: 'user',
            user: 'admin'
        }
    },
    /**
     * 类似组件的 computed, 用来封装计算属性, 具有缓存特性
     */
    getters: {

    },
    /**
     * 类似组件的 methods, 封装业务逻辑, 修改state
     * 注意: 里面的函数不能定义成箭头函数(函数体中会用到this)
     */
    actions: {

    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'role',
                storage: sessionStorage
            }
        ]
    }
})

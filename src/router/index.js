import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/explore',
        name: 'explore',
        component: () => import('../views/ExplorerView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
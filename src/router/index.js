import { createRouter, createWebHistory } from 'vue-router'
import index from "../views/index.vue";
import login from "../views/login.vue";

const routes = [
    {
        path: "/",
        name: "index",
        component: index
    },
    {
      path: "/login",
      name: "login",
      component: login
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
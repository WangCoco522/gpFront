import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/login.vue";
import Home from "../views/home.vue";
import Register from "../views/register.vue";
import notFound from "../views/notFound.vue";
import SensorData from "../views/page_Navigation/sensorData.vue";
import Linecharts from "../views/page_Navigation/linecharts.vue";
import Message from "../views/page_Navigation/message.vue";
import Setting from "../views/page_Navigation/setting.vue";
import UserManage from "../views/page_Navigation/userManage.vue";


const routes = [
    {
        path: '/',
        redirect: '/login',
    },

    { 
        path: "/login", 
        name: 'Login', 
        component: Login 
    },

    { 
        path: "/register", 
        name: 'Register', 
        component: Register
    },

    {
        path: '/notFound',
        component: notFound,
    },

    {
        path: '/home',
        component: Home,
        children: [   
            
        {
            path: 'sensorData',
            name: 'sensorData',
            component: SensorData,
        },

        {
            path: 'message',
            name: 'message',
            component: Message,
        },

        {
            path: 'linecharts',
            name: 'linecharts',
            component: Linecharts,
        },

        {
            path: 'setting',
            name: 'setting',
            component: Setting,
        },
    
    ]

    },
];

const router = createRouter(
    {
        history: createWebHistory(import.meta.env.BASE_URL),
        routes
    });

export default router;


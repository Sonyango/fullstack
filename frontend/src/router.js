import { createRouter, createWebHistory } from 'vue-router';
import DefaultLayout from './components/DefaultLayout.vue';
import Home from './pages/Home.vue';
import Images from './pages/Images.vue';
import Login from './pages/Login.vue';
import Signup from './pages/Signup.vue';
import NotFound from './pages/NotFound.vue';
import  useUserStore  from './store/user.js';

const routes = [
    {
        path: '/',
        component: DefaultLayout,
        children: [
            {path: '/', name: 'Home', component: Home},
            {path: '/images', name: 'Images', component: Images}
        ],
        beforeEnter: async (to, from, next) => {
            try {
                const userStore = useUserStore();
                await userStore.fetchUser();
                next();
            } catch (error) {
                next(false);
            }
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/signup',
        name: 'Signup',
        component: Signup,
    },
    { 
        path: '/:pathMatch(.*)*', 
        name: 'NotFound', 
        component: NotFound 
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
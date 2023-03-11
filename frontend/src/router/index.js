import { createRouter, createWebHistory } from 'vue-router';

import Content from '@/views/Content';
import Collections from '@/views/Collections';
import Authorization from '@/views/Authorization';
import isAuthenticatedGuard from '@/router/auth-guard';
import store from '@/authStore';

const routes = [
    {
        path: '/',
        redirect: '/content/discover',
    },
    {
        path: '/auth',
        name: 'auth',
        component: Authorization,
    },
    {
        path: '/content/:type/:collectionId?',
        name: 'content',
        component: Content,
        beforeEnter: [isAuthenticatedGuard],
        props: (route) => {
            return { contentType: (route.params.type) };
        },

    },
    {
        path: '/collections',
        name: 'collections',
        component: Collections,
        beforeEnter: [isAuthenticatedGuard],
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach(async (to, from, next) => {
    if (!store.getters.currentAuthState && localStorage.getItem('token'))
        await store.dispatch('checkAuthentication');

    if (to.path === '/') {
        store.getters.currentAuthState ? next('/content/discover') : next('/auth');
    } else if (to.path === '/auth' && store.getters.currentAuthState) {
        next('/content/discover');
    } else {
        next();
    }
});

export default router;

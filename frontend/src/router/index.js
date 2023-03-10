import { createRouter, createWebHistory } from 'vue-router';

import Content from '@/views/Content';
import CollectionsList from '@/views/CollectionsList';
import Authorization from '@/views/Authorization';
import isAuthenticatedGuard from '@/router/auth-guard';
import store from '@/stores';

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
        component: CollectionsList,
        beforeEnter: [isAuthenticatedGuard],
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach(async (to, from, next) => {
    if (!store.getters['auth/currentAuthState'] && localStorage.getItem('token'))
        await store.dispatch('auth/checkAuthentication');

    if (to.path === '/') {
        store.getters['auth/currentAuthState'] ? next('/content/discover') : next('/auth');
    } else if (to.path === '/auth' && store.getters['auth/currentAuthState']) {
        next('/content/discover');
    } else {
        next();
    }
});

export default router;

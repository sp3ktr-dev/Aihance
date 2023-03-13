import store from '@/stores';

const isAuthenticatedGuard = async (to, from, next) => {
    store.getters['auth/currentAuthState'] ? next() : next('/auth');
};

export default isAuthenticatedGuard;
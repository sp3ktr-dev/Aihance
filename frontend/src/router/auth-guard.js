import store from '@/authStore';

const isAuthenticatedGuard = async (to, from, next) => {
    store.getters.currentAuthState ? next() : next('/auth');
};

export default isAuthenticatedGuard;
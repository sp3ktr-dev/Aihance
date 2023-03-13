import router from '@/router';

export const loginUser = (state, { user, token, isAdmin }) => {
    if (token) {
        localStorage.setItem('token', token);
        state.token = token;
    }
    state.authStatus = true;
    state.user = user;
    state.isAdmin = isAdmin;
};

export const logoutUser = (state, redirect = false) => {
    if (state.token) {
        state.user = null;
        state.token = null;
        state.authStatus = false;
        state.isAdmin = false;
        localStorage.removeItem('token');
        if (redirect) {
            router.push('/auth');
        }
    }
};
import authApi from '@/api/authApi';

export const registerUser = async ({ commit }, user) => {
    const { email, password } = user;
    try {
        const { data } = await authApi.post('/register', { email, password });
        const { id, token, roles } = data;

        user.id = id;
        delete user.password;

        const isAdmin = roles.split(',').includes('admin');

        commit('loginUser', { user, token, isAdmin });
        return { ok: true };
    } catch (error) {
        commit('logoutUser');
        return { ok: false, message: error.response.data.message };
    }
};

export const loginUser = async ({ commit }, user) => {
    const { email, password } = user;
    try {
        const { data } = await authApi.post('/login', { email, password });
        const { id, token, roles } = data;

        user.id = id;
        delete user.password;

        const isAdmin = roles.split(',').includes('admin');

        commit('loginUser', { user, token, isAdmin });
        return { ok: true };
    } catch (error) {
        commit('logoutUser');
        return { ok: false, message: error.response.data.message };
    }
};

export const checkAuthentication = async ({ commit }) => {
    const storageToken = localStorage.getItem('token');
    if (!storageToken) {
        commit('logout');
        return { ok: false };
    }

    try {
        const { data } = await authApi.get('/check-auth-status', {
            headers: { 'Authorization': `Bearer ${ storageToken }` },
        });
        const { id, email, token, roles } = data;

        const isAdmin = roles.includes('admin');
        const user = { id, email };

        commit('loginUser', { user, token, isAdmin });
        return { ok: true };
    } catch (error) {
        commit('logout');
        console.log(error);
    }
};

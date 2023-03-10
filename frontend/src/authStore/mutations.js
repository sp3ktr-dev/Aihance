export const loginUser = (state, { user, token, isAdmin }) => {
    console.log('mutation login');
    if (token) {
        localStorage.setItem('token', token);
        state.token = token;
    }
    state.authStatus = true;
    state.user = user;
    state.isAdmin = isAdmin;
};

export const logoutUser = (state) => {
    console.log('mutation logout');
    if (state.token) {
        state.user = null;
        state.token = null;
        state.authStatus = false;
        state.isAdmin = false;
        localStorage.removeItem('token');
    }
};
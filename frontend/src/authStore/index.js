import { createStore } from 'vuex';

import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';
import state from './state';

export default createStore({
    state,
    actions,
    mutations,
    getters,
});

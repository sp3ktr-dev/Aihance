import { createStore } from 'vuex';

import CollectionsStore from '@/stores/collections';
import AuthStore from '@/stores/auth';

const store = createStore({
    modules: {
        collections: CollectionsStore,
        auth: AuthStore,
    },
});

export default store;

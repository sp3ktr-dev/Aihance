import contentApi from '@/api/contentApi';

export const loadCollections = async ({ commit }) => {
    const { data } = await contentApi.get('/collection');
    commit('loadCollections', data);
};

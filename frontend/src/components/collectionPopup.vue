<template>
    <div>
        <template v-if="collectionsList.length">
            <div v-for="collection of collectionsList" :key="collection.id">
                <input
                  :id="`collection${collection.id}`"
                  type="checkbox"
                  :checked="isInCollection(collection.id)"
                  @click="toggleCollection(collection.id)"
                >
                <label :for="`collection${collection.id}`">{{ collection.name }}</label>
            </div>
        </template>
    </div>
</template>

<script>
import contentApi from '@/api/contentApi';
import { mapMutations } from 'vuex';

export default {
    name: 'collection-popup',
    emits: ['addedToCollection'],
    props: {
        id: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            collectionsList: [],
            imageCollections: [],
        };
    },
    methods: {
        ...mapMutations('collections', ['removeFromCollection']),
        async loadCollectionsList() {
            const { data } = await contentApi.get('/collection');
            this.collectionsList = data;
        },
        async loadImageCollections() {
            const { data } = await contentApi.get(`content/${ this.id }`);
            this.imageCollections = data.collections;
        },
        isInCollection(collectionId) {
            return this.imageCollections.some(collection => collection.id === collectionId);
        },
        async toggleCollection(collectionId) {
            if (this.isInCollection(collectionId)) {
                this.imageCollections = this.imageCollections.filter(collection => collection.id !== collectionId);
                await contentApi.delete(`/collection/${ collectionId }/removeContent?id=${ this.id }`);
                this.removeFromCollection({ contentId: this.id, collectionId });
            } else {
                this.imageCollections.push({ id: collectionId });
                await contentApi.post(`/collection/${ collectionId }/addContent?id=${ this.id }`);
                this.$emit('addedToCollection', { contentId: this.id, collectionId });
            }
        },
    },
    created() {
        this.loadCollectionsList();
        this.loadImageCollections();
    },
};
</script>

<style scoped>

</style>
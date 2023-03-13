<template>
    <div>
        <Menu :is-admin="admin"/>
        <template v-if="collections.length">
            <Collection
              :collectionData="collection"
              :is-admin="admin"
              :key="collection.id"
              @addedToCollection="addedToCollection"
              @removedFromCollection="removedFromCollection"
              v-for="collection of collections"/>
        </template>
    </div>
</template>

<script>
import Menu from '@/components/menu';
import Collection from '@/components/collection';
import { mapGetters } from 'vuex';
import contentApi from '@/api/contentApi';

export default {
    name: 'collections-list',
    components: { Menu, Collection },
    data() {
        return {
            collections: [],
            admin: this.isAdmin(),
        };
    },
    methods: {
        ...mapGetters(['isAdmin']),
        async loadCollections() {
            const { data } = await contentApi.get('/collection');
            this.collections = data;
        },
        addedToCollection(info) {
            const collection = this.collections.find(collection => collection.id === info.collectionId);
            collection.content.push(info.content);
        },
        removedFromCollection(info) {
            const collection = this.collections.find(collection => collection.id === info.collectionId);
            collection.content = collection.content.filter(picture => picture.id !== info.contentId);
        },
    },
    created() {
        this.loadCollections();
    },
};
</script>

<style scoped>

</style>
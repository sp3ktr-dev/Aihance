<template>
    <div>
        <Menu :is-admin="admin"/>
        <Collection
          :collectionData="collection"
          :is-admin="admin"
          :key="collection.id"
          v-for="collection of getCollections()"/>
    </div>
</template>

<script>
import Menu from '@/components/menu';
import Collection from '@/components/collection';
import { mapActions, mapGetters, mapMutations } from 'vuex';

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
        ...mapGetters('auth', ['isAdmin']),
        ...mapGetters('collections', ['getCollections']),
        ...mapActions('collections', ['loadCollections']),
        ...mapMutations('collections', ['setCollection']),
    },
    created() {
        this.loadCollections();
    },
    unmounted() {
        this.setCollection([]);
    },
};
</script>

<style scoped>

</style>
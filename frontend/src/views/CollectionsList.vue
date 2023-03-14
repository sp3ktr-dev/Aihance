<template>
    <div>
        <Sliding title="test" :id="openedId" @closeModal="closeModal" v-if="openedId"/>
        <Menu :is-admin="admin"/>
        <Collection
          :collectionData="collection"
          :is-admin="admin"
          :key="collection.id"
          @openModal="openModal"
          v-for="collection of getCollections()"/>
    </div>
</template>

<script>
import Menu from '@/components/menu';
import Sliding from '@/components/sliding';
import Collection from '@/components/collection';
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
    name: 'collections-list',
    components: { Menu, Collection, Sliding },
    data() {
        return {
            collections: [],
            openedId: null,
            admin: this.isAdmin(),
        };
    },
    methods: {
        ...mapGetters('auth', ['isAdmin']),
        ...mapGetters('collections', ['getCollections']),
        ...mapActions('collections', ['loadCollections']),
        ...mapMutations('collections', ['setCollection']),
        closeModal() {
            this.openedId = null;
        },
        openModal(id) {
            this.openedId = id;
        },
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
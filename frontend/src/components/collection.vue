<template>
    <div>
        <div style="text-align: center">
            <router-link :to='`/content/collection/${collection.id}`'><h1>{{ collection.name }}</h1></router-link>
        </div>

        <div class="pictures">
            <template v-if="collection.content.length">
                <Thumbnail
                  @open="openModal(picture.id)"
                  :picture="picture"
                  :is-admin="isAdmin"
                  :key="picture.id"
                  displayed-from="collection"
                  v-for="picture of collection.content"/>
            </template>
            <template v-else>{{ $t('messages.noImagesInCollection') }}</template>
        </div>
    </div>
</template>

<script>
import Thumbnail from '@/components/thumbnail';

export default {
    name: 'collection',
    emits: ['openModal'],
    props: {
        collectionData: {
            type: Object,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            required: true,
        },
    },
    components: { Thumbnail },
    data() {
        return {
            collection: this.collectionData,
        };
    },
    methods: {
        openModal(id) {
            this.$emit('openModal', id);
        },
    },
};
</script>

<style scoped>
.pictures {
    border: 1px solid #FF0000;
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
</style>
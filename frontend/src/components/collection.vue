<template>
    <div>
        <div style="text-align: center">
            <router-link :to='`/content/collection/${collection.id}`'><h1>{{ collection.name }}</h1></router-link>
        </div>

        <div class="pictures">
            <template v-if="collection.content.length">
                <Thumbnail
                  :picture="picture"
                  :is-admin="isAdmin"
                  :key="picture.id"
                  @addedToCollection="addedToCollection"
                  @removedFromCollection="removedFromCollection"
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
    emits: ['addedToCollection', 'removedFromCollection'],
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
        addedToCollection(info) {
            const content = this.collection.content.find(picture => picture.id === info.contentId);
            this.$emit('addedToCollection', { content, collectionId: info.collectionId });
        },
        removedFromCollection(info) {
            console.log(info);
            this.$emit('removedFromCollection', info);
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
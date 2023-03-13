<template>
    <div :class="{ 'removed': removed }">
        <img :src="`${mediumFolder}/${picture.preview_medium}.png`" :alt="picture.keywords" @click="open">
        <br>
        <template v-if="this.displayedFrom !== 'deleted'">
            <button>{{ $t('ui.buttons.like') }}</button>
            <button @click="openPopup=!openPopup">{{ $t('ui.buttons.toCollection') }}</button>
            <button @click="removeContent()" v-if="isAdmin && !removed">{{ $t('ui.buttons.delete') }}</button>
            <CollectionPopup
              v-if="openPopup"
              @addedToCollection="addedToCollection"
              :id="picture.id"/>
        </template>
        <button @click="restoreContent" v-else>{{ $t('ui.buttons.restore') }}</button>
    </div>
</template>

<script>
import CollectionPopup from '@/components/collectionPopup';
import { mapMutations } from 'vuex';
import contentApi from '@/api/contentApi';

export default {
    emits: ['restore'],
    props: {
        picture: {
            type: Object,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            required: true,
        },
        displayedFrom: {
            type: String,
            required: true,
        },
    },
    components: { CollectionPopup },
    data() {
        return {
            mediumFolder: `${ process.env.VUE_APP_BACKEND_API }/images/medium`,
            openPopup: false,
            removed: false,
        };
    },
    methods: {
        ...mapMutations('collections', ['addToCollection']),
        open() {
            this.$emit('open', this.picture.id);
        },
        addedToCollection(info) {
            this.addToCollection({ content: this.picture, collectionId: info.collectionId });
        },
        async removeContent() {
            this.removed = true;
            await contentApi.delete(`/content/${ this.picture.id }`);
        },
        async restoreContent() {
            await contentApi.put(`/content/${ this.picture.id }`);
            this.$emit('restore', this.picture.id);
        },
    },
};
</script>

<style scoped>
.removed {
    opacity: 0.4;
}
</style>
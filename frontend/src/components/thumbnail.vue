<template>
    <div>
        <img :src="`${mediumFolder}/${picture.preview_medium}.png`" :alt="picture.keywords" @click="open">
        <br>
        <button>{{ $t('ui.buttons.like') }}</button>
        <button>{{ $t('ui.buttons.toCollection') }}</button>
        <button v-if="isAdmin">{{ $t('ui.buttons.delete') }}</button>
        <CollectionPopup
          @addedToCollection="addedToCollection"
          @removedFromCollection="removedFromCollection"
          :id="picture.id"/>
    </div>
</template>

<script>
import CollectionPopup from '@/components/collectionPopup';

export default {
    emits: ['addedToCollection', 'removedFromCollection'],
    props: {
        picture: {
            type: Object,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            required: true,
        },
    },
    components: { CollectionPopup },
    data() {
        return {
            mediumFolder: `${ process.env.VUE_APP_BACKEND_API }/images/medium`,
        };
    },
    methods: {
        open() {
            this.$emit('open', this.picture.id);
        },
        addedToCollection(info) {
            this.$emit('addedToCollection', info);
        },
        removedFromCollection(info) {
            this.$emit('removedFromCollection', info);
        },
    },
};
</script>

<style scoped>

</style>
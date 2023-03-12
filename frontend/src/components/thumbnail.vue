<template>
    <div>
        <img :src="`${mediumFolder}/${picture.preview_medium}.png`" :alt="picture.keywords">
    </div>
</template>

<script>
export default {
    props: {
        picture: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            mediumFolder: `${ process.env.VUE_APP_BACKEND_API }/images/medium`,
        };
    },
};
</script>

<style scoped>

</style>
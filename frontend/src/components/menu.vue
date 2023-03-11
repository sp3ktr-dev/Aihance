<template>
    <div id="menu">
        <router-link to="/content/discover">{{ $t('ui.discover') }}</router-link>
        <router-link to="/content/discover">{{ $t('ui.collections') }}</router-link>
        <router-link to="/content/discover">{{ $t('ui.favourite') }}</router-link>
        <router-link v-if="isAdmin" to="/collections">{{ $t('ui.deleted') }}</router-link>
        <router-link to="">{{ $t('ui.logout') }}</router-link>
    </div>
</template>

<script>
export default {
    name: 'content-menu',
    props: {
        isAdmin: {
            type: Boolean,
            required: true,
        },
    },
};
</script>

<style scoped>
#menu a {
    margin-right: 10px;
}
</style>
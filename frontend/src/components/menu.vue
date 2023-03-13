<template>
    <div id="menu">
        <router-link to="/content/discover">{{ $t('ui.discover') }}</router-link>
        <router-link to="/collections">{{ $t('ui.collections') }}</router-link>
        <router-link to="/content/favourite">{{ $t('ui.favourite') }}</router-link>
        <router-link v-if="isAdmin" to="/content/deleted">{{ $t('ui.deleted') }}</router-link>
        <a @click="logout">{{ $t('ui.logout') }}</a>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
    name: 'content-menu',
    props: {
        isAdmin: {
            type: Boolean,
            required: true,
        },
    },
    methods: {
        ...mapMutations('auth', ['logoutUser']),
        logout() {
            this.logoutUser(true);
        },
    },
};
</script>

<style scoped>
#menu a {
    margin-right: 10px;
}
</style>
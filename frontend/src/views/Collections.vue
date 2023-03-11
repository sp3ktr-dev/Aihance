<template>
    <div>
        <Menu :is-admin="isAdmin()"/>
    </div>
</template>

<script>
import Menu from '@/components/menu';
import { mapGetters } from 'vuex';

export default {
    name: 'collections-list',
    components: { Menu },
    methods: {
        ...mapGetters(['isAdmin']),
    },
};
</script>

<style scoped>

</style>
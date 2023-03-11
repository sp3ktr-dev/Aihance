<template>
    <div>
        <Menu :is-admin="isAdmin()"/>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Menu from '@/components/menu';

export default {
    name: 'Content area',
    components: { Menu },
    data() {
        return {
            contentType: this.$route.params.type,
        };
    },
    methods: {
        ...mapGetters(['isAdmin']),
    },
    mounted() {
    },
};
</script>

<style scoped>

</style>
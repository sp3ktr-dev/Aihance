<template>
    <div style="border: 1px solid #000">
        Busquedo<br>
        <form @submit.prevent="doSearch">
            {{ $t('ui.includeWords') }}
            <br>
            <input type="text" v-model="includeWords">
            <br>
            <input type="checkbox" v-model="includeAllWords">
            {{ $t('ui.includeAllWords') }}
            <br>
            {{ $t('ui.excludeWords') }}
            <br>
            <input type="text" v-model="excludeWords">
            <br>
            <button>{{ $t('ui.buttons.search') }}</button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'search',
    data() {
        return {
            includeWords: '',
            excludeWords: '',
            includeAllWords: false,
        };
    },
    methods: {
        doSearch() {
            this.$emit('search', {
                includeWords: this.includeWords,
                includeAllWords: this.includeAllWords,
                excludeWords: this.excludeWords,
            });
        },
    },
};
</script>

<style scoped>

</style>
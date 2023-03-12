<template>
    <div>
        {{ $t('ui.proportions') }}
        <button
          @click="setProportionFilter(undefined)"
          :class="{'selected': proportion === undefined}"
        >{{ $t('ui.all') }}
        </button>
        <button
          @click="setProportionFilter('horizontal')"
          :class="{'selected': proportion === 'horizontal'}"
        >{{ $t('ui.horizontal') }}
        </button>
        <button
          @click="setProportionFilter('vertical')"
          :class="{'selected': proportion === 'vertical'}"
        >{{ $t('ui.vertical') }}
        </button>
        <button
          @click="setProportionFilter('square')"
          :class="{'selected': proportion === 'square'}"
        >{{ $t('ui.square') }}
        </button>
        {{ $t('ui.onlyUpscales') }}
        <input type="checkbox" v-model="upscales">

    </div>
</template>

<script>
export default {
    data() {
        return {
            proportion: undefined,
            upscales: false,
        };
    },
    methods: {
        setProportionFilter(proportion) {
            this.proportion = proportion;
            this.emitFilters();
        },
        emitFilters() {
            this.$emit('filters', { proportion: this.proportion, upscales_only: this.upscales });
        },
    },
    watch: {
        upscales() {
            this.$emit('filters', { proportion: this.proportion, upscales_only: this.upscales });
        },
    },
};
</script>

<style scoped>
.selected {
    background-color: green;
}
</style>
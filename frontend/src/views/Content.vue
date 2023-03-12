<template>
    <div>
        <Menu :is-admin="isAdmin()"/>
        <Search @search="search" v-if="displayFilters"/>
        <Toolbar @filters="toolbarFilters" v-if="displayFilters"/>
        <div id="pictures" ref="pictures">
            <Thumbnail class="pictures_preview" v-for="picture of picturesList" :picture="picture" :key="picture.id"/>

        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Menu from '@/components/menu';
import Thumbnail from '@/components/thumbnail';
import contentApi from '@/api/contentApi';
import Search from '@/components/search';
import Toolbar from '@/components/toolbar';

export default {
    name: 'Content area',
    components: { Menu, Thumbnail, Search, Toolbar },
    props: {
        contentType: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            totalCount: 0,
            currentPage: 1,
            perPage: 50,
            loadMore: false,
            openedId: null,
            picturesList: [],
            filters: {},
        };
    },
    methods: {
        ...mapGetters(['isAdmin']),
        async loadContent(concat = false) {
            let contentRoute;
            switch (this.contentType) {
                case 'discover':
                    contentRoute = '/content';
                    break;
                case 'favourite':
                    contentRoute = '/favourite';
                    break;
                case 'deleted':
                    contentRoute = 'content/admin/removed';
                    break;
            }

            const { data } = await contentApi.get(`${ contentRoute }?${ this.queryFilters }`);
            this.picturesList = concat ? this.picturesList.concat(data.content) : data.content;
            this.totalCount = data.totalCount;
            this.loadMore = this.currentPage * this.perPage < this.totalCount;
        },
        handleScroll() {
            const reactZone = document.body.offsetHeight - 500;
            if (this.loadMore && window.innerHeight + window.pageYOffset > reactZone) {
                this.loadMore = false;
                this.currentPage++;
                this.loadContent(true);
            }
        },
        search({ includeWords, includeAllWords, excludeWords }) {
            this.filters.includeWords = includeWords !== '' ? includeWords : undefined;
            this.filters.includeAllWords = includeAllWords ? true : undefined;
            this.filters.excludeWords = excludeWords !== '' ? excludeWords : undefined;
            this.resetState();
            this.loadContent();
            console.log(this.filters);
        },
        toolbarFilters(filters) {
            Object.assign(this.filters, filters);
            this.resetState();
            this.loadContent();
        },
        resetState() {
            this.picturesList = [];
            this.currentPage = 1;
        },
    },
    created() {
        this.loadContent();
    },
    computed: {
        queryFilters() {
            let filtersArray = [];

            const offset = this.currentPage * this.perPage - this.perPage;
            filtersArray.push(`offset=${ offset }`);
            filtersArray.push(`limit=${ this.perPage }`);

            for (let key in this.filters) {
                if (this.filters.hasOwnProperty(key) && this.filters[key] !== undefined) {
                    filtersArray.push(`${ key }=${ this.filters[key] }`);
                }
            }
            return filtersArray.join('&');
        },
        displayFilters() {
            return this.contentType !== 'deleted';
        },
    },
    watch: {
        contentType() {
            console.log('watch');
            this.resetState();
            this.filters = {};
            this.loadContent();
        },
    },
    mounted() {
        console.log('mounted');
        window.addEventListener('scroll', this.handleScroll);
    },
    unmounted() {
        console.log('unmounted');
        window.removeEventListener('scroll', this.handleScroll);
    },
};
</script>

<style scoped>
#pictures {
    border: 1px solid #FF0000;
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
</style>
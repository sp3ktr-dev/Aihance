<template>
    <div>
        <Menu :is-admin="isAdmin()"/>
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

export default {
    name: 'Content area',
    components: { Menu, Thumbnail },
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
            filters: [],
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
                    contentRoute = '/deleted';
                    break;
            }
            const { data } = await contentApi(`${ contentRoute }?offset=${ this.currentPage * this.perPage -
            this.perPage }&limit=${ this.perPage }`);
            this.picturesList = concat ? this.picturesList.concat(data.content) : data.content;
            this.loadMore = true;
        },
        handleScroll() {
            const reactZone = document.body.offsetHeight - 500;
            if (this.loadMore && window.innerHeight + window.pageYOffset > reactZone) {
                this.loadMore = false;
                this.currentPage++;
                this.loadContent(true);
            }
        },
    },
    created() {
        this.loadContent();
    },
    watch: {
        contentType() {
            console.log('WTCH');
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
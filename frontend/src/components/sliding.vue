<template>
    <div class="modal-overlay" @click="close">
        <div class="modal">
            <div class="modal-header">
                <h3>{{ title }}</h3>
                <button class="modal-close" @click="close">×</button>
            </div>
            <div class="modal-body">
                <slot>
                    <img v-if="picture.url" :src="picture.url">
                </slot>
            </div>
            <div class="modal-footer">
                <button class="modal-button modal-close" @click="close">Close</button>
            </div>
        </div>
    </div>
</template>

<script>
import contentApi from '@/api/contentApi';

export default {
    name: 'Modal',
    props: {
        title: {
            type: String,
            default: 'Modal title',
        },
        id: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            picture: {},
        };
    },
    methods: {
        close() {
            this.$emit('closeModal');
        },
        async loadPicture() {
            const { data } = await contentApi.get(`content/${ this.id }`);
            this.picture = data;
        },
    },
    created() {
        this.loadPicture();
    },
};
</script>

<style>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    min-width: 400px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.modal-header {
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f0f0f0;
}

.modal-header h3 {
    margin: 0;
}

.modal-close {
    border: none;
    background: none;
    font-size: 1.5rem;
    cursor: pointer;
}

.modal-body {
    padding: 1rem;
}

.modal-body img {
    max-height: 85vh;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    padding: 1rem;
}

.modal-button {
    margin-left: 1rem;
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    background-color: #f0f0f0;
    border-radius: 5px;
    cursor: pointer;
}

.modal-button:hover {
    background-color: #ccc;
}
</style>

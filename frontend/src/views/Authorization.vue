<template>
    <div>
        <div>
            <a @click="changeMode('authorization')">Enter</a> |
            <a @click="changeMode('registration')">Register</a>
            <div>
                <form @submit.prevent="onSubmit">
                    <input type="email" v-model="email">
                    <input type="password" v-model="password">
                    <input type="password" v-model="passwordConfirm" v-if="isRegistration">
                    <button>Register</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            email: 'test9@google.com',
            password: 'Abc123',
            passwordConfirm: '',
            mode: 'authorization',
        };
    },
    methods: {
        changeMode(mode) {
            this.mode = mode;
        },
        onSubmit() {
            console.log('onsubmit');
            if (!this.email || !this.password) {
                return;
            }
            const payload = {
                email: this.email,
                password: this.password,
            };
            if (this.isRegistration) {
                this.$store.dispatch('registerUser', payload);
            } else if (this.isAuthorization) {
                this.$store.dispatch('loginUser', payload);
            }
        },
    },
    computed: {
        isRegistration() {
            return this.mode === 'registration';
        },
        isAuthorization() {
            return this.mode === 'authorization';
        },
    },
};
</script>

<style scoped>

</style>
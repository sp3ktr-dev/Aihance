<template>
    <div>
        <div>
            <a @click="changeMode('authorization')">{{ $t('ui.enter') }}</a> |
            <a @click="changeMode('registration')">{{ $t('ui.register') }}</a>
            <div>
                <form @submit.prevent="onSubmit">

                    <input type="text" v-model="email">
                    <span v-if="emailValidation">{{ emailValidation }}</span>
                    <br>
                    <input type="password" v-model="password">
                    <span v-if="passwordValidation">{{ passwordValidation }}</span>
                    <br>
                    <template v-if="isRegistration">
                        <input type="password" v-model="passwordConfirm">
                        <span v-if="passwordConfirmValidation">{{ passwordConfirmValidation }}</span>
                    </template>
                    <br>
                    <div v-if="backendError">{{ backendError }}</div>
                    <button>{{ isRegistration ? $t('ui.buttons.register') : $t('ui.buttons.enter') }}</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core/dist/index.esm';
import { email, required, helpers, minLength, sameAs } from '@vuelidate/validators';

export default {
    data() {
        return {
            email: 'mail@mail.com',
            password: 'Abc123',
            passwordConfirm: '',
            mode: 'authorization',
            v$: useVuelidate(),
            backendError: null,
        };
    },
    methods: {
        changeMode(mode) {
            this.mode = mode;
        },
        async onSubmit() {
            this.v$.$validate();
            if (!this.v$.$error) {
                let authorize;
                const payload = {
                    email: this.email,
                    password: this.password,
                };
                if (this.isRegistration) {
                    authorize = await this.$store.dispatch('auth/registerUser', payload);
                } else if (this.isAuthorization) {
                    authorize = await this.$store.dispatch('auth/loginUser', payload);
                }
                if (authorize.ok) {
                    this.$router.push('/content/discover');
                } else {
                    // show error
                    switch (authorize.message) {
                        case 'Incorrect email':
                            this.backendError = this.$t('errors.emailNotFound');
                            break;
                        case 'Incorrect password':
                            this.backendError = this.$t('errors.invalidPassword');
                            break;
                        default:
                            this.backendError = authorize.message;
                    }
                }
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
        emailValidation() {
            return this.v$.email.$error ? this.v$.email.$errors[0].$message : false;
        },
        passwordValidation() {
            return this.v$.password.$error ? this.v$.password.$errors[0].$message : false;
        },
        passwordConfirmValidation() {
            return this.v$.passwordConfirm.$error ? this.v$.passwordConfirm.$errors[0].$message : false;
        },
    },
    validations() {
        const validations = {
            email: {
                required: helpers.withMessage(this.$t('errors.emailRequired'), required),
                email: helpers.withMessage(this.$t('errors.invalidEmail'), email),
            },
            password: {
                minLength: helpers.withMessage(this.$t('errors.invalidPasswordLength'), minLength(6)),
                regexp: helpers.withMessage(
                  this.$t('errors.invalidPasswordScheme'),
                  helpers.regex(/^(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/),
                ),
            },
        };
        if (this.isRegistration) {
            validations.passwordConfirm = {
                sameAsPassword: helpers.withMessage(this.$t('errors.invalidPasswordConfirm'), sameAs(this.password)),
            };
        }
        return validations;
    },

};
</script>

<style scoped>

</style>
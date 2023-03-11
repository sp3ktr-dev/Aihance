import { createI18n } from 'vue-i18n/index.mjs';
import { en } from './en';
import { es } from './es';

export const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en,
        es,
    },
});
export default i18n;

import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({

    NODE_ENV: Joi.string().default('dev'),
    API_PORT: Joi.number().default(3000),
    JWT_SECRET: Joi.string().required(),

    MYSQL_DB_NAME: Joi.string().default('aihance'),
    MYSQL_HOST: Joi.string().default('localhost'),
    MYSQL_ROOT_PASS: Joi.string().default(''),
    MYSQL_USER: Joi.string().required(),
    MYSQL_PASSWORD: Joi.string().required(),
    MYSQL_TIMEZONE: Joi.string().default('Europe/Madrid'),

});

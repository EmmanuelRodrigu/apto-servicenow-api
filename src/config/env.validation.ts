import * as Joi from 'joi';
import {
    APP_NAME,
    APP_URL,
    //WEB_URL,
    //ADMIN_URL,
    PORT,
    //DATABASE_URL,
    //MAIL_HOST,
    //MAIL_USERNAME,
    //MAIL_PASSWORD,
    EMAIL_TEST,
} from './constants';

const validationSchema = Joi.object({
    [APP_NAME]: Joi.string().required(),
    [APP_URL]: Joi.string().required(),
    //[WEB_URL]: Joi.string().required(),
    //[ADMIN_URL]: Joi.string().required(),
    [PORT]: Joi.string().required(),
    //[DATABASE_URL]: Joi.string().required(),
    //[MAIL_HOST]: Joi.string().required(),
    //[MAIL_USERNAME]: Joi.string().required(),
    //[MAIL_PASSWORD]: Joi.string().required(),
    [EMAIL_TEST]: Joi.string().required(),
});

export default validationSchema;
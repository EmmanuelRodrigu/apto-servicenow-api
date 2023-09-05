import { registerAs } from '@nestjs/config';
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
} from '../constants';

export default registerAs('base', () => ({
    appName: process.env[APP_NAME],
    appUrl: process.env[APP_URL],
    //webUrl: process.env[WEB_URL],
    //adminUrl: process.env[ADMIN_URL],
    port: process.env[PORT],
    //databaseUrl: process.env[DATABASE_URL],
    //mailHost: process.env[MAIL_HOST],
    //mailUsername: process.env[MAIL_USERNAME],
   // mailPassword: process.env[MAIL_PASSWORD],
    emailTest: process.env[EMAIL_TEST],
}))
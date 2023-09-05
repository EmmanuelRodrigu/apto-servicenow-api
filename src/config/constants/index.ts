//Variables
export const APP_NAME = 'APP_NAME';
export const APP_URL = 'APP_URL';
//export const WEB_URL = 'WEB_URL';
//export const ADMIN_URL = 'ADMIN_URL';
export const PORT = 'PORT';
//export const DATABASE_URL = 'DATABASE_URL';

//export const MAIL_HOST = 'MAIL_HOST';
//export const MAIL_USERNAME = 'MAIL_USERNAME';
//export const MAIL_PASSWORD = 'MAIL_PASSWORD';
export const EMAIL_TEST = 'EMAIL_TEST';

export const ROL_MASTER = 1;
export const ROL_ADMIN = 2;
export const ROL_CLIENT = 3;

export const BASE_PREFIX_API = 'api';
export const BASE_PREFIX_ADMIN = 'admin';

export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_USER = process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD || '3031022a';
export const DB_NAME = process.env.DB_NAME || 'apto_service_now';
export const DB_PORT = parseInt(process.env.DB_PORT) || 3306;
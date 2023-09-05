import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_USER,
} from '../src/config/constants'

export const config: TypeOrmModuleOptions = {
    type: "mysql",
    host: DB_HOST,
    port: 3001,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: [
        __dirname + '/**/*.entity{.ts,.js}'
    ],
    synchronize: true,
};
/*
export const ormConfig = {
    ...config,
    migrationsTableName: 'migrations',
    migrationsRun: true,
    migrations: [
        __dirname + 'database/migrations/*.ts'
    ],
    cli: {
        "migrationsDir": "database/migrations"
    },
};

export default ormConfig;
*/
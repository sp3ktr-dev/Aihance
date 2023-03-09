import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { CollectionModule } from './collection/collection.module';
import { FavouriteModule } from './favourite/favourite.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [envConfiguration],
            validationSchema: JoiValidationSchema,
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.MYSQL_HOST,
            port: +process.env.MYSQL_PORT,
            username: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DB_NAME,
            autoLoadEntities: true,
            synchronize: true,
            extra: {
                softDelete: true,
                where: 'deletedAt IS NULL',
            },
        }),
        AuthModule,
        ContentModule,
        CollectionModule,
        FavouriteModule,
    ],
})
export class AppModule {
}

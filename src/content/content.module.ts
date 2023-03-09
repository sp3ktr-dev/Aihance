import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { Content } from './entities/content.entity';
import { AuthModule } from '@/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Content]),
        AuthModule,
        HttpModule,
    ],
    controllers: [ContentController],
    providers: [ContentService],
    exports: [ContentService, TypeOrmModule], // TODO: REMOVE TYPEORM
})
export class ContentModule {
}

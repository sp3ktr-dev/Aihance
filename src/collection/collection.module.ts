import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from '@/collection/entities/collection.entity';
import { ContentModule } from '@/content/content.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Collection]),
        ContentModule,
        AuthModule,
    ],
    controllers: [CollectionController],
    providers: [CollectionService],
})
export class CollectionModule {
}

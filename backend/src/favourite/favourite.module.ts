import { Module } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { FavouriteController } from './favourite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favourite } from '@/favourite/entities/favourite.entity';
import { ContentModule } from '@/content/content.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Favourite]),
        ContentModule,
        AuthModule,
    ],
    controllers: [FavouriteController],
    providers: [FavouriteService],
})
export class FavouriteModule {
}

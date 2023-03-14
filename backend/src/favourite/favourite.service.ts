import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { User } from '@/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Favourite } from '@/favourite/entities/favourite.entity';
import { Repository } from 'typeorm';
import { ContentService } from '@/content/content.service';
import { FiltersDto } from '@/common/dto/filters.dto';
import { buildFilterCondition } from '@/common/helpers/build-filter-condition.helper';
import { GetContentDto } from '@/content/dto/get-content.dto';

@Injectable()
export class FavouriteService {
    constructor(
        @InjectRepository(Favourite) private readonly favouriteRepository: Repository<Favourite>,
        private readonly contentService: ContentService) {
    }

    async create(createFavouriteDto: CreateFavouriteDto, user: User): Promise<Favourite> {
        const content = await this.contentService.findOne(+createFavouriteDto.content_id);
        const favouriteInDb = await this.favouriteRepository.findOneBy({
            user: { id: user.id },
            parentContent: { id: +createFavouriteDto.content_id },
        });
        if (favouriteInDb) {
            return favouriteInDb;
        }
        const favourite = this.favouriteRepository.create({
            parentContent: content,
            user,
        });
        return await this.favouriteRepository.save(favourite);
    }

    async findAll(filtersDto: FiltersDto, user: User): Promise<{ content: GetContentDto[], totalCount: number }> {
        const { limit = 50, offset = 0 } = filtersDto;
        const { condition, params } = buildFilterCondition(filtersDto);

        const favouriteQB = this.favouriteRepository.createQueryBuilder('favourite')
            .leftJoin('favourite.parentContent', 'content')
            .addSelect(['content.id', 'content.keywords', 'content.preview_small', 'content.preview_medium', 'content.width', 'content.height'])
            .where('favourite.user = :userId', { userId: user.id });

        if (condition) favouriteQB.andWhere(condition, params);

        const [favourites, totalCount] = await favouriteQB
            .orderBy('favourite.created_at', 'DESC')
            .take(limit)
            .skip(offset)
            .getManyAndCount();

        const content = favourites.map(favourite => favourite.parentContent).filter(picture => Boolean(picture)) as GetContentDto[];
        const getContentDto = content.map(contentItem => {
            contentItem.favourite = true;
            return contentItem;
        });

        return { content: getContentDto, totalCount };
    }

    async findOne(id: number, user: User): Promise<Favourite> {
        const favourite = await this.favouriteRepository.findOneBy({
            user: { id: user.id },
            parentContent: { id },
        });
        if (!favourite)
            throw new NotFoundException();
        return favourite;
    }

    async remove(id: number, user: User): Promise<void> {
        const favourite = await this.findOne(id, user);
        await this.favouriteRepository.remove(favourite);
    }
}

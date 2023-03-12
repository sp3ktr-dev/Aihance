import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { User } from '@/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Favourite } from '@/favourite/entities/favourite.entity';
import { Repository } from 'typeorm';
import { ContentService } from '@/content/content.service';
import { FiltersDto } from '@/common/dto/filters.dto';
import { buildFilterCondition } from '@/common/helpers/build-filter-condition.helper';

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

    async findAll(filtersDto: FiltersDto, user: User) {
        const { limit = 50, offset = 0 } = filtersDto;
        const { condition, params } = buildFilterCondition(filtersDto);

        const favouriteQB = this.favouriteRepository.createQueryBuilder('favourite')
            .leftJoinAndSelect('favourite.parentContent', 'content')
            .where('favourite.user = :userId', { userId: user.id });

        if (condition) favouriteQB.andWhere(condition, params);

        const [content, totalCount] = await favouriteQB
            .orderBy('favourite.created_at', 'DESC')
            .take(limit)
            .skip(offset)
            .getManyAndCount();
        return { content, totalCount };
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

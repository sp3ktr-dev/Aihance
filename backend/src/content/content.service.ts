import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import * as sharp from 'sharp';
import * as uuid from 'uuid';
import * as fs from 'fs';

import { Content } from '@/content/entities/content.entity';
import { CreateContentDto, UpdateContentDto } from './dto';
import { FiltersDto } from '@/common/dto/filters.dto';
import { firstValueFrom } from 'rxjs';
import { ContentProportions } from '@/content/enums/content-proportions.enum';
import { buildFilterCondition } from '@/common/helpers/build-filter-condition.helper';
import { User } from '@/auth/entities/user.entity';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Injectable()
export class ContentService {
    constructor(@InjectRepository(Content) private readonly contentRepository: Repository<Content>,
                private readonly httpService: HttpService) {
    }

    async create(createContentDto: CreateContentDto): Promise<Content> {

        const fullSizeName = uuid.v4();
        const mediumSizeName = uuid.v4();
        const smallSizeName = uuid.v4();

        const proportion =
            createContentDto.width > createContentDto.height
                ? ContentProportions.horizontal
                : createContentDto.width < createContentDto.height
                    ? ContentProportions.vertical
                    : ContentProportions.square;

        try {
            const response = await firstValueFrom(this.httpService.get(createContentDto.url, { responseType: 'arraybuffer' }));
            const originalImage = Buffer.from(response.data);
            await fs.promises.writeFile(`src/files/original/${ fullSizeName }.png`, originalImage);

            await Promise.all([
                this.resizeImage(originalImage, `src/files/medium/${ mediumSizeName }.png`, { height: 300 }),
                this.resizeImage(originalImage, `src/files/small/${ smallSizeName }.png`, { height: 100 }),
            ]);

            const content = this.contentRepository.create({
                keywords: createContentDto.keywords,
                preview_small: smallSizeName,
                preview_medium: mediumSizeName,
                image: fullSizeName,
                width: createContentDto.width,
                height: createContentDto.height,
                proportion,
                isUpscaled: createContentDto.isUpscaled,
                url: createContentDto.url,
                permalink: createContentDto.permalink,
                author_id: createContentDto.author_id,
            });

            return await this.contentRepository.save(content);
        } catch (error) {
            console.log(createContentDto.url);
        }
    }

    async findAll(filtersDto: FiltersDto, user: User): Promise<{ content: Content[]; totalCount: number }> {
        const { limit = 50, offset = 0 } = filtersDto;
        const { condition, params } = buildFilterCondition(filtersDto);

        const contentQB = this.contentRepository.createQueryBuilder('content')
            .select(['content.id', 'content.keywords', 'content.preview_small', 'content.preview_medium', 'content.width', 'content.height'])
            .leftJoinAndSelect('content.favourites', 'favourite', 'favourite.user = :userId', { userId: user.id });
        if (condition) contentQB.where(condition, params);

        const [content, totalCount] = await contentQB
            .setParameter('idt', 1)
            .take(limit)
            .skip(offset)
            .getManyAndCount();
        return { content, totalCount };
    }

    async findAllRemoved(paginationDto: PaginationDto): Promise<{ content: Content[]; totalCount: number }> {
        const { limit = 50, offset = 0 } = paginationDto;
        const [content, totalCount] = await this.contentRepository.createQueryBuilder('content')
            .where('content.deleted_at IS NOT NULL')
            .withDeleted()
            .take(limit)
            .skip(offset)
            .getManyAndCount();
        return { content, totalCount };
    }

    async findByCollection(
        collectionId: number,
        user: User,
        filtersDto: FiltersDto,
        returnTotalCount: boolean = false,
    ): Promise<Content[] | { content: Content[]; totalCount: number }> {
        const { limit = 50, offset = 0 } = filtersDto;
        const { condition, params } = buildFilterCondition(filtersDto);

        const collectionContentQB = this.contentRepository.createQueryBuilder('content')
            .leftJoinAndSelect('content.collections', 'collections')
            .where('collections.id = :collectionId', { collectionId });

        if (condition) collectionContentQB.andWhere(condition, params);

        collectionContentQB
            .take(limit)
            .skip(offset);

        if (returnTotalCount) {
            const [content, totalCount] = await collectionContentQB.getManyAndCount();
            return { content, totalCount };
        } else {
            return await collectionContentQB.getMany();
        }
    }

    async findOne(id: number): Promise<Content> {
        const content = await this.contentRepository.findOne({
            select: ['id', 'keywords', 'image', 'width', 'height', 'url', 'permalink', 'proportion'],
            relations: ['collections'],
            where: { id },
        });
        if (!content)
            throw new NotFoundException();
        return content;
    }

    async checkByPermalink(data: { permalink: string }) {
        return await this.contentRepository.exist({ where: { permalink: data.permalink } });

    }

    async update(id: number, updateContentDto: UpdateContentDto) {
        return `This action updates a #${ id } content`;
    }

    async softRemove(id: number) {
        const content = await this.findOne(id);
        await this.contentRepository.softRemove(content);
    }

    async restore(id: number) {
        await this.contentRepository.restore({ id });
    }

    private async resizeImage(originalImage: Buffer, saveTo: string, options: sharp.ResizeOptions): Promise<void> {
        const image = sharp(originalImage);
        const resizedImage = await image.resize(options);
        await resizedImage.toFile(saveTo);
    }
}

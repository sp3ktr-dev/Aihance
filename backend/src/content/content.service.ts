import { Injectable, NotFoundException } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
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
    }

    async findAll(filtersDto: FiltersDto): Promise<{ content: Content[]; totalCount: number }> {

        const { limit = 50, offset = 0, ...filters } = filtersDto;
        const proportion = filters.proportion ?? undefined;
        const upscalesOnly = filters.upscales_only === 'true';

        const includeWords = filters.includeWords ?
            filters.includeWords.split(/[,\s]+/).filter(Boolean)
            : undefined;
        const excludeWords = filters.excludeWords ?
            filters.excludeWords.split(/[,\s]+/).filter(Boolean)
            : undefined;

        // TODO: Max include and exclude words limit

        if (includeWords || excludeWords) {
            // TODO: rate limit (search)

        } else {
            // TODO: rate limit (normal page loads)
        }

        const contentQueryBuilder = this.contentRepository.createQueryBuilder('content');

        if (upscalesOnly)
            contentQueryBuilder.where('content.isUpscaled = :isUpscaled', { isUpscaled: true });

        if (proportion)
            contentQueryBuilder.andWhere('content.proportion = :proportion', { proportion });

        if (includeWords) {
            const includeParams = includeWords.reduce((params, word, i) => {
                params[`includesWord${ i }`] = `%${ word }%`;
                return params;
            }, {});

            const includesOperator = filters.includeAllWords ? 'AND' : 'OR';
            const includesCondition = includeWords.map((word, i) => `content.keywords LIKE :includesWord${ i }`).join(` ${ includesOperator } `);
            contentQueryBuilder.andWhere(new Brackets(qb => qb.where(includesCondition, includeParams)));
        }

        if (excludeWords) {
            const excludeParams = excludeWords.reduce((params, word, i) => {
                params[`excludesWord${ i }`] = `%${ word }%`;
                return params;
            }, {});

            contentQueryBuilder.andWhere(
                excludeWords.map((word, i) => `content.keywords NOT LIKE :excludesWord${ i }`).join(' AND '),
                excludeParams,
            );
        }

        contentQueryBuilder.take(limit).skip(offset);
        const [content, totalCount] = await contentQueryBuilder.getManyAndCount();
        return { content, totalCount };
    }

    async findByCollection(
        collectionId: number,
        paginationDto: PaginationDto,
        totalCount: boolean = false,
    ): Promise<Content[] | { content: Content[]; totalCount: number }> {
        const { limit = 50, offset = 0 } = paginationDto;
        const selectOptions = {
            where: {
                collections: { id: collectionId },
            },
            take: limit,
            skip: offset,
        };

        if (totalCount) {
            const [content, totalCount] = await this.contentRepository.findAndCount(selectOptions);
            return { content, totalCount };
        } else {
            return await this.contentRepository.find(selectOptions);
        }

    }

    async findOne(id: number): Promise<Content> {
        const content = await this.contentRepository.findOneBy({ id });
        if (!content)
            throw new NotFoundException();
        return content;
    }

    async update(id: number, updateContentDto: UpdateContentDto) {
        return `This action updates a #${ id } content`;
    }

    async remove(id: number) {
        return `This action removes a #${ id } content`;
    }

    private async resizeImage(originalImage: Buffer, saveTo: string, options: sharp.ResizeOptions): Promise<void> {
        const image = sharp(originalImage);
        const resizedImage = await image.resize(options);
        await resizedImage.toFile(saveTo);
    }
}

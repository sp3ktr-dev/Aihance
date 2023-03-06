import { Injectable } from '@nestjs/common';
import { CreateContentDto, UpdateContentDto } from './dto';
import { FiltersDto } from '@/common/dto/filters.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from '@/content/entities/content.entity';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class ContentService {
    constructor(@InjectRepository(Content) private readonly contentRepository: Repository<Content>) {
    }

    async create(createContentDto: CreateContentDto) {
        return 'This action adds a new content';
    }

    async findAll(filtersDto: FiltersDto): Promise<Content[]> {

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
        return await contentQueryBuilder.getMany();
    }

    async findOne(id: number) {
        return `This action returns a #${ id } content`;
    }

    async update(id: number, updateContentDto: UpdateContentDto) {
        return `This action updates a #${ id } content`;
    }

    async remove(id: number) {
        return `This action removes a #${ id } content`;
    }
}

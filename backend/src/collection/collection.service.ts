import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Collection } from '@/collection/entities/collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { User } from '@/auth/entities/user.entity';
import { ContentService } from '@/content/content.service';
import { FiltersDto } from '@/common/dto/filters.dto';

@Injectable()
export class CollectionService {

    constructor(
        @InjectRepository(Collection) private readonly collectionRepository: Repository<Collection>,
        private readonly contentService: ContentService,
    ) {
    }

    async create(createCollectionDto: CreateCollectionDto, user: User): Promise<Collection> {
        if (createCollectionDto.user)
            throw new BadRequestException();
        createCollectionDto.user = user;
        const collection = await this.collectionRepository.create(createCollectionDto);
        return await this.collectionRepository.save(collection);
    }

    async findOne(id: number, user: User, getContent: boolean = false): Promise<Collection> {
        const collection = await this.collectionRepository.findOne({
            relations: {
                content: getContent,
            },
            where: { id, user: { id: user.id } },
        });
        if (!collection)
            throw new NotFoundException();
        return collection;
    }

    async findAll(user: User): Promise<Collection[]> {
        const collections = await this.collectionRepository.find({
            where: { user: { id: user.id } },
            order: { updated_at: 'DESC' },
        });
        await Promise.all(
            collections.map(async (collection) => {
                const content = await this.contentService.findByCollection(collection.id, user, { limit: 5 });
                if (Array.isArray(content))
                    collection.content = content;
            }),
        );

        return collections;
    }

    async findCollectionContent(id: number, user: User, filtersDto: FiltersDto) {
        await this.findOne(id, user);
        return await this.contentService.findByCollection(id, user, filtersDto);
    }

    async update(id: number, updateCollectionDto: UpdateCollectionDto, user: User): Promise<Collection> {
        const collection = await this.findOne(id, user);
        collection.name = updateCollectionDto.name;
        return await this.collectionRepository.save(collection);
    }

    async remove(id: number, user: User): Promise<void> {
        const collection = await this.findOne(id, user);
        await this.collectionRepository.remove(collection);
    }

    async addContent(id: number, user: User, contentId: number): Promise<void> {
        const collection = await this.findOne(id, user, true);
        const content = await this.contentService.findOne(contentId);
        collection.updated_at = new Date();
        collection.content.push(content);
        await this.collectionRepository.save(collection);
    }

    async removeContent(id: number, user: User, contentId: number): Promise<void> {
        const collection = await this.findOne(id, user, true);
        const contentToRemove = collection.content.find((c) => c.id === contentId);
        if (contentToRemove) {
            collection.content = collection.content.filter((c) => c.id !== contentId);
            await this.collectionRepository.save(collection);
        }
    }
}

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';

import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Auth, GetUser } from '@/auth/decorators';
import { ValidRoles } from '@/auth/enums/valid-roles.enum';
import { User } from '@/auth/entities/user.entity';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Auth(ValidRoles.user)
@Controller('collection')
export class CollectionController {
    constructor(private readonly collectionService: CollectionService) {
    }

    @Post()
    create(
        @Body() createCollectionDto: CreateCollectionDto,
        @GetUser() user: User,
    ) {
        return this.collectionService.create(createCollectionDto, user);
    }

    @Get()
    findAll(@GetUser() user: User) {
        return this.collectionService.findAll(user);
    }

    @Get(':id')
    findCollectionContent(
        @Param('id', ParseIntPipe) id: string,
        @GetUser() user: User,
        @Query() paginationDto: PaginationDto,
    ) {
        return this.collectionService.findCollectionContent(+id, user, paginationDto);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: string,
        @Body() updateCollectionDto: UpdateCollectionDto,
        @GetUser() user: User,
    ) {
        return this.collectionService.update(+id, updateCollectionDto, user);
    }

    @Delete(':id')
    remove(
        @Param('id', ParseIntPipe) id: string,
        @GetUser() user: User,
    ) {
        return this.collectionService.remove(+id, user);
    }

    @Post(':id/addContent')
    addContent(
        @Param('id', ParseIntPipe) id: string,
        @Query() addContent: { id },
        @GetUser() user: User,
    ) {
        return this.collectionService.addContent(+id, user, +addContent.id);
    }

    @Delete(':id/removeContent')
    removeContent(
        @Param('id', ParseIntPipe) id: string,
        @Query() removeContent: { id },
        @GetUser() user: User,
    ) {
        return this.collectionService.removeContent(+id, user, +removeContent.id);
    }
}

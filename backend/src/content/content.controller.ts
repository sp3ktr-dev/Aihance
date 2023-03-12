import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';

import { ContentService } from './content.service';
import { CreateContentDto, UpdateContentDto } from './dto/';
import { Auth } from '@/auth/decorators';
import { ValidRoles } from '@/auth/enums/valid-roles.enum';
import { FiltersDto } from '@/common/dto/filters.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Controller('content')
export class ContentController {
    constructor(private readonly contentService: ContentService) {
    }

    @Auth(ValidRoles.admin)
    @Post()
    create(@Body() createCollectionDto: CreateContentDto) {
        return this.contentService.create(createCollectionDto);
    }

    @Auth(ValidRoles.user)
    @Get()
    findAll(@Query() filtersDto: FiltersDto) {
        return this.contentService.findAll(filtersDto);
    }

    @Auth(ValidRoles.user)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: string) {
        return this.contentService.findOne(+id);
    }

    @Auth(ValidRoles.admin)
    @Get('admin/removed')
    findAllRemoved(@Query() paginationDto: PaginationDto) {
        return this.contentService.findAllRemoved(paginationDto);
    }

    @Auth(ValidRoles.admin)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
        return this.contentService.update(+id, updateContentDto);
    }

    @Auth(ValidRoles.admin)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.contentService.softRemove(+id);
    }

    @Auth(ValidRoles.admin)
    @Put(':id')
    restore(@Param('id') id: string) {
        return this.contentService.restore(+id);
    }
}

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Query } from '@nestjs/common';
import { ContentService } from './content.service';
import { UpdateContentDto } from './dto/';
import { Auth } from '@/auth/decorators';
import { ValidRoles } from '@/auth/enums/valid-roles.enum';
import { FiltersDto } from '@/common/dto/filters.dto';

@Controller('content')
export class ContentController {
    constructor(private readonly contentService: ContentService) {
    }

    @Get()
    findAll(@Query() filtersDto: FiltersDto) {
        return this.contentService.findAll(filtersDto);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: string) {
        return this.contentService.findOne(+id);
    }

    @Auth(ValidRoles.admin)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
        return this.contentService.update(+id, updateContentDto);
    }

    @Auth(ValidRoles.admin)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.contentService.remove(+id);
    }
}

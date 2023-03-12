import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';

import { FavouriteService } from './favourite.service';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { Auth, GetUser } from '@/auth/decorators';
import { ValidRoles } from '@/auth/enums/valid-roles.enum';
import { User } from '@/auth/entities/user.entity';
import { FiltersDto } from '@/common/dto/filters.dto';

@Auth(ValidRoles.user)
@Controller('favourite')
export class FavouriteController {
    constructor(private readonly favouriteService: FavouriteService) {
    }

    @Post()
    addToFavourite(
        @Body() createFavouriteDto: CreateFavouriteDto,
        @GetUser() user: User,
    ) {
        return this.favouriteService.create(createFavouriteDto, user);
    }

    @Get()
    findAll(@Query() filtersDto: FiltersDto, @GetUser() user: User) {
        return this.favouriteService.findAll(filtersDto, user);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @GetUser() user: User) {
        return this.favouriteService.findOne(+id, user);
    }

    @Delete(':id')
    removeFromFavourite(@Param('id') id: string, @GetUser() user: User) {
        return this.favouriteService.remove(+id, user);
    }
}

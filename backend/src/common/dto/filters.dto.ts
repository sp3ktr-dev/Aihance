import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from './pagination.dto';
import { ContentProportions } from '@/content/enums/content-proportions.enum';

export class FiltersDto extends PaginationDto {

    @IsEnum(ContentProportions)
    @IsOptional()
    proportion?: ContentProportions;

    @IsString()
    @IsOptional()
    upscales_only?: string;

    @IsString()
    @IsOptional()
    includeWords?: string;

    @IsBoolean()
    @IsOptional()
    includeAllWords?: boolean;

    @IsString()
    @IsOptional()
    excludeWords?: string;
}
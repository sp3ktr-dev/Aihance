import { IsBoolean, IsInt, IsString, MinLength } from 'class-validator';

export class CreateContentDto {

    @IsString()
    @MinLength(3)
    keywords: string;

    @IsInt()
    width: number;

    @IsInt()
    height: number;

    @IsString()
    @MinLength(80)
    url: string;

    @IsBoolean()
    isUpscaled: boolean;

    @IsString()
    @MinLength(30)
    permalink: string;

    @IsString()
    author_id: string;
}

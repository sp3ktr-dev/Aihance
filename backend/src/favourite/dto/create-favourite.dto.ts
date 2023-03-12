import { IsNumber, Min } from 'class-validator';

export class CreateFavouriteDto {
    @IsNumber()
    @Min(1)
    content_id: number;
}

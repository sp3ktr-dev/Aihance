import { IsObject, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { User } from '@/auth/entities/user.entity';

export class CreateCollectionDto {

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @IsObject()
    @IsOptional()
    user?: User;
}

import { User } from '@/auth/entities/user.entity';
import { GetContentDto } from '@/content/dto/get-content.dto';

export class GetCollectionDto {
    id: number;
    name: string;
    user?: User;
    content: GetContentDto[];
}

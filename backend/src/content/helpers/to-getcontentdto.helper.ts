import { Content } from '@/content/entities/content.entity';
import { GetContentDto } from '@/content/dto/get-content.dto';

export const toGetContentDto = (content: Content[]): GetContentDto[] => {
    let getContentDto = content as GetContentDto[];
    getContentDto = getContentDto.map(contentItem => {
        contentItem.favourite = contentItem.favourites.length > 0;
        delete contentItem.favourites;
        return contentItem;
    });
    return getContentDto;
};
import { ContentProportions } from '@/content/enums/content-proportions.enum';
import { Collection } from '@/collection/entities/collection.entity';

export class GetContentDto {
    id?: number;
    keywords?: string;
    preview_small?: string;
    preview_medium?: string;
    image?: string;
    width?: number;
    height?: number;
    proportion?: ContentProportions;
    isUpscaled?: boolean;
    url?: string;
    permalink?: string;
    collections?: Collection[];
    favourites: object[];
    favourite?: boolean;
}

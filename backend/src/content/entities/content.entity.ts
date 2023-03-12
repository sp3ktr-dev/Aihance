import { Column, DeleteDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ContentProportions } from '../enums/content-proportions.enum';
import { Collection } from '@/collection/entities/collection.entity';
import { Favourite } from '@/favourite/entities/favourite.entity';

@Entity({ name: 'content' })
export class Content {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('text', { nullable: false })
    keywords: string;

    @Column('varchar', { length: 42, default: '' })
    preview_small: string;

    @Column('varchar', { length: 42, default: '' })
    preview_medium: string;

    @Column('varchar', { length: 42, default: '' })
    image: string;

    @Column({ nullable: false })
    width: number;

    @Column({ nullable: false })
    height: number;

    @Column({ type: 'enum', enum: ContentProportions })
    proportion: ContentProportions;

    @Column()
    isUpscaled: boolean;

    @Column('varchar', { length: 255, nullable: false })
    url: string;

    @Column('varchar', { length: 70, nullable: false })
    permalink: string;

    @Column('bigint')
    author_id: string;

    @ManyToMany(() => Collection, collection => collection.content)
    collections: Collection[];

    @OneToMany(() => Favourite, favourite => favourite.parentContent)
    favourites: Favourite[];

    @DeleteDateColumn()
    deleted_at: Date;
}
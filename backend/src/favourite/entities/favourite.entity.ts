import { User } from '@/auth/entities/user.entity';
import { Content } from '@/content/entities/content.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'favourites' })
export class Favourite {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Content, content => content.favourites)
    @JoinColumn({ name: 'content_id' })
    parentContent: Content;

    @ManyToOne(() => User, user => user.favourites)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ default: () => 'NOW()' })
    created_at: Date;
}

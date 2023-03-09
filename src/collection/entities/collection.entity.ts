import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@/auth/entities/user.entity';
import { Content } from '@/content/entities/content.entity';

@Entity({ name: 'collections' })
export class Collection {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', { length: 50, nullable: false })
    name: string;

    @Column({ default: () => 'NOW()' })
    updated_at: Date;

    @ManyToOne(() => User, user => user.collections)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToMany(() => Content, content => content.collections)
    @JoinTable()
    content: Content[];
}

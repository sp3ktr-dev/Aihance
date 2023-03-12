import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Collection } from '@/collection/entities/collection.entity';
import { Favourite } from '@/favourite/entities/favourite.entity';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', { unique: true })
    email: string;

    @Column('varchar', { select: false })
    password: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'varchar', length: 255, nullable: true, default: 'user' })
    roles: string;

    @OneToMany(() => Collection, collection => collection.user)
    collections: Collection[];

    @OneToMany(() => Favourite, favourite => favourite.user)
    favourites: Favourite[];

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }

}

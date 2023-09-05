import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Newsletter } from './newsletter.entity';

@Entity({name: 'users'})
export class User {

    @PrimaryGeneratedColumn({
        type: 'int',
    })
    id: number;

    @Column({
        type: 'varchar',
    })
    name: string;

    @Column({
        type: 'varchar',
    })
    first_last_name: string;
    
    @Column({
        type: 'varchar',
    })
    second_last_name: string;
    
    @Column({
        type: 'varchar',
    })
    full_name: string;

    @OneToMany(() => Newsletter, newsletter => newsletter.created_by)
    users: Newsletter[]

}
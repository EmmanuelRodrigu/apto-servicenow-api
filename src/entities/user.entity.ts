import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Newsletter } from './newsletter.entity';
import { AccountUser } from './account-user.entity';
import { Rol } from './rol.entity';

@Entity({name: 'users'})
export class User {

    @PrimaryGeneratedColumn({
        type: 'int',
    })
    id: number;

    @OneToOne(() => AccountUser)
    @JoinColumn()
    accountUser: number;

    @Column()
    accountUserId: number;

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

    @Column({
        type: 'int'
    })
    rolId: number;

    @ManyToOne(() => Rol, (rol) => rol.users)
    rol: Rol

}
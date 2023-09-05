import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({name: 'user_rol'})
export class UserRol {

    @PrimaryGeneratedColumn({
        type: 'int',
    })
    id: number;

    @Column({
        type: 'int',
    })
    rol: number;

    @OneToOne(() => User)
    @Column({
        name:'userId'
    })
    userId: number;
}
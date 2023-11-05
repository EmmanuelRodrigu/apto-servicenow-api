import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRol } from "./user-rol.entity";
import { User } from "./user.entity";

@Entity({name: "rol"})
export class Rol {

    @PrimaryGeneratedColumn({
        type: 'int',
    })
    id: number;

    @Column({
        type: 'varchar',
    })
    rol_name: string;

    @OneToMany(() => User, (user) => user.rol)
    users: User[]
}
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Rol } from "./rol.entity";

@Entity({ name: 'modules_permissions' })
export class ModulePermissions {

    @PrimaryGeneratedColumn({
        type: 'int'
    })
    id: number;

    @OneToOne((type) => Rol, (rol) => rol.id)
    @JoinColumn()
    rol: number;

    @Column({
        type: 'tinyint',
    })
    dashboard: boolean;

    @Column({
        type: 'tinyint',
    })
    news: boolean;

    @Column({
        type: 'tinyint',
    })
    clients: boolean;

    @Column({
        type: 'tinyint',
    })
    projects: boolean;

    @Column({
        type: 'tinyint',
    })
    requests: boolean;

    @Column({
        type: 'tinyint',
    })
    users: boolean;

    @Column({
        type: 'tinyint',
    })
    payments: boolean;

}
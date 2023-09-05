import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "type_project"})
export class TypeProject{

    @PrimaryGeneratedColumn({
        type: 'int',
    })
    id: number;

    @Column({
        type: 'varchar',
    })
    type: string;

    @Column({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at: Date;

}
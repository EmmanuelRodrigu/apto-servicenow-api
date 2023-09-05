import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({name: "type_request"})
export class TypeRequest {

    @PrimaryGeneratedColumn({
        type: 'int',
    })
    id: number;

    @Column({
        type: 'varchar',
    })
    type: string;

    @Column({
        type: 'varchar',
    })
    description: string;

}
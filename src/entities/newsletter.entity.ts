import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({name: "newsletters"})
export class Newsletter {

    @PrimaryGeneratedColumn({
        type: 'int',
    })
    id: number;

    @Column({
        type: 'varchar',
        name: 'title'
    })
    title: string;

    @Column({
        type: 'varchar',
        name: 'description'
    })
    description: string;

    @Column({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at: Date;

    @Column({
        type: 'varchar',
        name: 'url'
    })
    url: string;

    @Column({
        type: 'tinyint',
        name: 'isView',
        default: false,
    })
    isView: boolean;

}
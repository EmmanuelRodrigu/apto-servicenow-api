import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./client.entity";

@Entity({ name: "weekly" })
export class Weekly {

    @PrimaryGeneratedColumn({
        type: 'int'
    })
    id: number;

    @Column({
        type: 'varchar',
        name: 'title',
    })
    title: string;

    @Column({
        type: 'varchar',
        name: 'description',
        nullable: true,
    })
    description: string;

    @Column({
        type: 'varchar',
        name: 'urlFile'
    })
    urlFile: string;

    @Column({
        type: 'int',
        name: 'clientId',
    })
    clientId: number;

    @ManyToOne((type) => Client, (client) => client.weekly)
    client: Client;

}
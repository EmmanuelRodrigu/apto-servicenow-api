import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Client } from "./client.entity";

@Entity({name: "contacts"})
export class Contacts {

    @PrimaryGeneratedColumn({
        type: 'int'
    })
    id: number;

    @Column({
        type: 'varchar'
    }) 
    name: string;

    @Column({
        type: 'varchar',
    })
    last_name: string;

    @Column({
        type: 'varchar',
        unique: true,
    })
    email: string;

    @Column({
        type: 'varchar',
    })
    phone: string;

    @Column({
        type: 'varchar',
    })
    area: string;

    @Column({
        type: 'tinyint',
    })
    is_major_contact: boolean;

    @Column({
        type: 'int',
    })
    clientId: number

    @ManyToOne((clientId) => Client, (client) => client.contact )
    client: Client[];

}
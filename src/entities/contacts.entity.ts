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
    })
    email: string;

    @Column({
        type: 'varchar',
    })
    phone: string;

    @ManyToOne((contact) => Client, (client) => client.contact)
    @JoinColumn({
        name: 'clientId',
    })
    clientId: Client;

    @Column({
        type: 'tinyint',
    })
    is_major_contact: boolean;

}
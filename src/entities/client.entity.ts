import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Contacts } from "./contacts.entity";
import { Project } from "./project.entity";
import { AccountClient } from "./account-client.entity";
import { SupportRequest } from "./support-request.entity";
import { Weekly } from "./weekly.entity";

@Entity({name: "client"})
export class Client {

    @PrimaryGeneratedColumn({
        type: 'int',
    })
    id: number;

    @Column({
        type: 'varchar',
    })
    person: string;

    @Column({
        type: 'varchar',
        unique: true,
    })
    rfc: string;

    @Column({
        type: 'varchar',
    })
    name: string;
    
    @Column({
        type: 'varchar',
    })
    reason_social: string;
    
    @Column({
        type: 'varchar',
    })
    street: string;

    @Column({
        type: 'varchar',
    })
    cp: string;

    @Column({
        type: 'varchar',
    })
    municipality: string;
    
    @Column({
        type: 'varchar',
    })
    estate: string;

    @Column({
        type: 'int',
    })
    dataTaxId: number;

    @OneToMany((type) => Contacts, (contact) => contact.client)
    contact: Contacts;
    
    @OneToMany((type) => Project, (project) => project.client)
    project: Project;

    @OneToOne(() => AccountClient)
    @Column({
        type: 'int',
        nullable: true,
    })
    accountClientId: number;

    @OneToMany((type) => Weekly, (weekly) => weekly.client)
    weekly: Weekly[];

}
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Contacts } from './contacts.entity';

@Entity({name: "client"})
export class Client {

    @PrimaryGeneratedColumn({
        type: 'int',
    })
    id: number;

    @Column({
        type: 'varchar',
    })
    rfc: string;
    
    @Column({
        type: 'varchar',
    })
    reason_social: string;
    
    @Column({
        type: 'varchar',
    })
    address: string;
    
    @OneToMany((client) => Contacts, (contact) => contact.id )
    contact: Contacts[];

}
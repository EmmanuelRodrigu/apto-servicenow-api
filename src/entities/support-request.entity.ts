import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TypeRequest } from "./type-request.entity";
import { Client } from "./client.entity";

@Entity({name: 'support_request'})
export class SupportRequest {

    @PrimaryGeneratedColumn({
        type: 'int',
    })
    id: number;

    @OneToOne(() => TypeRequest)
    @JoinColumn()
    type_request: TypeRequest;

    @OneToOne(() => Client)
    @JoinColumn()
    client: Client;

    @Column({
        type: 'varchar',
    })
    title: string;

    @Column({
        type: 'varchar',
    })
    short_description: string;
    
    @Column({
        type: 'varchar',
    })
    long_description: string;
    
    @Column({
        type: 'varchar',
    })
    url: string;
    
    @Column({
        type: 'varchar',
    })
    assing_to: string;

    @Column({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at: string;

    @Column({
        type: 'varchar',
    })
    status: string;

}
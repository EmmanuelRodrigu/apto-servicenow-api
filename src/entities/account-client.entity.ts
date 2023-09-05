import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./client.entity";

@Entity({name: 'account_client'})
export class AccountClient {

    @PrimaryGeneratedColumn({
        type: 'int',
    })
    id: number;

    @OneToOne(() => Client)
    @JoinColumn()
    client: Client;

    @Column({
        type: 'varchar',
        unique: true,
    })
    email: string;

    @Column({
        type: 'varchar',
    })
    password: string;

    @Column({
        type: 'varchar',
    })
    phone: string;

    @Column({
        type: 'tinyint',
    })
    isActive: boolean;

    @Column({
        type: 'tinyint',
    })
    emailVerified: boolean;

    @Column({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at: Date;
    
    @Column({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;

}
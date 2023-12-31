import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { CommetsRequest } from "./commets-request.entity";

@Entity({name: "account_user"})
export class AccountUser {

    @PrimaryGeneratedColumn({
        type: 'int'
    })
    id: number;

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
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at: Date;

    @Column({
        type: 'tinyint',
        default: false,
    })
    isActive: boolean;

    @Column({
        type: 'tinyint',
        default: false,
    })
    emailVerified: boolean;
    
    @Column({
        type: 'tinyint',
        default: false,
    })
    googleAuth: boolean;

    @OneToMany((type) => CommetsRequest, (request) => request.comment )
    comment: CommetsRequest[];

}
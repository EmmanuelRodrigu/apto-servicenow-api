import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity({name: "newsletters"})
export class Newsletter {

    @PrimaryGeneratedColumn({
        type: 'int',
    })
    id: number;

    @ManyToOne(() => User, user => user.users)
    created_by: User;
    
    @ManyToOne(() => User, user => user.users)
    updated_by: User;

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
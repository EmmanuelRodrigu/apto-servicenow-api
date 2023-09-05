import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Project } from "./project.entity";

@Entity({name: "payments"})
export class Payment {

    @PrimaryGeneratedColumn({
        type: 'int'
    })
    id: number;

    @OneToOne(() => Project)
    project: Project;

    @Column({
        type: 'varchar',
    })
    invoices: string;
    
    @Column({
        type: 'int',
    })
    amount: number;
    
    @Column({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at: Date;
    
    @Column({
        type: 'int',
    })
    amount_paid: number;
    
    @Column({
        type: 'int',
    })
    amount_payable: number;

}
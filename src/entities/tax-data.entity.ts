import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity({name: 'tax_data'})
export class TaxData {

    @PrimaryGeneratedColumn({
        type: 'int',
    })
    id: number;

    @Column({
        type: 'varchar',
    })
    name_tax_data: string;

}
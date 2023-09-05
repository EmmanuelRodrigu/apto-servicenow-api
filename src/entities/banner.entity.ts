import { Entity, OneToOne, PrimaryGeneratedColumn, Column } from "typeorm";
import { Newsletter } from "./newsletter.entity";

@Entity({name: 'banners'})
export class Banner {

    @PrimaryGeneratedColumn({
        type: 'int',
    })
    id: number;

    @OneToOne(() => Newsletter)
    newsletter: Newsletter;

    @Column({
        type: 'varchar',
    })
    url: string;
    
    @Column({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
    })
    start_at: string;
    
    @Column({
        type: 'tinyint',
    })
    status: boolean;

}
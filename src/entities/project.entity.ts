import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { TypeProject } from "./type-project.entity";

@Entity({name: "projects"})
export class Project {

    @PrimaryGeneratedColumn({
        type: 'int',
    })
    id: string;

    @OneToOne(() => TypeProject)
    @JoinColumn()
    project: TypeProject;

    @Column({
        type: 'varchar',
    })
    name: string;

    @Column({
        type: 'varchar',
    })
    description: string;

    @Column({
        type: 'int',
        default: 0,
    })
    no_request_support: number;

}
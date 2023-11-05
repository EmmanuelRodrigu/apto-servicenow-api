import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./client.entity";
import { SupportRequest } from "./support-request.entity";

enum TypeProject {
    software = "software",
    service_desk = "service_desk",
    business = "business",
}

@Entity({name: "projects"})
export class Project {

    @PrimaryGeneratedColumn({
        type: 'int',
    })
    id: number;

    @Column({
        type: 'int',
        name: 'id_jira',
    })
    id_jira: number;

    @Column({
        type: 'varchar',
        name: 'key',
    })
    key: string;

    @Column({
        type: 'enum',
        enum: TypeProject,
        default: TypeProject.software,
    })
    type_project: TypeProject;

    @Column({
        type: 'varchar',
    })
    name: string;

    @Column({
        type: 'varchar',
        nullable: true,
    })
    description: string;

    @Column({
        type: 'varchar',
        name: 'avatar_url',
    })
    avatar_url: string;

    @Column({
        type: 'int',
        nullable: true
    })
    clientId: number;

    @ManyToOne((type) => Client, (client) => client.project )
    client: Client[];

    @Column({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at: Date;

    @OneToMany((type) => SupportRequest, (request) => request.project)
    request: SupportRequest;

}
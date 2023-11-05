import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./project.entity";
import { CommetsRequest } from "./commets-request.entity";
import { AccountUsersJira } from "./account-user-jira.entity";

// export enum Statuses {
//     BACKLOG = 'Backlog',
//     TODO = 'todo',
//     INPROGRESS = 'INPROGRESS',
//     PULLREQUEST = 'PULLREQUEST',
//     TEST = 'TEST',
//     DONE = 'DONE',
// };

export enum TypeRequest {
    FUNCTIONALITY = 'FUNCTIONALITY',
    SUPPORTREQUEST = 'SUPPORTREQUEST',
    BUG = 'BUG',
}
@Entity({name: 'support_request'})
export class SupportRequest {
    
    @PrimaryGeneratedColumn({
        type: 'int',
    })
    id: number;

    @Column({
        type: 'int',
        name: 'id_jira',
        nullable: true,
    })
    id_jira: number;

    @Column({
        type: 'varchar',
        nullable: true
    })
    key: string;

    @Column({
        type: 'varchar',
        nullable: true,
    })
    status: string;

    @Column({
        type: 'enum',
        enum: TypeRequest,
        default: null,
    })
    type_request: TypeRequest;

    @Column({
        type: 'int'
    })
    projectId: number;

    @Column({
        type: 'varchar',
    })
    summary: string;
    
    @Column({
        type: 'varchar',
    })
    description: string;

    @Column({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at: Date;
    
    @Column({
        type: 'int',
    })
    reporterId: number;
    
    @Column({
        type: 'int',
        nullable: true,
    })
    assigneeId: number;
a
    @ManyToOne((type) => Project, (project) => project.request)
    project: Project[];

    @OneToMany((type) => CommetsRequest, (comment) => comment.request)
    comment: CommetsRequest[];

    // @OneToMany((type) => Assignee, (assignee) => assignee.request)
    // assignee: Assignee[];
    
    // @OneToMany((type) => Reporters, (reporter) => reporter.request)
    // reporter: Reporters[];

    @ManyToOne((type) => AccountUsersJira, (account) => account.requestReporter)
    reporter: AccountUsersJira[];
    
    @ManyToOne((type) => AccountUsersJira, (account) => account.requestAssignee)
    assignee: AccountUsersJira[];

}
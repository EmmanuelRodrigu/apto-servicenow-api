import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SupportRequest } from "./support-request.entity";
import { CommetsRequest } from "./commets-request.entity";


@Entity({ name: "account_users_jira" })
export class AccountUsersJira {

    @PrimaryGeneratedColumn({
        type: 'int'
    })
    id: number;

    @Column({
        type: 'varchar',
    })
    displayName: string;

    @Column({
        type: 'varchar',
    })
    accountId: string;

    @Column({
        type: 'varchar',
    })
    avatarUrl: string;

    // @OneToMany((type) => Assignee, (assignee) => assignee.account)
    // assigne: Assignee[];
    
    @OneToMany((type) => CommetsRequest, (comment) => comment.account)
    comment: CommetsRequest[];
    
    @OneToMany((type) => SupportRequest, (request) => request.reporter)
    requestReporter: SupportRequest[];
    
    @OneToMany((type) => SupportRequest, (request) => request.assignee)
    requestAssignee: SupportRequest[];

}
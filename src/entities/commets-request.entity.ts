import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SupportRequest } from "./support-request.entity";
import { AccountUsersJira } from "./account-user-jira.entity";


@Entity({ name: 'comments' })
export class CommetsRequest {

    @PrimaryGeneratedColumn({
        type: 'int'
    })
    id: number;

    @Column({
        type: 'varchar',
        name: 'comment',
    })
    comment: string;

    @Column({
        type: 'int',
        name: 'requestId'
    })
    requestId: number;

    @Column({
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP'
    })
    created_at: Date;

    @ManyToOne((type) => SupportRequest, (request) => request.comment )
    request: SupportRequest;

    @ManyToOne((type) => AccountUsersJira, (account) => account.comment )
    account: AccountUsersJira;


}
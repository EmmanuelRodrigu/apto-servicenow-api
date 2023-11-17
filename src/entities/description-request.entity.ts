import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SupportRequest } from "./support-request.entity";

@Entity({name: 'description_request'})
export class DescriptionRequest {

    @PrimaryGeneratedColumn({
        type: 'int'
    })
    id: number;

    @Column({
        type: 'int',
        name: 'deph',
    })
    depth: number;

    @Column({
        type: 'varchar',
        name: 'key'
    })
    key: string;

    @Column({
        type: 'varchar',
        name: 'text',
    })
    text: string;

    @Column({
        type: 'varchar',
        name: 'type'
    })
    type: string;

    @ManyToOne((type) => SupportRequest, (request) => request.description)
    request: SupportRequest

    @Column({
        type: 'int',
        name: 'requestId'
    })
    requestId: number;

}
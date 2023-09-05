import { IsOptional } from 'class-validator'

export class FilterUsers {

    @IsOptional()
    readonly search: string;

    @IsOptional()
    readonly date: [date_start: string, date_end: string];

    @IsOptional()
    readonly rol: string;

}
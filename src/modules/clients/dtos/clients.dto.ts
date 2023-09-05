import { IsOptional } from "class-validator";


export class ClientDto {

    @IsOptional()
    search: string;

    @IsOptional()
    date: {date_start: string, date_end: string};
}
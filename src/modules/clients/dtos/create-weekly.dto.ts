import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";


export class CreateWeeklyDto {

    @ApiProperty()
    @IsNotEmpty({
        message: 'El campo titulo es requerido',
    })
    title: string;

    @ApiProperty()
    @IsOptional()
    description: string;

}
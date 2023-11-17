import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsEnum } from "class-validator";

export class UpdateRequestDto {

    @ApiProperty()
    @IsNotEmpty({
        message: 'El campo titulo es requerido'
    })
    summary: string;

    @ApiProperty()
    @IsNotEmpty({
        message: 'El campo responsable es requerido'
    })
    reporter: string;

    @ApiProperty()
    @IsOptional()
    assignee: string;

}
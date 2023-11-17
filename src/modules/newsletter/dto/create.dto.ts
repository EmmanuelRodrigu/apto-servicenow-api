import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class CreateNewsletterDto {

    @ApiProperty()
    @IsNotEmpty({
        message: 'El titulo es requerido'
    })
    title: string;

    @ApiProperty()
    @IsNotEmpty({
        message: 'La descripcion es requerido'
    })
    description: string;

}
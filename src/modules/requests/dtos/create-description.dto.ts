import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class CreateDescriptionDto {

    @ApiProperty()
    @IsNotEmpty({
        message: 'El key es requerido',
    })
    depth: string;

    @ApiProperty()
    @IsNotEmpty({
        message: 'El key es requerido',
    })
    key: string;

    @ApiProperty()
    @IsNotEmpty({
        message: 'El key es requerido',
    })
    text: string;

    @ApiProperty()
    @IsNotEmpty({
        message: 'El key es requerido',
    })
    type: string;

}
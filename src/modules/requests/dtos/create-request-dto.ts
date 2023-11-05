import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEnum } from "class-validator";
import { TypeRequest } from 'src/entities/support-request.entity';

export class CreateRequestDto {

    @ApiProperty()
    @IsNotEmpty({
        message: 'El campo titulo es requerido',
    })
    summary: string;

    @ApiProperty()
    @IsNotEmpty({
        message: 'El campo descripcion es requerido',
    })
    description: string;

    @IsEnum(TypeRequest, {
        message: 'El campo debe ser uno de los siguientes: $constraint1'
    })
    @ApiProperty()
    @IsNotEmpty({
        message: 'El campo tipo de solicitud es requerido',
    })
    type_request: TypeRequest;

    @ApiProperty()
    @IsNotEmpty({
        message: 'El campo asignar es requerido',
    })
    reporter: string;

}
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEnum, IsEmail } from "class-validator";
import { TypeRequest } from 'src/entities/support-request.entity';
import { CreateDescriptionDto } from "./create-description.dto";

export class CreateRequestDto {

    @ApiProperty()
    @IsNotEmpty({
        message: 'El campo titulo es requerido',
    })
    summary: string;

    // @ApiProperty()
    // @IsNotEmpty({
    //     message: 'El campo descripcion es requerido',
    // })
    // description: string;

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

    @ApiProperty()
    @IsNotEmpty({
        message: 'El campo correo de responsable es requerido'
    })
    @IsEmail()
    email: string;

    @IsNotEmpty({
        message: 'La descripcion es requerida'
    })
    description: CreateDescriptionDto[]

}
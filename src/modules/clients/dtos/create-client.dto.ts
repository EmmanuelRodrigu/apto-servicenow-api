import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class CreateClientDto {

    @ApiProperty()
    @IsNotEmpty({
        message: "El campo rfc es requerido",
    })
    rfc: string;

    @ApiProperty()
    @IsNotEmpty({
        message: "El campo rason social es requerido",
    })
    reason_social: string;

    @ApiProperty()
    @IsNotEmpty({
        message: "El campo direccion es requerido",
    })
    address: string;

    @ApiProperty()
    @IsNotEmpty({
        message: "El campo contacto principal es requerido",
    })
    major_contact_id: number;

}
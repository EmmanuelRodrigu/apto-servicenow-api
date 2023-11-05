import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class SecondaryContact {

    @ApiProperty()
    @IsNotEmpty({
        message: 'El campo nombre de contacto secundario es requerido'
    })
    name_scontact: string;
    
    @ApiProperty()
    @IsNotEmpty({
        message: 'El campo apellido de contacto secundario es requerido'
    })
    last_name_scontact: string;
    
    @ApiProperty()
    @IsNotEmpty({
        message: 'El campo correo de contacto secundario es requerido'
    })
    email_scontact: string;
    
    @ApiProperty()
    @IsNotEmpty({
        message: 'El campo telefono de contacto secundario es requerido'
    })
    phone_scontact: string;
    
    @ApiProperty()
    @IsOptional()
    area_scontact: string;

}
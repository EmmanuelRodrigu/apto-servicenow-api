import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { SecondaryContact } from "./secondary-contact.dto";

export class UpdateClientDto {

    @ApiProperty()
    @IsOptional()
    person: 'fisica' | 'moral';

    @ApiProperty()
    @IsNotEmpty({
        message: "El campo rfc es requerido",
    })
    tax_data: number;
    
    @ApiProperty()
    @IsNotEmpty({
        message: "El campo rfc es requerido",
    })
    rfc: string;
    
    @ApiProperty()
    @IsNotEmpty({
        message: "El campo rfc es requerido",
    })
    bussiness_name: string;

    @ApiProperty()
    @IsNotEmpty({
        message: "El campo rason social es requerido",
    })
    reason_social: string;

    @ApiProperty()
    @IsNotEmpty({
        message: "El campo domicilio es requerido",
    })
    street: string;
    
    @ApiProperty()
    @IsNotEmpty({
        message: "El campo codigo postal es requerido",
    })
    cp: string;
    
    @ApiProperty()
    @IsNotEmpty({
        message: "El campo municipio es requerido",
    })
    municipality: string;
    
    @ApiProperty()
    @IsNotEmpty({
        message: "El campo estado es requerido",
    })
    estate: string;

    @ApiProperty()
    @IsNotEmpty({
        message: 'El campo nombre de contacto principal es requerido'
    })
    name_contact: string;
    
    @ApiProperty()
    @IsNotEmpty({
        message: 'El campo apellido de contacto principal es requerido'
    })
    last_name_contact: string;
    
    @ApiProperty()
    @IsNotEmpty({
        message: 'El campo correo de contacto principal es requerido'
    })
    email_contact: string;
    
    @ApiProperty()
    @IsNotEmpty({
        message: 'El campo telefono de contacto principal es requerido'
    })
    phone_contact: string;
    
    @ApiProperty()
    @IsOptional()
    area_contact: string;
    
    @IsOptional()
    secondary_contact: SecondaryContact;

}
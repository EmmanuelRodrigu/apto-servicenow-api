import { ApiProperty } from "@nestjs/swagger";
import { IsEAN, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, MinLength } from "class-validator";


export class CreateAccountDto {

    @ApiProperty()
    @IsNotEmpty({
        message: 'El email es requerido'
    })
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty({
        message: 'La constraseña es requerida',
    })
    @MinLength(8, {})
    password: string;

    @ApiProperty()
    @IsOptional()
    phone: string;

}
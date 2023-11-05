import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";


export class UpdateUserDto {

    @ApiProperty()
    @IsNotEmpty({
        message: 'El campo nombre es requerido',
    })
    name: string;

    @ApiProperty()
    @IsNotEmpty({
        message: 'El campo primer apellido es requerido',
    })
    first_last_name: string;

    @ApiProperty()
    @IsNotEmpty({
        message: 'El campo segundo apellido es requerido',
    })
    second_last_name: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty({
        message: 'El campo email es requerido',
    })
    email: string;

    @ApiProperty()
    @IsNotEmpty({
        message: 'El campo contraseña es requerido',
    })
    password: string;

    @ApiProperty()
    @IsNotEmpty({
        message: 'El campo rol es requerido',
    })
    rol: number;

}
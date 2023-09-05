import { Type } from "class-transformer";
import { IsNotEmpty, IsEmail, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({
        message: 'El campo nombre es requerido',
    })
    readonly name: string;
    
    @IsNotEmpty({
        message: 'El campo primer apellido es requerido',
    })
    readonly first_last_name: string;
    
    @IsNotEmpty({
        message: 'El campo segundo apellido es requerido',
    })
    readonly second_last_name: string;
    
    @IsNotEmpty({
        message: 'El campo rol es requerido',
    })
    readonly rol: string;

    @IsNotEmpty({
        message: 'El campo correo electronico es requerido',
    })
    @IsEmail({}, {
        message: 'El campo correo electronico debe ser un correo electronico valido',
    })
    readonly email: string;

    @IsNotEmpty({
        message: 'El campo password es requerido',
    })
    @MinLength(8, {
        message: 'El campo password debe ser minimo de 8 caracteres',
    })
    readonly password: string;

}
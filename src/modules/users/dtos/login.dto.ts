import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {

    @IsNotEmpty({
        message: 'El campo correo electronico es requerido',
    })
    @IsEmail({}, {
        message: 'El campo correo electronico debe ser un correo electronico valido',
    })
    readonly email: string;

    @IsNotEmpty({
        message: 'El campo contraseña es requerido',
    })
    readonly password: string;

}
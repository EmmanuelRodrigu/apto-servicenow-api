import { IsEmail, IsNotEmpty } from "class-validator";


export class LoginDto {
    @IsNotEmpty({
        message: 'El campo correo electronico es requerido',
    })
    @IsEmail()
    readonly email: string;

    @IsNotEmpty({
        message: 'El campo password es requerido',
    })
    readonly password: string;
}
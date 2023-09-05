import { IsEmail, IsNotEmpty } from "class-validator";


export class LoginWithGoogleDto {
    @IsNotEmpty({
        message: 'El campo correo electronico es requerido'
    })
    @IsEmail()
    readonly email: string;

}
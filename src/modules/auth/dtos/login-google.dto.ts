import { IsEmail, IsNotEmpty } from "class-validator";


export class LoginWithGoogleDto {
    @IsNotEmpty({
        message: 'El campo correo electronico es requerido'
    })
    @IsEmail()
    email: string;

    @IsNotEmpty({
        message: 'El campo nombre es requerido'
    })
    fullName: string;

}
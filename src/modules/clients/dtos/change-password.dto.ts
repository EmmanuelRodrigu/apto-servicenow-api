import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class ChangePasswordDto {

    @ApiProperty()
    @IsNotEmpty({
        message: 'El email es requerido'
    })
    email: string;
    
    @ApiProperty()
    @IsNotEmpty({
        message: 'El password es requerido',
    })
    password: string;

    @ApiProperty()
    @IsNotEmpty({
        message: 'Confirmar password es requerido'
    })
    confirmPassword: string;

}
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, MinLength } from "class-validator";


export class UpdateProjectDto {

    @ApiProperty()
    @IsNotEmpty({
        message: 'El nombre de projecto es requerido'
    })
    name: string;
    
    @ApiProperty()
    @IsNotEmpty({
        message: 'El cliente es requerido'
    })
    rfc_client: number;
    
    @ApiProperty()
    @IsOptional()
    description: string;
    
    @ApiProperty()
    @MinLength(1, {
        message: 'El cliente debe contener al menos 1 elemento'
    })
    type_project: [];


}
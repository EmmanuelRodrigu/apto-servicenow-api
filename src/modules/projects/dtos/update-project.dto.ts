import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, MinLength } from "class-validator";


export class UpdateProjectDto {

    @ApiProperty()
    @IsNotEmpty({
        message: 'El nombre de projecto es requerido'
    })
    name: string;
    
    @ApiProperty()
    @IsOptional()
    rfc_client: string;
    
    @ApiProperty()
    @IsOptional()
    description: string;

}
import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsNotEmpty } from "class-validator";


export class CreateProjectDto {

    @ApiProperty()
    @IsNotEmpty({
        message: "El nombre de proyecto es requerido",
    })
    readonly name: string;

    @ApiProperty()
    @IsNotEmpty({
        message: "La descripcion es requerida",
    })
    readonly description: string;

    @ApiProperty()
    @IsArray({
        message: 'El campo tipo de proyecto es un objeto'
    })
    @ArrayMinSize(1, {
        message: 'El campo tipo de proyecto debe contener al menos 1 elemento'
    })
    @IsNotEmpty({
        message: "El tipo de proyecto es requerido",
    })
    typeProject: [];

    @ApiProperty()
    @IsNotEmpty({
        message: 'El campo cliente es requerido'
    })
    clientId: number;

}
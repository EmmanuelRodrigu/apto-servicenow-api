import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class AcceptRequest {

    @ApiProperty()
    @IsNotEmpty({
        message: 'El id de proyecto es requerido',
    })
    projectId: string;

    @ApiProperty()
    @IsNotEmpty({
        message: 'El titulo es requerido',
    })
    summary: string;

    @ApiProperty()
    @IsNotEmpty({
        message: 'El campo descripcion es requerido',
    })
    description: string;

    @ApiProperty()
    @IsNotEmpty({
        message: 'Se require asignar un usuario',
    })
    assigneeId: string;

}
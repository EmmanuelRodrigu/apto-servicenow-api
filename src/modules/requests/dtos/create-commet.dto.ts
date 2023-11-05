import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";


export class CreateCommentDto {

    @ApiProperty()
    @IsNotEmpty({
        message: 'El comentario es requerido',
    })
    comment: string;

    @ApiProperty()
    @IsNotEmpty({
        message: 'El id de solicitud es requerido',
    })
    requestId: number


}
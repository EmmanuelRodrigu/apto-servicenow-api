import { HttpException } from '@nestjs/common';


export function error(msg: string, status: number) {
    return new HttpException(msg, status)
}
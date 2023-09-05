import { HttpException } from '@nestjs/common';


function error(msg: string, status: number) {
    return new HttpException(msg, status)
}

export {error}
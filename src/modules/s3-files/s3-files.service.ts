import { Injectable, Req, Res, BadRequestException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as mime from 'mime-types';
import * as sharp from 'sharp';

@Injectable()
export class S3FilesService {
    bucket = process.env.BUCKET;
    location = process.env.REGION;
    s3 = new AWS.S3({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET,
    });

    async s3_upload(
        fileContent: Buffer,
        bucket: string,
        name: string,
        mimetype: string,
    ) {
        const contentType = 'application/octet-stream';
        let bufferInfo = fileContent;
        const params = {
            Bucket: bucket,
            Key: name,
            Body: bufferInfo,
            ContentType: contentType,
        };
        try {
            let s3Response = await this.s3.upload(params).promise();
            return s3Response;
        } catch(error) {
            throw new BadRequestException(error);
        };
    };

    async uploadFile(file: Express.Multer.File) {
        const { originalname } = file;

        return await this.s3_upload(
            file.buffer,
            this.bucket,
            originalname,
            file.mimetype,
        );
    };


}

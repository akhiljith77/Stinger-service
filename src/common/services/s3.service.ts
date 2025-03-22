import { ObjectCannedACL, PutObjectAclCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import sharp from "sharp";

@Injectable()
export class S3Service {
    private s3Client: S3Client;

    constructor(private configService: ConfigService) {
        this.s3Client = new S3Client({
            region: this.configService.get<string>('AWS_REGION'),
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
            },
        });
    }

    async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
        
        let buffer = file.buffer;
        if (file.size > 1 * 1024 * 1024) {
            buffer = await sharp(file.buffer).resize({
                width: 1200,
                height: 1200,
                fit: 'inside',
                withoutEnlargement: true
            }).jpeg({ quality: 85 })
                .toBuffer();
        }

        const params = {
            Bucket: this.configService.get<string>('AWS_S3_BUCKET_NAME'),
            Key: key,
            Body: buffer,
            ContentType: file.mimetype,
            // ACL: ObjectCannedACL.public_read,
        };
 

        await this.s3Client.send(new PutObjectCommand(params));
        
        return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }
}
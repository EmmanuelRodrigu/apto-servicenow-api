import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(
        private mailerService: MailerService
    ) {}

    async sendForgotPassword(email: string, name: string) {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Recuperar contraseña',
            template: './forgot-password',
            context: {
                name: name,
                url: 'https://Example.com'
            }
        });
    };

    async sendCreateIssue(email: string, type_request: string, reporter: string, description: string) {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Nueva solicitud creada',
            template: './create-issue',
            context: {
                type_request: type_request,
                reporter: reporter,
                description: description,
            },
        });
    };
}

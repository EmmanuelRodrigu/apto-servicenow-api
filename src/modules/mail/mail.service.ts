import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(
        private mailerService: MailerService
    ) {}

    async sendForgotPassword(email: string) {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Forgot Password',
            template: './forgot-password',
            context: {
                name: 'Emmanuel',
                url: 'https://Example.com'
            },
        });
    };

    async sendCreateIssue(email: string, type_request: string, reporter: string) {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Forgot Password',
            template: './create-issue',
            context: {
                type_request: type_request,
                reporter: reporter,
                url: 'https://example.com'
            },
        });
    };
}

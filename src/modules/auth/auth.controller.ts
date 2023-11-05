import { Body, Controller, Post, HttpCode, HttpStatus, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { ApiTags } from '@nestjs/swagger/dist';
import { LoginWithGoogleDto } from './dtos/login-google.dto';
import { JwtAuthGuard } from './jwt-auth-guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @ApiTags('login')
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() credentials: LoginDto) {
        const signin = await this.authService.signIn(credentials);
        return signin;
    }

    @ApiTags('google-auth')
    @HttpCode(HttpStatus.OK)
    @Post('google')
    signInWithGoogle(@Body() Credential: LoginWithGoogleDto) {
        return this.authService.signInWithGoogle(Credential);
    }

    @ApiTags('logout')
    @Post('logout')
    logOut(@Body() email: string) {
        return this.authService.logOut(email);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getAuth(@Request() req) {
        const { user } = req;
        const findUser = await this.authService.authMe(user);
        return findUser;
    }

} 


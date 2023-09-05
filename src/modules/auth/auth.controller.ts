import { Body, Controller, Post, HttpCode, HttpStatus, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { ApiTags } from '@nestjs/swagger/dist';
import { LoginWithGoogleDto } from './dtos/login-google.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @ApiTags('login')
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() credentials: LoginDto) {
        return this.authService.signIn(credentials);
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

    @Get('me')
    async getAuth(@Request() user) {
        
    }

} 


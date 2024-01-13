import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private userService: UserService,
        private authService: AuthService
    ) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        try {
            return this.authService.authenticate(loginDto.email, loginDto.password);
        } catch (err) {
            throw new BadRequestException();
        }
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        try {
            return this.userService.create(createUserDto);
        } catch (err) {
            throw new BadRequestException();
        }
    }
}

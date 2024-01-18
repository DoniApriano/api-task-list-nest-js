import { ConflictException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

    constructor(private prismaService: PrismaService) { }

    async create(createUserDto: CreateUserDto) {
        const checkEmail = await this.findOne(createUserDto);
        if (checkEmail) {
            throw new ConflictException("email diplicate");
        }
        if (createUserDto.password) {
            createUserDto.password = await bcrypt.hash(createUserDto.password, 12);
        }

        const userData = await this.prismaService.user.create({ data: createUserDto });
        const { password, ...result } = userData;
        return result;
    }

    async findOne(user: { id?: string, email: string }) {
        const userData = await this.prismaService.user.findFirst({
            where: {
                id: user.id ? { equals: user.id } : undefined,
                email: { equals: user.email },
            }
        });
        if (!userData) {
            return null;
        }
        return userData;
    }


    async validateUser(email: string, passwordInput: string) {
        const userData = await this.findOne({ email });
        if (!userData) {
            throw new NotFoundException(
                {
                    error: {
                        message: `Email ${email} is not found`,
                        statusCode: HttpStatus.NOT_FOUND
                    }
                }
            );
        }

        const isMatch = await bcrypt.compare(passwordInput, userData.password);
        if (!isMatch) {
            throw new UnauthorizedException(
                {
                    error: {
                        message: `Email ${email} and Password is not match`,
                        statusCode: HttpStatus.UNAUTHORIZED
                    }
                }
            );
        }

        const { password, ...result } = userData;
        return result;
    }
}

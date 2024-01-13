import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

    constructor(private prismaService: PrismaService) { }

    async create(createUserDto: CreateUserDto) {
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
            throw new UserNotFoundException();
        }

        const isMatch = await bcrypt.compare(passwordInput, userData.password);
        if (!isMatch) {
            throw new AuthenticationFailedException();
        }

        const { password, ...result } = userData;
        return result;
    }
}

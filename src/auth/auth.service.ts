import { Injectable } from '@nestjs/common';
import { UserService } from './user/user.service';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private prismaServie: PrismaService
    ) { }

    async authenticate(email: string, password: string) {
        const user = await this.userService.validateUser(email, password);
        const token = jwt.sign(
            { user },
            process.env.SECRET_JWT,
            { expiresIn: "7d" }
        );

        return { token: token };
    }

    async logout(token: string) {
        return await this.prismaServie.blacklistToken.create({ data: { token } });
    }

    async isTokenBlacklisted(token: string): Promise<boolean> {
        const isFinded = await this.prismaServie.blacklistToken.findUnique({
            where: {
                token: token
            }
        });
        
        if (isFinded == null) return false;
        return true;
    }

    async getBlacklistedToken() {
        return await this.prismaServie.blacklistToken.findMany();
    }

}

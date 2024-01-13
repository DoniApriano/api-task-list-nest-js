import { Injectable } from '@nestjs/common';
import { UserService } from './user/user.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) { }

    async authenticate(email: string, password: string) {
        const user = await this.userService.validateUser(email, password);
        const token = jwt.sign(
            { uid: user.id },
            process.env.SECRET_JWT,
            { expiresIn: "7d" }
        );

        return { token: token };
    }

}

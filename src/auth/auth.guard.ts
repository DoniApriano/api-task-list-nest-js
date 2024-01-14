import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthService){}
	async canActivate(
		context: ExecutionContext,
	): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = request.headers?.authorization ?? null;
		if (!token) return false;
		if (token.split(' ').length < 2) return false;
		const bearerToken = token.split(' ')[1];
		if (await this.authService.isTokenBlacklisted(bearerToken)) return false;
		return this.validateToken(bearerToken, request);
	}

	validateToken(token: string, request): boolean {
		try {
			const isValid = jwt.verify(token, process.env.SECRET_JWT);
			if (!isValid) return false;

			const decodedToken = jwt.decode(token, { json: true });
			if (!decodedToken) return false;

			const user = decodedToken.user;
			console.log('Decoded Token:', decodedToken);
			request.user = { user };
			return true;
		} catch {
			return false;
		}
	}
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = request.headers?.authorization ?? null;
		if (!token) return null;
		if (token.split(' ') < 2) return false;
		const bearerToken = token.split(' ')[1];
		return this.validateToken(bearerToken);
	}

	validateToken(token: string) {
		try {
			const isValid = jwt.verify(token, process.env.SECRET_JWT);
			if (!isValid) return false;

			const decodeToken = jwt.decode(token, { json: true });
			if (!decodeToken) return false;

			return true;
		} catch {
			return false;
		}
	}
}

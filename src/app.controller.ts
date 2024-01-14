import { Controller, Get, UseGuards, Request, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';

@UseGuards(AuthGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(@Request() req) {
    const { user } = req.user;
    return { message: 'This is protected data', user };
  }
}

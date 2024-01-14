import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from './user/user.service';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthGuard } from './auth.guard';

@Module({
  providers: [AuthService, UserService, PrismaService, AuthGuard],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }

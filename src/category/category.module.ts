import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/auth/user/user.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService, UserService,AuthService],
  exports: [AuthService]
})
export class CategoryModule { }

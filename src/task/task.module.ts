import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/auth/user/user.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, PrismaService, UserService, AuthService],
  exports: [UserService, AuthService]
})
export class TaskModule {}

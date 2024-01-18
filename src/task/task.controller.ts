import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
	constructor(private readonly taskService: TaskService) { }

	@Post()
	async create(@Body() createTaskDto: CreateTaskDto, @Request() request) {
		const { user } = request.user;

		createTaskDto.userId = user.id;
		createTaskDto.completed = false;

		return await this.taskService.create(createTaskDto);
	}

	@Get()
	findAll(@Request() request) {
		const { user } = request.user;
		return this.taskService.findAll(user.id);
	}

	@Get(':id')
	findOne(@Param('id') id: string,@Request() request) {
		const { user } = request.user;
		return this.taskService.findOne(id, user.id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Request() request) {
		const { user } = request.user;
		return this.taskService.update(id, user.id, updateTaskDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string, @Request() request) {
		const { user } = request.user;
		return this.taskService.remove(id,user.id);
	}
}

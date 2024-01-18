import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma.service';
import { Task } from '@prisma/client';

@Injectable()
export class TaskService {
	constructor(private prismaService: PrismaService) { }

	async create(createTaskDto: CreateTaskDto) {
		if (createTaskDto.categoryId !== null) {
			const category = await this.prismaService.category.findUnique({ where: { id: createTaskDto.categoryId } });
			if (category.userId !== createTaskDto.userId) {
				throw new UnauthorizedException(`You are not authorized to create this task with category ${category.name}`);
			}
		}
		const task = await this.prismaService.task.create({ data: createTaskDto });

		return {
			statusCode: HttpStatus.CREATED,
			message: 'New Task Successfully created',
			data: task
		};
	}

	async findAll(userId: string) {
		const currentDate = new Date();
		const options = { timeZone: "Asia/Jakarta" };

		// Mendapatkan komponen tanggal dan waktu
		const year = currentDate.toLocaleString("en-US", { year: "numeric", timeZone: options.timeZone });
		const month = currentDate.toLocaleString("en-US", { month: "2-digit", timeZone: options.timeZone });
		const day = currentDate.toLocaleString("en-US", { day: "2-digit", timeZone: options.timeZone });
		const hours = currentDate.toLocaleString("en-US", { hour: "2-digit", timeZone: options.timeZone, hour12: false });
		const minutes = currentDate.toLocaleString("en-US", { minute: "2-digit", timeZone: options.timeZone });
		const seconds = currentDate.toLocaleString("en-US", { second: "2-digit", timeZone: options.timeZone });

		// Membuat format yang diinginkan
		const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
		const task = await this.prismaService.task.findMany({
			where: {
				userId: userId,
				deadline: {
					lte: new Date(formattedDate)
				}
			},
			include: {
				user: {
					select: {
						username: true,
						email: true
					},
				}
			}
		});
		return {
			statusCode: HttpStatus.OK,
			message: 'All Task Successfully displayed',
			data: task,
		};
	}

	async findOne(id: string, userId: string) {
		const findTask = await this.prismaService.task.findUnique({
			where: {
				id: id
			},
		});

		return {
			statusCode: HttpStatus.OK,
			message: 'Displayed successfully',
			data: findTask,
		};
	}

	async update(id: string, userId: string, updateTaskDto: UpdateTaskDto) {
		const findTask = await this.prismaService.task.findUnique({
			where: {
				id: id
			},
		});
		if (!findTask) throw new NotFoundException('Task not found');
		if (findTask.userId !== userId) throw new UnauthorizedException('You are not authorized to edit this task');
		if (updateTaskDto.categoryId !== null) {
			const category = await this.prismaService.category.findUnique({ where: { id: updateTaskDto.categoryId } });
			if (category.userId !== userId) {
				throw new UnauthorizedException(`You are not authorized to edit this task with category ${category.name}`);
			}
		}

		const updateTask = await this.prismaService.task.update({
			where: { id: id },
			data: { ...updateTaskDto },
		});
		return {
			statusCode: HttpStatus.OK,
			message: 'Update successfully',
			data: updateTask
		};
	}

	async remove(id: string, userId: string) {
		const findTask = await this.prismaService.task.findUnique({
			where: {
				id: id
			},
		});

		if (!findTask) throw new NotFoundException('Task not found');
		if (findTask.userId !== userId) throw new UnauthorizedException('You are not authorized to edit this task');
		const deleteTask = await this.prismaService.task.delete({ where: { id: id } })
		return {
			statusCode: HttpStatus.OK,
			message: 'Delete successfully',
		};
	}


	async updateOverdueTasks() {
		const currentDate = new Date();
		const options = { timeZone: "Asia/Jakarta" };

		// is there any other way?
		const year = currentDate.toLocaleString("en-US", { year: "numeric", timeZone: options.timeZone });
		const month = currentDate.toLocaleString("en-US", { month: "2-digit", timeZone: options.timeZone });
		const day = currentDate.toLocaleString("en-US", { day: "2-digit", timeZone: options.timeZone });
		const timeString = currentDate.toLocaleTimeString("en-US", { hour12: false, timeZone: options.timeZone });

		const formattedDate = `${year}-${month}-${day}T${timeString}.000Z`;
		const task = await this.prismaService.task.updateMany({
			where: {
				deadline: {
					lte: new Date(formattedDate),
				},
				completed: false,
			},
			data: {
				completed: true,
			},
		});
	}

}

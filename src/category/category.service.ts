import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoryService {
	constructor(private prismaService: PrismaService) { }

	async create(createCategoryDto: CreateCategoryDto) {
		const category = await this.prismaService.category.create({ data: createCategoryDto });
		const { name } = category;
		return {
			statusCode: HttpStatus.CREATED,
			message: 'Create successfully',
			data: category,
		};
	}

	async findAll(userId: string) {
		const category = await this.prismaService.category.findMany({
			where: {
				userId: userId
			},
			include: {
				user: {
					select: {
						username: true,
						email: true
					}
				}
			}
		});
		return {
			statusCode: HttpStatus.OK,
			message: 'Category successfully showed',
			data: category,
		};
	}

	async findOne(id: string, userId: string) {
		const category = await this.prismaService.category.findUnique({ where: { id: id } });

		if (!category) throw new NotFoundException('Category not found');
		if (category.userId !== userId) throw new UnauthorizedException('You not authorized to edit this category');

		return {
			statusCode: HttpStatus.OK,
			message: 'Category successfully showed',
			data: category,
		};
	}

	async update(id: string, userId: string, updateCategoryDto: UpdateCategoryDto) {
		const category = await this.prismaService.category.findUnique({ where: { id: id } });

		if (!category) throw new NotFoundException('Category not found');
		if (category.userId !== userId) throw new UnauthorizedException('You not authorized to edit this category');

		const updateCategory = await this.prismaService.category.update({
			where: { id: id },
			data: updateCategoryDto
		});

		return {
			statusCode: HttpStatus.OK,
			message: 'Category successfully updated',
			data: updateCategory,
		};
	}

	async remove(id: string, userId: string) {
		const category = await this.prismaService.category.findUnique({ where: { id: id } });

		if (!category) throw new NotFoundException('Category not found');
		if (category.userId !== userId) throw new UnauthorizedException('You not authorized to edit this category');

		const updateCategory = await this.prismaService.category.delete({
			where: { id: id },
		});

		return {
			statusCode: HttpStatus.OK,
			message: 'Category successfully deleted',
			data: updateCategory,
		};
	}
}

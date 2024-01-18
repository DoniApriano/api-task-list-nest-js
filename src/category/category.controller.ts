import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) { }

	@Post()
	create(@Body() createCategoryDto: CreateCategoryDto, @Request() request) {
		const { user } = request.user;
		createCategoryDto.userId = user.id;
		return this.categoryService.create(createCategoryDto);
	}

	@Get()
	findAll(@Request() request) {
		const { user } = request.user;
		return this.categoryService.findAll(user.id);
	}

	@Get(':id')
	findOne(@Param('id') id: string, @Request() request) {
		const { user } = request.user;
		return this.categoryService.findOne(id, user.id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Request() request, @Body() updateCategoryDto: UpdateCategoryDto) {
		const { user } = request.user;
		return this.categoryService.update(id, user.id, updateCategoryDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string, @Request() request) {
		const { user } = request.user;
		return this.categoryService.remove(id, user.id);
	}
}

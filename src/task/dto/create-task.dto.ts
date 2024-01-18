import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {

    @IsString()
    @IsNotEmpty()
    title : string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsNotEmpty()
    priority: string;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    deadline: Date;

    @IsNotEmpty()
    categoryId: string;

    completed: boolean; 

    userId: string;
}

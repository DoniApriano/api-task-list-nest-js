import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TaskService } from './task/task.service';
import { CronJob } from 'cron';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const taskService = app.get(TaskService);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    const job = new CronJob('* * * * *', async () => {
        try {
            await taskService.updateOverdueTasks();
        } catch (error) {
            console.error('Error updating overdue tasks:', error);
        }
    });

    job.start();

    await app.listen(3000);
}

bootstrap();

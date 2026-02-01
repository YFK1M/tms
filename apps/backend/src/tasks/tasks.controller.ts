import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards, Query, Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator';
import { TasksQueryDto } from "./dto/tasks-query.dto";

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @Post()
    create(@User('id') userId: string, @Body() dto: CreateTaskDto) {
        return this.tasksService.create(userId, dto);
    }

    @Get()
    findAll(
        @User('id') userId: string,
        @Query() query: TasksQueryDto,
    ) {
        return this.tasksService.findAll(userId, query);
    }

    @Get(':id')
    findOne(@User('id') userId: string, @Param('id') id: string) {
        return this.tasksService.findOne(id, userId);
    }

    @Put(':id')
    update(
        @User('id') userId: string,
        @Param('id') id: string,
        @Body() dto: UpdateTaskDto,
    ) {
        return this.tasksService.update(id, userId, dto);
    }

    @Delete(':id')
    remove(@User('id') userId: string, @Param('id') id: string) {
        return this.tasksService.remove(id, userId);
    }
}

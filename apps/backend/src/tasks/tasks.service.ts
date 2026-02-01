import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksQueryDto } from "./dto/tasks-query.dto";
import { Prisma } from "../../generated/prisma/client";

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) {}

    create(userId: string, dto: CreateTaskDto) {
        return this.prisma.task.create({
            data: {
                ...dto,
                userId,
            },
        });
    }

    async findAll(userId: string, query: TasksQueryDto) {
        const {
            status,
            priority,
            search,
            sortBy,
            order,
            page,
            limit,
        } = query;

        const pageSafe = page ?? 1;
        const limitSafe = limit ?? 10;

        const where: Prisma.TaskWhereInput = {
            userId,
            status,
            priority,
            ...(search && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const [items, total] = await this.prisma.$transaction([
            this.prisma.task.findMany({
                where,
                orderBy: { [sortBy as 'createdAt' | 'dueDate']: order },
                skip: (pageSafe - 1) * limitSafe,
                take: limitSafe,
            }),
            this.prisma.task.count({ where }),
        ]);

        return {
            items,
            page,
            limit,
            total,
        };
    }

    async findOne(id: string, userId: string) {
        const task = await this.prisma.task.findFirst({
            where: { id, userId },
        });

        if (!task) throw new NotFoundException('Task not found');
        return task;
    }

    async update(id: string, userId: string, dto: UpdateTaskDto) {
        await this.findOne(id, userId);

        return this.prisma.task.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string, userId: string) {
        await this.findOne(id, userId);

        return  this.prisma.task.delete({ where: { id } });
    }
}

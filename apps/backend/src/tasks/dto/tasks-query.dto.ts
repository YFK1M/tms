import { IsEnum, IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum TaskStatus {
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}

export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

export enum SortBy {
    createdAt = 'createdAt',
    dueDate = 'dueDate',
}

export enum Order {
    asc = 'asc',
    desc = 'desc',
}

export class TasksQueryDto {
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: TaskPriority;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(SortBy)
    sortBy?: SortBy = SortBy.createdAt;

    @IsOptional()
    @IsEnum(Order)
    order?: Order = Order.desc;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;
}

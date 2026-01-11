import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '../entities/task.entity';

export class CreateTaskDto {
  @ApiProperty({ example: 'Complete project documentation', description: 'Task title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Write comprehensive API documentation', description: 'Task description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, example: TaskStatus.TODO, description: 'Task status' })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: TaskPriority, example: TaskPriority.HIGH, description: 'Task priority' })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiPropertyOptional({ example: '2026-01-15T10:00:00Z', description: 'Due date in ISO format' })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({ example: 1, description: 'User ID who owns this task' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiPropertyOptional({ example: 2, description: 'Category ID' })
  @IsNumber()
  @IsOptional()
  categoryId?: number;
}

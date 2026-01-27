import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString, IsNumber, IsArray, ValidateIf } from 'class-validator';
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

  @ApiPropertyOptional({ example: '2026-01-15T09:00:00Z', description: 'Start date and time in ISO format' })
  @ValidateIf((o) => o.startDateTime && o.startDateTime.trim() !== '')
  @IsDateString()
  @IsOptional()
  startDateTime?: string;

  @ApiPropertyOptional({ example: '2026-01-15T17:00:00Z', description: 'End date and time in ISO format' })
  @ValidateIf((o) => o.endDateTime && o.endDateTime.trim() !== '')
  @IsDateString()
  @IsOptional()
  endDateTime?: string;

  @ApiProperty({ example: 1, description: 'User ID who owns this task' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiPropertyOptional({ example: [1, 2], description: 'Array of category IDs', type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  categoryIds?: number[];
}

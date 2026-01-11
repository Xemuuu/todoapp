import { IsString, IsNotEmpty, IsOptional, Matches, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Work', description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: '#FF5733', description: 'Hex color code' })
  @IsString()
  @IsOptional()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Color must be a valid hex color (e.g., #FF5733)',
  })
  color?: string;

  @ApiProperty({ example: 1, description: 'User ID who owns this category' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}

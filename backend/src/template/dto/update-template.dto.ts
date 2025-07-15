import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, IsArray, IsBoolean } from 'class-validator';
import type { TemplateLayout } from '../entities/template.entity';

export class UpdateTemplateDto {
  @ApiProperty({ description: 'Template name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Template description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Template category' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ description: 'Template layout' })
  @IsObject()
  @IsOptional()
  layout?: TemplateLayout;

  @ApiProperty({ description: 'Template tags' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: 'Template active status' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ description: 'Template HTML' })
  @IsString()
  @IsOptional()
  html?: string;

  @ApiProperty({ description: 'Template variables' })
  @IsObject()
  @IsOptional()
  variables?: Record<string, string | { value: string; type: string }>;

  @ApiProperty({ description: 'Template preview image path' })
  @IsString()
  @IsOptional()
  previewImage?: string;
}

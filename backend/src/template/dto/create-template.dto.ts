import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsObject, IsArray, IsBoolean, IsOptional } from 'class-validator';
import type { TemplateLayout } from '../entities/template.entity';

export class CreateTemplateDto {
  @ApiProperty({ description: 'Template name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Template description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Template category', required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ description: 'Template layout' })
  @IsObject()
  @IsNotEmpty()
  layout: TemplateLayout;

  @ApiProperty({ description: 'Template tags', type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: 'Template active status', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ description: 'Template HTML', required: false })
  @IsString()
  @IsOptional()
  html?: string;

  @ApiProperty({ description: 'Template variables', required: false })
  @IsObject()
  @IsOptional()
  variables?: Record<string, string | { value: string; type: string }>;

  @ApiProperty({ description: 'Template preview image path', required: false })
  @IsString()
  @IsOptional()
  previewImage?: string;
}

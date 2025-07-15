import { IsString, IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateImageDto {
  @ApiProperty({ description: 'Name of the template to use' })
  @IsString()
  templateName: string;

  @ApiProperty({ description: 'Name of the brand to use' })
  @IsString()
  brandName: string;

  @ApiProperty({ description: 'Template variables (Titre, Texte, object, etc.)', required: false })
  @IsObject()
  @IsOptional()
  templateVariables?: Record<string, unknown>;
}

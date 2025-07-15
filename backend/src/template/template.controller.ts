import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TemplateService } from './template.service';
import { Template } from './entities/template.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('templates')
@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new template' })
  @ApiResponse({
    status: 201,
    description: 'Template created successfully',
    type: Template,
  })
  async create(
    @Body() createTemplateDto: CreateTemplateDto,
    @CurrentUser() user: User,
  ): Promise<Template> {
    return this.templateService.create({
      ...createTemplateDto,
      userId: user.id,
    });
  }

  @Post('example')
  @ApiOperation({ summary: 'Create a new example template (public)' })
  @ApiResponse({
    status: 201,
    description: 'Example template created successfully',
    type: Template,
  })
  async createExample(@Body() createTemplateDto: CreateTemplateDto): Promise<Template> {
    return this.templateService.createExample(createTemplateDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all templates for the current user' })
  @ApiResponse({ status: 200, description: 'Return all templates', type: [Template] })
  async findAll(
    @CurrentUser() user: User,
    @Query('category') category?: string,
  ): Promise<Template[]> {
    return this.templateService.findAll(user.id, category);
  }

  @Get('examples')
  @ApiOperation({ summary: 'Get all example templates (public)' })
  @ApiResponse({ status: 200, description: 'Return all example templates', type: [Template] })
  async findExamples(@Query('category') category?: string): Promise<Template[]> {
    return this.templateService.findExamples(category);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all templates (user + examples) for the current user' })
  @ApiResponse({ status: 200, description: 'Return all templates with examples', type: [Template] })
  async findAllWithExamples(
    @CurrentUser() user: User,
    @Query('category') category?: string,
  ): Promise<Template[]> {
    return this.templateService.findAllWithExamples(user.id, category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a template by id' })
  @ApiResponse({ status: 200, description: 'Return the template', type: Template })
  async findOne(@Param('id') id: string): Promise<Template> {
    return this.templateService.findOne(id);
  }

  @Get(':id/content')
  @ApiOperation({ summary: 'Get template HTML content' })
  @ApiResponse({ status: 200, description: 'Return the template HTML content' })
  async getTemplateContent(@Param('id') id: string): Promise<string> {
    return this.templateService.getTemplateContent(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a template' })
  @ApiResponse({
    status: 200,
    description: 'Template updated successfully',
    type: Template,
  })
  async update(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ): Promise<Template> {
    return this.templateService.update(id, updateTemplateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a template' })
  @ApiResponse({ status: 200, description: 'Template deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.templateService.remove(id);
  }

  @Get('preview/:filename')
  @ApiOperation({ summary: 'Get template preview image' })
  @ApiResponse({ status: 200, description: 'Return the preview image' })
  async getPreviewImage(@Param('filename') filename: string, @Res() res: Response): Promise<void> {
    const previewPath = path.join(__dirname, '../assets/templatePreviews', filename);

    // Vérifier si le fichier existe
    if (!fs.existsSync(previewPath)) {
      res.status(404).json({ message: 'Preview image not found' });
      return;
    }

    // Servir le fichier
    res.sendFile(previewPath);
  }
}

import { Controller, Post, Body, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { GenerateService } from './generate.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { GenerateImageDto } from './dto/generate-image.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('generate')
@Controller('generate')
export class GenerateController {
  constructor(private readonly generateService: GenerateService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Generate an image from template and brand names' })
  @ApiBody({ type: GenerateImageDto })
  @ApiResponse({ status: 200, description: 'Image generated successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async generateImage(
    @Body() data: GenerateImageDto,
    @Res() res: Response,
    @CurrentUser() user: User,
  ): Promise<void> {
    try {
      const buffer = await this.generateService.generateImageFromDatabase(
        {
          templateName: data.templateName,
          brandName: data.brandName,
          templateVariables: data.templateVariables,
        },
        user,
      );

      res.set({
        'Content-Type': 'image/png',
        'Content-Length': buffer.length,
      });
      res.send(buffer);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
  }
}

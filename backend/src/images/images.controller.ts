import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  Delete,
  Param,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import { Image } from './entities/image.entity';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';

// If you see a linter error for multer types, run: npm i --save-dev @types/multer

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: User): Promise<Image[]> {
    return this.imagesService.findAll(user.id);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (
          _req: Express.Request,
          file: Express.Multer.File,
          cb: (error: Error | null, filename: string) => void,
        ) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ): Promise<Image> {
    if (!file) {
      throw new NotFoundException('No file uploaded.');
    }
    const url = `/uploads/images/${file.filename}`;
    return this.imagesService.create(
      {
        filename: file.filename,
        originalName: file.originalname,
        url,
        size: file.size,
      },
      user,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteImage(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ success: boolean }> {
    await this.imagesService.delete(id, user.id);
    return { success: true };
  }
}

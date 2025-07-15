import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BrandService } from './brand.service';
import { Brand } from './entities/brand.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@ApiTags('brands')
@Controller('brands')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiResponse({
    status: 201,
    description: 'Brand created successfully',
    type: Brand,
  })
  async create(@Body() createBrandDto: CreateBrandDto, @CurrentUser() user: User): Promise<Brand> {
    return this.brandService.create({
      ...createBrandDto,
      userId: user.id,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all brands for current user' })
  @ApiResponse({ status: 200, description: 'Return all brands', type: [Brand] })
  async findAll(@CurrentUser() user: User): Promise<Brand[]> {
    return this.brandService.findAllByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a brand by id' })
  @ApiResponse({ status: 200, description: 'Return the brand', type: Brand })
  async findOne(@Param('id') id: string, @CurrentUser() user: User): Promise<Brand> {
    return this.brandService.findOneByUser(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a brand' })
  @ApiResponse({
    status: 200,
    description: 'Brand updated successfully',
    type: Brand,
  })
  async update(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
    @CurrentUser() user: User,
  ): Promise<Brand> {
    return this.brandService.updateByUser(id, updateBrandDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a brand' })
  @ApiResponse({ status: 200, description: 'Brand deleted successfully' })
  async remove(@Param('id') id: string, @CurrentUser() user: User): Promise<void> {
    return this.brandService.removeByUser(id, user.id);
  }
}

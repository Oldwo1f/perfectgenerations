import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength, IsEnum } from 'class-validator';
import { UserRole, UserStatus } from '../entities/user.entity';

export class AdminUpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    required: false,
    enum: UserRole,
    description: 'User role',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({
    required: false,
    enum: UserStatus,
    description: 'User status',
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}

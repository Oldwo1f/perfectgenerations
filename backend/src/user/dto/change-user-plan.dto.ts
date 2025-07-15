import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ChangeUserPlanDto {
  @ApiProperty({
    description: 'ID du nouveau plan',
    example: 'pro',
  })
  @IsString()
  @IsNotEmpty()
  planId: string;
}

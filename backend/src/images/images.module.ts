import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { UserModule } from '../user/user.module';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [TypeOrmModule.forFeature([Image]), UserModule, BillingModule],
  providers: [ImagesService],
  controllers: [ImagesController],
})
export class ImagesModule {}

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PlanSeeder } from './plan.seeder';
import { DataSource } from 'typeorm';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('Starting seeding...');
    await new PlanSeeder().run(dataSource);
    console.log('Seeding complete.');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();

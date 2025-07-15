import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

export interface TemplateElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'icon';
  x: number;
  y: number;
  width: number;
  height: number;
  properties: Record<string, unknown>;
}

export interface TemplateLayout {
  width: number;
  height: number;
  elements: TemplateElement[];
}

@Entity('templates')
export class Template {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column({ nullable: true })
  @ApiProperty()
  description: string;

  @Column({ nullable: true })
  @ApiProperty()
  category: string;

  @Column('jsonb')
  @ApiProperty()
  layout: TemplateLayout;

  @Column('text', { array: true, default: [] })
  @ApiProperty({ type: [String] })
  tags: string[];

  @Column({ default: true })
  @ApiProperty()
  isActive: boolean;

  @Column('text')
  @ApiProperty()
  html: string;

  @Column({ type: 'json', nullable: true })
  @ApiProperty()
  variables: Record<string, string | { value: string; type: string }>;

  @Column({ type: 'json', nullable: true })
  @ApiProperty()
  brandVariables: Record<string, string>;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Template preview image path' })
  previewImage: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.templates)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}

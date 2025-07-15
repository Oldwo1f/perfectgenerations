import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

interface Background {
  name: string;
  url: string;
}

interface Icon {
  name: string;
  class: string;
}

interface ImageGroup {
  groupName: string;
  images_url: string[];
}

@Entity()
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  primaryColor: string;

  @Column()
  @ApiProperty()
  secondaryColor: string;

  @Column()
  @ApiProperty()
  tertiaryColor: string;

  @Column()
  @ApiProperty()
  titleFont: string;

  @Column()
  @ApiProperty()
  textFont: string;

  @Column()
  @ApiProperty()
  tertiaryFont: string;

  @Column()
  @ApiProperty()
  logoUrl: string;

  @Column('jsonb', { default: [] })
  @ApiProperty({ type: [Object] })
  backgrounds: Background[];

  @Column('jsonb', { default: [] })
  @ApiProperty({ type: [Object] })
  icons: Icon[];

  @Column('jsonb', { default: [] })
  @ApiProperty({ type: [Object] })
  imageGroups: ImageGroup[];

  @Column({ default: '#000000' })
  @ApiProperty()
  textColor: string;

  @Column({ default: '#000000' })
  @ApiProperty()
  textColor2: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @ManyToOne(() => User, (user) => user.brands)
  @JoinColumn({ name: 'userId' })
  user: User;
}

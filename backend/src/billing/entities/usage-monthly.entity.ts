import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('usage_monthly')
@Index(['userId', 'monthYear'], { unique: true })
export class UsageMonthly {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.monthlyUsage)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 7 }) // Format: 'YYYY-MM'
  monthYear: string;

  @Column({ default: 0 })
  imagesGenerated: number;

  @Column({ default: 0 })
  imagesUploaded: number;
}

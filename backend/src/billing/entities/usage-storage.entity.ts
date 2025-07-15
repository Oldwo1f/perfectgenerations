import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('usage_storage')
export class UsageStorage {
  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @OneToOne(() => User, (user) => user.storageUsage)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'bigint', default: 0 })
  bytesUsed: number;
}

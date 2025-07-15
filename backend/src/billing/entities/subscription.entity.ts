import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Plan } from './plan.entity';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  PAST_DUE = 'past_due',
  INCOMPLETE = 'incomplete',
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @OneToOne(() => User, (user) => user.subscription)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 20 })
  planId: string;

  @ManyToOne(() => Plan, { eager: true }) // Eager load plan details
  @JoinColumn({ name: 'planId' })
  plan: Plan;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.INCOMPLETE,
  })
  status: SubscriptionStatus;

  @Column({ nullable: true })
  stripeSubscriptionId: string;

  @Column({ type: 'timestamptz', nullable: true })
  currentPeriodEnd: Date;

  @CreateDateColumn()
  createdAt: Date;
}

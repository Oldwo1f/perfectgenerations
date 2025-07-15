import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('plans')
export class Plan {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  id: string; // e.g., 'free', 'starter', 'pro'

  @Column()
  name: string;

  @Column()
  priceMonthly: number;

  @Column()
  imageLimitMonthly: number;

  @Column({ type: 'bigint' })
  storageLimitBytes: number;

  @Column()
  templateLimit: number;

  @Column()
  brandLimit: number;

  @Column()
  teamMemberLimit: number;

  @Column({ default: true })
  integrationsIncluded: boolean;
}

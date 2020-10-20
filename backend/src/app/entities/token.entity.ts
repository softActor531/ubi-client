import {
  Entity,
  BaseEntity,
  Check,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity()
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column('text')
  type: string;

  @Column('int')
  ttl: number;

  @Column({
    type: 'bool',
    default: false,
  })
  used: boolean;

  @ManyToOne(type => User, user => user.tokens)
  user: User;
  @Column()
  userId: string;
}

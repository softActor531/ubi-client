import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Session } from './session.entity';

@Entity()
export class Feedback extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column('int')
  serviceRating: number;

  @Column('int')
  techRating: number;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @ManyToOne(type => Session, session => session.feedbacks)
  session: Session;
  @Column()
  sessionId: string;
}

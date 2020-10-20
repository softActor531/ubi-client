import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Appointment } from './appointment.entity';
import { Feedback } from './feedback.entity';

export enum SessionStatus {
  READY = 'ready',
  NO_SHOW = 'no_show',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

@Entity()
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.READY,
  })
  status: SessionStatus;

  @Column('date')
  date: Date;

  @Column({
    type: 'bool',
    default: false
  })
  transcriptReady: boolean;

  @Column({ type: 'text', nullable: true })
  transcript: string;

  @Column({
    type: 'bool',
    default: false
  })
  editedTranscriptReady: boolean;

  @Column({ type: 'text', nullable: true })
  editedTranscript: string;

  @Column({
    type: 'bool',
    default: false
  })
  summaryReady: boolean;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({
    type: 'bool',
    default: false
  })
  audioReady: boolean;

  @Column({ type: 'text', nullable: true })
  audioUrl: string;

  @Column({ type: 'text', nullable: true })
  staffNotes: string;

  @Column({
    type: 'bool',
    default: false,
  })
  noShow: boolean;

  @Column({
    type: 'bool',
    default: false,
  })
  isBilled: boolean;

  @ManyToOne(type => Appointment, appointment => appointment.sessions)
  appointment: Appointment;
  @Column()
  appointmentId: string;

  @OneToMany(type => Feedback, feedback => feedback.session, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  feedbacks: Feedback[];
}

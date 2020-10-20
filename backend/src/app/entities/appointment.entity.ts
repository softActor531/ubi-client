import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  JoinTable,
  RelationId,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';
import { Event } from './event.entity';
import { Session } from './session.entity';

// export enum FrequencyType {
//   ONCE = 'once',
//   DAILY = 'daily',
//   WEEKLY = 'weekly',
//   MONTHLY = 'monthly',
//   YEARLY = 'yearly',
// }

export enum AppointmentStatus {
  CREATED = 'created',
  PENDING = 'pending',
  WAITING = 'waiting',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

@Entity()
export class Appointment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.CREATED,
  })
  status: AppointmentStatus;

  @Column('timestamptz')
  startDate: Date;

  @Column('timestamptz')
  endDate: Date;

  @Column({ type: 'text', nullable: true })
  title: string;

  @Column({ type: 'bool', default: false })
  allDay: boolean;

  @Column({ type: 'text', nullable: true })
  rrule: string;

  @Column({ type: 'text', nullable: true })
  exDate: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', default: 'Etc/UTC' })
  timezone: string;

  @ManyToOne(type => Event, event => event.appointments)
  @JoinColumn()
  event: Event;
  @Column()
  eventId: string;

  @ManyToMany(type => User, user => user.appointments, {
    cascade: ['update'],
    onDelete: 'CASCADE'
  })
  @JoinTable()
  users: User[];
  @RelationId((appt: Appointment) => appt.users)
  userIds: string[];

  @OneToMany(type => Session, session => session.appointment,{
    cascade: true,
    onDelete: 'CASCADE'
  })
  sessions: Session[];
}

// @ts-nocheck

// import {
//   Entity,
//   BaseEntity,
//   PrimaryGeneratedColumn,
//   Column,
//   OneToMany,
//   ManyToMany,
//   ManyToOne,
//   JoinColumn,
//   JoinTable,
//   RelationId,
//   CreateDateColumn,
//   UpdateDateColumn,
// } from 'typeorm';

// import { User } from './user.entity';
// import { Event } from './event.entity';
// import { Session } from './session.entity';
// import { Recurrence } from './recurrence.entity';
// import { Cancellation } from './cancellation.entity';

// export enum FrequencyType {
//   ONCE = 'once',
//   DAILY = 'daily',
//   WEEKLY = 'weekly',
//   MONTHLY = 'monthly',
//   YEARLY = 'yearly',
// }

// export enum AppointmentStatus {
//   CREATED = 'created',
//   PENDING = 'pending',
//   WAITING = 'waiting',
//   CONFIRMED = 'confirmed',
//   COMPLETED = 'completed',
//   CANCELED = 'canceled',
// }

// @Entity()
// export class Appointment extends BaseEntity {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @CreateDateColumn({ type: 'timestamptz' })
//   createdAt: Date;

//   @UpdateDateColumn({ type: 'timestamptz' })
//   updatedAt: Date;

//   @Column('text')
//   notes: string;

//   @Column('date')
//   starts_on: Date;

//   @Column('date')
//   ends_on: Date;

//   @Column('timestamp without time zone')
//   starts_at: Date;

//   @Column('timestamp without time zone')
//   ends_at: Date;

//   @Column({ type: 'enum', enum: FrequencyType })
//   frequency: string;

//   @Column({ type: 'int', default: 1 })
//   separation: number;
//   // separation INTEGER NOT NULL DEFAULT 1 constraint positive_separation CHECK (separation > 0),

//   @Column('int')
//   count: number;

//   @Column('date')
//   until: Date;

//   @Column({ default: 'Etc/UTC' })
//   timezone: string;

//   @ManyToMany(type => User, user => user.appointments, {
//     cascade: ['update'],
//     onDelete: 'CASCADE'
//   })
//   @JoinTable()
//   users: User[];
//   @RelationId((appt: Appointment) => appt.users)
//   userIds: string[];

//   @ManyToOne(type => Event, event => event.appointments)
//   @JoinColumn()
//   event: Event;
//   @Column()
//   eventId: string;

//   @OneToMany(type => Session, session => session.appointment,{
//     cascade: true,
//     onDelete: 'CASCADE'
//   })
//   sessions: Session[];

//   @OneToMany(type => Recurrence, recurrence => recurrence.appointment, {
//     cascade: true,
//     onDelete: 'CASCADE'
//   })
//   recurrences: Recurrence[];

//   @OneToMany(type => Cancellation, cancellation => cancellation.appointment, {
//     cascade: true,
//     onDelete: 'CASCADE'
//   })
//   cancellations: Cancellation[];
// }

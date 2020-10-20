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
import { Organization } from './organization.entity';
import { Appointment } from './appointment.entity';

@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAat: Date;

  @Column('text')
  name: string;

  @Column({ type: 'text', nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(type => Organization, org => org.events)
  @JoinColumn()
  organization: Organization;
  @Column()
  organizationId: string;

  @ManyToMany(type => User, user => user.events, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  @JoinTable()
  users: User[];
  @RelationId((event: Event) => event.users)
  userIds: string[];

  @OneToMany(type => Appointment, appointment => appointment.event, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  appointments: Appointment[];
}

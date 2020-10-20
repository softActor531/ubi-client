import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  ManyToMany,
  OneToMany,
  OneToOne,
  JoinTable,
  JoinColumn,
  RelationId,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';
import { Event } from './event.entity';

@Entity()
export class Organization extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Index()
  @Column({ type: 'text', unique: true })
  name: string;

  @Column('text')
  portalName: string;

  @Column({ type: 'text', nullable: true })
  website: string;

  @Column('text')
  timezone: string;

  @Column({ type: 'text', nullable: true })
  streetAddress: string;

  @Column({ type: 'text', nullable: true })
  streetAddress2: string;

  @Column({ type: 'text', nullable: true })
  city: string;

  @Column({ type: 'text', nullable: true })
  state: string;

  @Column({ type: 'text', nullable: true })
  postalCode: string;

  @Column({ type: 'text', nullable: true })
  country: string;

  @Column({ type: 'text', nullable: true })
  phoneNumber: string;

  @Column({ type: 'text', nullable: true })
  mobileNumber: string;

  @Column({ type: 'text', nullable: true })
  faxNumber: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  billingPrimaryEmail: string;

  @Column({ type: 'text', nullable: true })
  billingOrgName: string;

  @Column({ type: 'text', nullable: true })
  billingPurchaseOrderNumber: string;

  @Column({ type: 'text', nullable: true })
  billingAttentionTo: string;

  @Column({ type: 'text', nullable: true })
  billingAddress: string;

  @Column({ type: 'text', nullable: true })
  billingAddress2: string;

  @Column({ type: 'text', nullable: true })
  billingCity: string;

  @Column({ type: 'text', nullable: true })
  billingState: string;

  @Column({ type: 'text', nullable: true })
  billingPostalCode: string;

  @Column({ type: 'text', nullable: true })
  billingCountry: string;

  @OneToOne(type => User)
  @JoinColumn()
  owner: User;

  // @ManyToMany(type => User, user => user.organizations)
  @ManyToMany(type => User, user => user.organizations, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  @JoinTable()
  users: User[];
  @RelationId((org: Organization) => org.users)
  userIds: string[];

  @OneToMany(type => Event, event => event.organization, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  events: Event[];
}

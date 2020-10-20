import { hashPassword, verifyPassword} from '@foal/core';
import {
  getManager,
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  RelationId,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Token } from './token.entity'
import { Organization } from './organization.entity';
import { Event } from './event.entity';
import { Appointment } from './appointment.entity';

const emailVerificationType = 'email-verification';
const passwordResetType = 'passord-reset';

const minute = 60;
const hour = 60 * minute;
const day = 24 * hour;

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  MEMBER = 'member',
}

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Index()
  @Column('text')
  firstName: string;

  @Index()
  @Column('text')
  lastName: string;

  @Index()
  @Column({ type: 'text', unique: true })
  email: string;

  @Column({
    type: 'text',
    // select: false, //Do not return the password hash by default
  })
  passwordHash: string;

  @Column({ type: 'timestamptz', default: null, nullable: true })
  verifiedDate: Date;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MEMBER,
  })
  role: UserRole;

  @OneToMany(type => Token, token => token.user, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  tokens: Token[];

  // @ManyToMany(type => Organization, org => org.users, {
  //   cascade: true,
  //   onDelete: 'CASCADE'
  // })
  // @JoinTable()
  @ManyToMany(type => Organization, org => org.users)
  organizations: Organization[];
  @RelationId((user: User) => user.organizations)
  organizationIds: string[];

  @ManyToMany(type => Event, event => event.users)
  events: Event[];
  @RelationId((user: User) => user.events)
  eventIds: string[];

  @ManyToMany(type => Appointment, appointment => appointment.users)
  appointments: Appointment[];
  @RelationId((user: User) => user.appointments)
  appointmentIds: string[];

  /////////////
  // Functions
  /////////////

  static async registerUser(
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    password: string
  ): Promise<User> {
    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.role = role as UserRole;
    user.email = email;
    await user.setPassword(password);
    await user.save();
    return user;
  }

  static async authenticate(email: string, password: string): Promise<User|null> {
    const user = await getManager()
      .createQueryBuilder(User, 'user')
      .where('user.email = :email', { email: email })
      .getOne();
    if (!user) {
      return null;
    }

    const match = await verifyPassword(password, user.passwordHash)
    return match ? user : null;
  }

  async setPassword(password: string): Promise<void> {
    this.passwordHash = await hashPassword(password);
  }

  static async updatePassword(
    email: string,
    oldPassword: string,
    newPassword: string
  ): Promise<User|null> {
    const user = await User.authenticate(email, oldPassword);
    if (!user) {
      return null;
    }
    await user.setPassword(newPassword);
    await user.save();
    return user;
  }

  async createEmailVerificationToken(): Promise<string> {
    const token = new Token();
    token.user = this;
    token.type = emailVerificationType;
    token.ttl = 2 * day;
    await token.save();
    return token.id;
  }

  async verifyEmail(emailToken: string): Promise<boolean> {
    const token = await getManager()
      .createQueryBuilder(Token, 'token')
      .innerJoin('token.user', 'user', 'user.id = :userId', {
        userId: this.id,
      })
      .where('token.id = :tokenId', { tokenId: emailToken })
      .andWhere('token.createdAt + token.ttl < :now', {
        now: new Date().toISOString(),
      })
      .andWhere('token.used = false')
      .andWhere('token.type = :tokenType', { tokenType: emailVerificationType })
      .getOne();
    if (!token) {
      return false;
    }
    this.verifiedDate = new Date();
    await this.save();
    token.used = true;
    await token.save();
    return true;
  }

  async createPasswordResetToken(): Promise<string> {
    const token = new Token();
    token.user = this;
    token.type = passwordResetType;
    token.ttl = 15 * minute;
    await token.save();
    return token.id;
  }

  async resetPassword(
    emailToken: string,
    newPassword: string
  ): Promise<boolean> {
    const token = await getManager()
      .createQueryBuilder(Token, 'token')
      .where('token.id = :tokenId', { tokenId: emailToken })
      .andWhere('token.createdAt + token.ttl < :now', {
        now: new Date().toISOString(),
      })
      .andWhere('token.used = false')
      .andWhere('token.type = :tokenType', { tokenType: passwordResetType })
      .getOne();
    if (!token) {
      return false;
    }
    await this.setPassword(newPassword);
    await this.save();
    token.used = true;
    await token.save();
    return true;
  }
}

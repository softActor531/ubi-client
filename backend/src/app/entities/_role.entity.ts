// @ts-nocheck

// import {
//   BaseEntity,
//   Entity,
//   Column,
//   PrimaryGeneratedColumn,
//   CreateDateColumn,
//   UpdateDateColumn,
//   JoinColumn,
//   ManyToOne,
// } from 'typeorm';

// import { User } from './user.entity';
// import { Organization } from './organization.entity';

// @Entity()
// export class Role extends BaseEntity {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @CreateDateColumn({ type: 'timestamptz' })
//   created_at: string;

//   @UpdateDateColumn({ type: 'timestamptz' })
//   updated_at: string;

//   @Column('text')
//   type: string;

//   @ManyToOne(type => User, user => user.roles)
//   @JoinColumn()
//   user: User;

//   @ManyToOne(type => Organization, organization => organization.roles)
//   @JoinColumn()
//   organization: Organization;
// }

// Notes:
// 'user.entity' to use following Code:

// @OneToMany(type => Role, role => role.user, {
//   //eager: true, //Always load the role objects from an user
// })
// roles: Role[];


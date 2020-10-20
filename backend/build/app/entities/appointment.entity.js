"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const event_entity_1 = require("./event.entity");
const session_entity_1 = require("./session.entity");
// export enum FrequencyType {
//   ONCE = 'once',
//   DAILY = 'daily',
//   WEEKLY = 'weekly',
//   MONTHLY = 'monthly',
//   YEARLY = 'yearly',
// }
var AppointmentStatus;
(function (AppointmentStatus) {
    AppointmentStatus["CREATED"] = "created";
    AppointmentStatus["PENDING"] = "pending";
    AppointmentStatus["WAITING"] = "waiting";
    AppointmentStatus["CONFIRMED"] = "confirmed";
    AppointmentStatus["COMPLETED"] = "completed";
    AppointmentStatus["CANCELED"] = "canceled";
})(AppointmentStatus = exports.AppointmentStatus || (exports.AppointmentStatus = {}));
let Appointment = class Appointment extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Appointment.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Appointment.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Appointment.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({
        type: 'enum',
        enum: AppointmentStatus,
        default: AppointmentStatus.CREATED,
    }),
    __metadata("design:type", String)
], Appointment.prototype, "status", void 0);
__decorate([
    typeorm_1.Column('timestamptz'),
    __metadata("design:type", Date)
], Appointment.prototype, "startDate", void 0);
__decorate([
    typeorm_1.Column('timestamptz'),
    __metadata("design:type", Date)
], Appointment.prototype, "endDate", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Appointment.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({ type: 'bool', default: false }),
    __metadata("design:type", Boolean)
], Appointment.prototype, "allDay", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Appointment.prototype, "rrule", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Appointment.prototype, "exDate", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Appointment.prototype, "notes", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', default: 'Etc/UTC' }),
    __metadata("design:type", String)
], Appointment.prototype, "timezone", void 0);
__decorate([
    typeorm_1.ManyToOne(type => event_entity_1.Event, event => event.appointments),
    typeorm_1.JoinColumn(),
    __metadata("design:type", event_entity_1.Event)
], Appointment.prototype, "event", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Appointment.prototype, "eventId", void 0);
__decorate([
    typeorm_1.ManyToMany(type => user_entity_1.User, user => user.appointments, {
        cascade: ['update'],
        onDelete: 'CASCADE'
    }),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Appointment.prototype, "users", void 0);
__decorate([
    typeorm_1.RelationId((appt) => appt.users),
    __metadata("design:type", Array)
], Appointment.prototype, "userIds", void 0);
__decorate([
    typeorm_1.OneToMany(type => session_entity_1.Session, session => session.appointment, {
        cascade: true,
        onDelete: 'CASCADE'
    }),
    __metadata("design:type", Array)
], Appointment.prototype, "sessions", void 0);
Appointment = __decorate([
    typeorm_1.Entity()
], Appointment);
exports.Appointment = Appointment;
//# sourceMappingURL=appointment.entity.js.map
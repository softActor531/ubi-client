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
const appointment_entity_1 = require("./appointment.entity");
const feedback_entity_1 = require("./feedback.entity");
var SessionStatus;
(function (SessionStatus) {
    SessionStatus["READY"] = "ready";
    SessionStatus["NO_SHOW"] = "no_show";
    SessionStatus["COMPLETED"] = "completed";
    SessionStatus["CANCELED"] = "canceled";
})(SessionStatus = exports.SessionStatus || (exports.SessionStatus = {}));
let Session = class Session extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Session.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Session.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Session.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column({
        type: 'enum',
        enum: SessionStatus,
        default: SessionStatus.READY,
    }),
    __metadata("design:type", String)
], Session.prototype, "status", void 0);
__decorate([
    typeorm_1.Column('date'),
    __metadata("design:type", Date)
], Session.prototype, "date", void 0);
__decorate([
    typeorm_1.Column({
        type: 'bool',
        default: false
    }),
    __metadata("design:type", Boolean)
], Session.prototype, "transcriptReady", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Session.prototype, "transcript", void 0);
__decorate([
    typeorm_1.Column({
        type: 'bool',
        default: false
    }),
    __metadata("design:type", Boolean)
], Session.prototype, "editedTranscriptReady", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Session.prototype, "editedTranscript", void 0);
__decorate([
    typeorm_1.Column({
        type: 'bool',
        default: false
    }),
    __metadata("design:type", Boolean)
], Session.prototype, "summaryReady", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Session.prototype, "summary", void 0);
__decorate([
    typeorm_1.Column({
        type: 'bool',
        default: false
    }),
    __metadata("design:type", Boolean)
], Session.prototype, "audioReady", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Session.prototype, "audioUrl", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Session.prototype, "staffNotes", void 0);
__decorate([
    typeorm_1.Column({
        type: 'bool',
        default: false,
    }),
    __metadata("design:type", Boolean)
], Session.prototype, "noShow", void 0);
__decorate([
    typeorm_1.Column({
        type: 'bool',
        default: false,
    }),
    __metadata("design:type", Boolean)
], Session.prototype, "isBilled", void 0);
__decorate([
    typeorm_1.ManyToOne(type => appointment_entity_1.Appointment, appointment => appointment.sessions),
    __metadata("design:type", appointment_entity_1.Appointment)
], Session.prototype, "appointment", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Session.prototype, "appointmentId", void 0);
__decorate([
    typeorm_1.OneToMany(type => feedback_entity_1.Feedback, feedback => feedback.session, {
        cascade: true,
        onDelete: 'CASCADE'
    }),
    __metadata("design:type", Array)
], Session.prototype, "feedbacks", void 0);
Session = __decorate([
    typeorm_1.Entity()
], Session);
exports.Session = Session;
//# sourceMappingURL=session.entity.js.map
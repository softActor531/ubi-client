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
const session_entity_1 = require("./session.entity");
let Feedback = class Feedback extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Feedback.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Feedback.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], Feedback.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Column('int'),
    __metadata("design:type", Number)
], Feedback.prototype, "serviceRating", void 0);
__decorate([
    typeorm_1.Column('int'),
    __metadata("design:type", Number)
], Feedback.prototype, "techRating", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Feedback.prototype, "comments", void 0);
__decorate([
    typeorm_1.ManyToOne(type => session_entity_1.Session, session => session.feedbacks),
    __metadata("design:type", session_entity_1.Session)
], Feedback.prototype, "session", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Feedback.prototype, "sessionId", void 0);
Feedback = __decorate([
    typeorm_1.Entity()
], Feedback);
exports.Feedback = Feedback;
//# sourceMappingURL=feedback.entity.js.map
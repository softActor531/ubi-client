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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
"use strict";
const core_1 = require("@foal/core");
const typeorm_1 = require("typeorm");
const token_entity_1 = require("./token.entity");
const organization_entity_1 = require("./organization.entity");
const event_entity_1 = require("./event.entity");
const appointment_entity_1 = require("./appointment.entity");
const emailVerificationType = 'email-verification';
const passwordResetType = 'passord-reset';
const minute = 60;
const hour = 60 * minute;
const day = 24 * hour;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["MANAGER"] = "manager";
    UserRole["MEMBER"] = "member";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
let User = User_1 = class User extends typeorm_1.BaseEntity {
    /////////////
    // Functions
    /////////////
    static async registerUser(firstName, lastName, email, role, password) {
        const user = new User_1();
        user.firstName = firstName;
        user.lastName = lastName;
        user.role = role;
        user.email = email;
        await user.setPassword(password);
        await user.save();
        return user;
    }
    static async authenticate(email, password) {
        const user = await typeorm_1.getManager()
            .createQueryBuilder(User_1, 'user')
            .where('user.email = :email', { email: email })
            .getOne();
        if (!user) {
            return null;
        }
        const match = await core_1.verifyPassword(password, user.passwordHash);
        return match ? user : null;
    }
    async setPassword(password) {
        this.passwordHash = await core_1.hashPassword(password);
    }
    static async updatePassword(email, oldPassword, newPassword) {
        const user = await User_1.authenticate(email, oldPassword);
        if (!user) {
            return null;
        }
        await user.setPassword(newPassword);
        await user.save();
        return user;
    }
    async createEmailVerificationToken() {
        const token = new token_entity_1.Token();
        token.user = this;
        token.type = emailVerificationType;
        token.ttl = 2 * day;
        await token.save();
        return token.id;
    }
    async verifyEmail(emailToken) {
        const token = await typeorm_1.getManager()
            .createQueryBuilder(token_entity_1.Token, 'token')
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
    async createPasswordResetToken() {
        const token = new token_entity_1.Token();
        token.user = this;
        token.type = passwordResetType;
        token.ttl = 15 * minute;
        await token.save();
        return token.id;
    }
    async resetPassword(emailToken, newPassword) {
        const token = await typeorm_1.getManager()
            .createQueryBuilder(token_entity_1.Token, 'token')
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
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.Index(),
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    typeorm_1.Index(),
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    typeorm_1.Index(),
    typeorm_1.Column({ type: 'text', unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({
        type: 'text',
    }),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    typeorm_1.Column({ type: 'timestamptz', default: null, nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "verifiedDate", void 0);
__decorate([
    typeorm_1.Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.MEMBER,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    typeorm_1.OneToMany(type => token_entity_1.Token, token => token.user, {
        cascade: true,
        onDelete: 'CASCADE'
    }),
    __metadata("design:type", Array)
], User.prototype, "tokens", void 0);
__decorate([
    typeorm_1.ManyToMany(type => organization_entity_1.Organization, org => org.users),
    __metadata("design:type", Array)
], User.prototype, "organizations", void 0);
__decorate([
    typeorm_1.RelationId((user) => user.organizations),
    __metadata("design:type", Array)
], User.prototype, "organizationIds", void 0);
__decorate([
    typeorm_1.ManyToMany(type => event_entity_1.Event, event => event.users),
    __metadata("design:type", Array)
], User.prototype, "events", void 0);
__decorate([
    typeorm_1.RelationId((user) => user.events),
    __metadata("design:type", Array)
], User.prototype, "eventIds", void 0);
__decorate([
    typeorm_1.ManyToMany(type => appointment_entity_1.Appointment, appointment => appointment.users),
    __metadata("design:type", Array)
], User.prototype, "appointments", void 0);
__decorate([
    typeorm_1.RelationId((user) => user.appointments),
    __metadata("design:type", Array)
], User.prototype, "appointmentIds", void 0);
User = User_1 = __decorate([
    typeorm_1.Entity()
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map
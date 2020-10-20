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
const core_1 = require("@foal/core");
const typeorm_1 = require("@foal/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
// ... to complete
const credentialsSchema = {
    additionalProperties: false,
    properties: {
        email: { type: "string", format: "email" },
        password: { type: "string" },
        rememberMe: { type: "boolean" },
    },
    required: ["email", "password", "rememberMe"],
    type: "object",
};
class AuthController {
    async signup(ctx) {
        const user = new entities_1.User();
        user.email = ctx.request.body.email;
        user.passwordHash = await core_1.hashPassword(ctx.request.body.password);
        await typeorm_2.getRepository(entities_1.User).save(user);
        const session = await this.store.createAndSaveSessionFromUser(user);
        const response = new core_1.HttpResponseOK({
            userRole: user.role,
            credentials: "include",
        });
        const token = session.getToken();
        core_1.setSessionCookie(response, token);
        return response;
    }
    async login(ctx) {
        const user = await entities_1.User.authenticate(ctx.request.body.email, ctx.request.body.password);
        if (!user) {
            return new core_1.HttpResponseUnauthorized();
        }
        const response = new core_1.HttpResponseOK({
            role: user.role,
            name: user.firstName + " " + user.lastName,
            email: user.email,
        });
        const session = await this.store.createAndSaveSessionFromUser(user);
        session.set("expirationTimeouts", 130 * 86400);
        const token = session.getToken();
        console.log("token: ", session, token, session.getContent());
        core_1.setSessionCookie(response, token);
        return response;
    }
    async logout(ctx) {
        const response = new core_1.HttpResponseNoContent();
        try {
            await this.store.destroy(ctx.session.sessionID);
            core_1.removeSessionCookie(response);
        }
        catch (err) {
            console.log("session clear error: ", err);
        }
        return response;
    }
}
__decorate([
    core_1.dependency,
    __metadata("design:type", typeorm_1.TypeORMStore)
], AuthController.prototype, "store", void 0);
__decorate([
    core_1.Post("/signup"),
    core_1.ValidateBody(credentialsSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Context]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    core_1.Post("/login"),
    core_1.ValidateBody(credentialsSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Context]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    core_1.Post("/logout"),
    core_1.TokenRequired({
        cookie: true,
        extendLifeTimeOrUpdate: false,
        store: typeorm_1.TypeORMStore,
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Context]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map
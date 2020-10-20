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
const admin_1 = require("./admin");
const services_1 = require("../services");
const share_1 = require("../../share");
let ApiController = class ApiController {
    constructor() {
        this.subControllers = [
            core_1.controller("/admin", admin_1.UserController),
            core_1.controller("/admin", admin_1.OrganizationController),
            core_1.controller("/admin", admin_1.EventController),
            core_1.controller("/admin", admin_1.AppointmentController),
            core_1.controller("/admin", admin_1.SessionController),
            core_1.controller("/admin", admin_1.FeedbackController),
        ];
    }
    options(ctx) {
        const response = new core_1.HttpResponseNoContent();
        response.setHeader("Access-Control-Allow-Methods", "HEAD, GET, POST, PUT, PATCH, DELETE");
        // You may need to allow other headers depending on what you need.
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        return response;
    }
    index(ctx) {
        console.log("index");
        return new core_1.HttpResponseOK("Hello world!");
    }
    createRoom(ctx) {
        // console.log(body)
        // const body = ctx.request.body;
        // Do something.
        return new core_1.HttpResponseCreated();
        // return new HttpResponseOK('Created!');
    }
    getRoom(ctx) {
        // const productId = ctx.request.params.id;
        // Do something.
        return new core_1.HttpResponseOK("Hello world!");
    }
    createRoomToken(ctx) {
        const body = ctx.request.body;
        share_1.createDoc(body.roomName);
        const resp = this.twilioApi.getRoomToken(body.roomName, body.userName);
        return new core_1.HttpResponseOK(resp);
    }
    async sendText(ctx) {
        return new core_1.HttpResponseOK({
            TestResult: "This is for a test",
        });
    }
};
__decorate([
    core_1.Options("*"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Context]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "options", null);
__decorate([
    core_1.dependency,
    __metadata("design:type", services_1.TwilioApi)
], ApiController.prototype, "twilioApi", void 0);
__decorate([
    core_1.Get("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Context]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "index", null);
__decorate([
    core_1.Post("/rooms"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Context]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "createRoom", null);
__decorate([
    core_1.Get("/rooms/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Context]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "getRoom", null);
__decorate([
    core_1.Post("/rooms/token"),
    core_1.ValidateBody({
        additionalProperties: false,
        properties: {
            userName: { type: "string" },
            roomName: { type: "string" },
        },
        required: ["userName", "roomName"],
        type: "object",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Context]),
    __metadata("design:returntype", void 0)
], ApiController.prototype, "createRoomToken", null);
__decorate([
    core_1.Post("/testText"),
    core_1.TokenRequired({
        cookie: true,
        extendLifeTimeOrUpdate: true,
        store: typeorm_1.TypeORMStore,
        redirectTo: "/login",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Context]),
    __metadata("design:returntype", Promise)
], ApiController.prototype, "sendText", null);
ApiController = __decorate([
    core_1.Hook(() => (response) => {
        // Every response of this controller and its sub-controllers will be added this header.
        response.setHeader("Access-Control-Allow-Origin", "*");
    })
], ApiController);
exports.ApiController = ApiController;
//# sourceMappingURL=api.controller.js.map
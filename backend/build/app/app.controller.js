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
const controllers_1 = require("./controllers");
class AppController {
    constructor() {
        this.subControllers = [
            core_1.controller('/api', controllers_1.ApiController),
            core_1.controller('/auth', controllers_1.AuthController)
        ];
    }
    renderApp(ctx) {
        if (!ctx.request.accepts('html')) {
            return new core_1.HttpResponseNotFound();
        }
        return core_1.createHttpResponseFile({
            directory: `${__dirname}/../../../portal/build`,
            file: 'index.html'
        });
        // OR render('./templates/index.html');
    }
}
__decorate([
    core_1.Get('*'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Context]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "renderApp", null);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@foal/core");
const typeorm_1 = require("typeorm");
const paginate_1 = __importStar(require("./paginate"));
const entities_1 = require("../../entities");
const entities_2 = require("../../entities");
const entities_3 = require("../../entities");
class EventController {
    constructor() {
        this.repository = typeorm_1.getRepository(entities_1.Event);
    }
    async list(ctx) {
        const entityName = 'events';
        const query = paginate_1.default(ctx.request.query);
        query.relations = ['organization'];
        const [data, total] = await this.repository.findAndCount(query);
        const response = new core_1.HttpResponseOK(data);
        const [from, to] = paginate_1.getRange(ctx.request.query.range);
        if (typeof from === 'number' && typeof to === 'number') {
            response.setHeader('Access-Control-Expose-Headers', 'Content-Range');
            response.setHeader('Access-Control-Allow-Credentials', 'true');
            response.setHeader('Content-Range', `${entityName} ${from}-${to}/${total}`);
        }
        return response;
    }
    async view(ctx) {
        const query = {
            id: ctx.request.params.id,
            relations: ['organization']
        };
        const data = await this.repository.findOne(query);
        if (!data)
            return new core_1.HttpResponseNotFound();
        return new core_1.HttpResponseOK(data);
    }
    async create(ctx) {
        const data = await this.repository.create(ctx.request.body);
        const { organizationId, userIds } = ctx.request.body;
        // Update Organization
        if (organizationId) {
            const org = await typeorm_1.getRepository(entities_3.Organization).findOne(organizationId);
            if (org)
                data.organization = org;
        }
        // Update Users
        if (userIds && userIds.length) {
            data.users = [];
            userIds.forEach(async (id) => {
                const user = await typeorm_1.getRepository(entities_2.User).findOne(id);
                if (user) {
                    data.users.push(user);
                }
            });
        }
        else {
            data.users = [];
        }
        await this.repository.save(data);
        return new core_1.HttpResponseCreated(data);
    }
    async update(ctx) {
        const data = await this.repository.findOne(ctx.request.params.id);
        if (!data)
            return new core_1.HttpResponseNotFound();
        this.repository.merge(data, ctx.request.body);
        const { organizationId, userIds } = ctx.request.body;
        // Update Organization
        if (organizationId) {
            const org = await typeorm_1.getRepository(entities_3.Organization).findOne(organizationId);
            if (org)
                data.organization = org;
        }
        // Update Users
        if (userIds && userIds.length) {
            data.users = [];
            userIds.forEach(async (id) => {
                const user = await typeorm_1.getRepository(entities_2.User).findOne(id);
                if (user) {
                    data.users.push(user);
                }
            });
        }
        else {
            data.users = [];
        }
        await this.repository.save(data);
        return new core_1.HttpResponseOK(data);
    }
    async delete(ctx) {
        const data = await this.repository.findOne(ctx.request.params.id);
        if (!data)
            return new core_1.HttpResponseNotFound();
        await this.repository.remove(data);
        return new core_1.HttpResponseNoContent();
    }
}
__decorate([
    core_1.Get(`/events`),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Context]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "list", null);
__decorate([
    core_1.Get(`/events/:id`),
    core_1.ValidatePathParam('id', { type: 'string' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Context]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "view", null);
__decorate([
    core_1.Post(`/events`),
    core_1.ValidateBody({
        additionalProperties: false,
        properties: {
            name: { type: 'string' },
            location: { type: 'string' },
            description: { type: 'string' },
            organizationId: { type: 'string' },
            userIds: { type: 'array' },
        },
        required: ['name'],
        type: 'object',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Context]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "create", null);
__decorate([
    core_1.Put(`/events/:id`),
    core_1.ValidateBody({
        additionalProperties: false,
        properties: {
            name: { type: 'string' },
            location: { type: 'string' },
            description: { type: 'string' },
            organizationId: { type: 'string' },
            userIds: { type: 'array' },
        },
        required: ['name'],
        type: 'object',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Context]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "update", null);
__decorate([
    core_1.Delete(`/events/:id`),
    core_1.ValidatePathParam('id', { type: 'string' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Context]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "delete", null);
exports.EventController = EventController;
//# sourceMappingURL=event.controller.js.map
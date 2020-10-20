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
class OrganizationController {
    constructor() {
        this.repository = typeorm_1.getRepository(entities_1.Organization);
    }
    async list(ctx) {
        const entityName = 'organizations';
        const query = paginate_1.default(ctx.request.query);
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
            relations: ['owner', 'users', 'events']
        };
        const data = await this.repository.findOne(query);
        if (!data)
            return new core_1.HttpResponseNotFound();
        return new core_1.HttpResponseOK(data);
    }
    async create(ctx) {
        const data = await this.repository.create(ctx.request.body);
        // Update UserIds
        const { userIds } = ctx.request.body;
        if (userIds && userIds.length) {
            data.users = [];
            userIds.forEach(async (id) => {
                const org = await typeorm_1.getRepository(entities_1.User).findOne(id);
                if (org) {
                    data.users.push(org);
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
        // Update UserIds
        const { userIds } = ctx.request.body;
        if (userIds && userIds.length) {
            data.users = [];
            userIds.forEach(async (id) => {
                const org = await typeorm_1.getRepository(entities_1.User).findOne(id);
                if (org) {
                    data.users.push(org);
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
    core_1.Get(`/organizations`),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Context]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "list", null);
__decorate([
    core_1.Get(`/organizations/:id`),
    core_1.ValidatePathParam('id', { type: 'string' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Context]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "view", null);
__decorate([
    core_1.Post(`/organizations`),
    core_1.ValidateBody({
        additionalProperties: false,
        properties: {
            name: { type: 'string' },
            portalName: { type: 'string' },
            website: { type: 'string' },
            timezone: { type: 'string' },
            streetAddress: { type: 'string' },
            streetAddress2: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            postalCode: { type: 'string' },
            country: { type: 'string' },
            phoneNumber: { type: 'string' },
            mobileNumber: { type: 'string' },
            faxNumber: { type: 'string' },
            notes: { type: 'string' },
            billingPrimaryEmail: { type: 'string' },
            billingOrgName: { type: 'string' },
            billingPurchaseOrderNumber: { type: 'string' },
            billingAttentionTo: { type: 'string' },
            billingAddress: { type: 'string' },
            billingAddress2: { type: 'string' },
            billingCity: { type: 'string' },
            billingState: { type: 'string' },
            billingPostalCode: { type: 'string' },
            userIds: { type: 'array' },
        },
        required: ['name', 'portalName', 'timezone'],
        type: 'object',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Context]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "create", null);
__decorate([
    core_1.Put(`/organizations/:id`),
    core_1.ValidateBody({
        additionalProperties: false,
        properties: {
            name: { type: 'string' },
            portalName: { type: 'string' },
            website: { type: 'string' },
            timezone: { type: 'string' },
            streetAddress: { type: 'string' },
            streetAddress2: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            postalCode: { type: 'string' },
            country: { type: 'string' },
            phoneNumber: { type: 'string' },
            mobileNumber: { type: 'string' },
            faxNumber: { type: 'string' },
            notes: { type: 'string' },
            billingPrimaryEmail: { type: 'string' },
            billingOrgName: { type: 'string' },
            billingPurchaseOrderNumber: { type: 'string' },
            billingAttentionTo: { type: 'string' },
            billingAddress: { type: 'string' },
            billingAddress2: { type: 'string' },
            billingCity: { type: 'string' },
            billingState: { type: 'string' },
            billingPostalCode: { type: 'string' },
            userIds: { type: 'array' },
        },
        type: 'object',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Context]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "update", null);
__decorate([
    core_1.Delete(`/organizations/:id`),
    core_1.ValidatePathParam('id', { type: 'string' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Context]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "delete", null);
exports.OrganizationController = OrganizationController;
//# sourceMappingURL=organization.controller.js.map
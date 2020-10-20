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
class SessionController {
    constructor() {
        this.repository = typeorm_1.getRepository(entities_1.Session);
    }
    async list(ctx) {
        const entityName = 'sessions';
        const query = paginate_1.default(ctx.request.query);
        query.relations = ['appointment'];
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
        const data = await this.repository.findOne(ctx.request.params.id);
        if (!data)
            return new core_1.HttpResponseNotFound();
        return new core_1.HttpResponseOK(data);
    }
    async create(ctx) {
        const data = await this.repository.create(ctx.request.body);
        await this.repository.save(data);
        return new core_1.HttpResponseCreated(data);
    }
    async update(ctx) {
        const data = await this.repository.findOne(ctx.request.params.id);
        if (!data)
            return new core_1.HttpResponseNotFound();
        this.repository.merge(data, ctx.request.body);
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
    core_1.Get(`/sessions`),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Context]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "list", null);
__decorate([
    core_1.Get(`/sessions/:id`),
    core_1.ValidatePathParam('id', { type: 'string' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Context]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "view", null);
__decorate([
    core_1.Post(`/sessions`),
    core_1.ValidateBody({
        additionalProperties: false,
        properties: {
            appointmentId: { type: 'string' },
            status: { type: 'string' },
            date: { type: 'string' },
            transcriptReady: { type: 'boolean' },
            transcript: { type: 'string' },
            editedTranscriptReady: { type: 'boolean' },
            editedTranscript: { type: 'string' },
            summaryReady: { type: 'boolean' },
            summary: { type: 'string' },
            audioReady: { type: 'boolean' },
            audioUrl: { type: 'string' },
            staffNotes: { type: 'string' },
            isBilled: { type: 'boolean' },
        },
        required: ['eventId', 'status', 'date'],
        type: 'object',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Context]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "create", null);
__decorate([
    core_1.Put(`/sessions/:id`),
    core_1.ValidateBody({
        additionalProperties: false,
        properties: {
            appointmentId: { type: 'string' },
            status: { type: 'string' },
            date: { type: 'string' },
            transcriptReady: { type: 'boolean' },
            transcript: { type: 'string' },
            editedTranscriptReady: { type: 'boolean' },
            editedTranscript: { type: 'string' },
            summaryReady: { type: 'boolean' },
            summary: { type: 'string' },
            audioReady: { type: 'boolean' },
            audioUrl: { type: 'string' },
            staffNotes: { type: 'string' },
            isBilled: { type: 'boolean' },
        },
        type: 'object',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Context]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "update", null);
__decorate([
    core_1.Delete(`/sessions/:id`),
    core_1.ValidatePathParam('id', { type: 'string' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [core_1.Context]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "delete", null);
exports.SessionController = SessionController;
//# sourceMappingURL=session.controller.js.map
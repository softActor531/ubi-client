// @ts-nocheck

// import {
//   Context,
//   Get,
//   Post,
//   Put,
//   Delete,
//   ValidateBody,
//   ValidatePathParam,
//   HttpResponseOK,
//   HttpResponseCreated,
//   HttpResponseNotFound,
//   HttpResponseNoContent,
// } from '@foal/core'
// import { getRepository } from 'typeorm';

// import paginate, { getRange } from './paginate'
// import { Role } from '../../entities';

// export class RoleController {
//   repository = getRepository(Role)

//   @Get(`/roles`)
//   async list(ctx: Context) {
//     const entityName = 'roles'
//     const query = paginate(ctx.request.query)
//     const [data, total] = await this.repository.findAndCount(query)
//     const response = new HttpResponseOK(data)

//     const [from, to] = getRange(ctx.request.query.range)

//     if (typeof from === 'number' && typeof to === 'number') {
//       response.setHeader('Access-Control-Expose-Headers', 'Content-Range')
//       response.setHeader('Access-Control-Allow-Credentials', 'true')
//       response.setHeader('Content-Range', `${entityName} ${from}-${to}/${total}`)
//     }

//     return response
//   }

//   @Get(`/roles/:id`)
//   @ValidatePathParam('id', { type: 'string' })
//   async view(ctx: Context) {
//     const data = await this.repository.findOne(ctx.request.params.id)
//     if (!data) return new HttpResponseNotFound()
//     return new HttpResponseOK(data)
//   }

//   @Post(`/roles`)
//   @ValidateBody({
//     additionalProperties: false,
//     properties: {
//       type: { type: 'string' },
//     },
//     required: [ 'type' ],
//     type: 'object',
//   })
//   async create(ctx: Context) {
//     const data = await this.repository.create(ctx.request.body)
//     await this.repository.save(data)
//     return new HttpResponseCreated(data)
//   }

//   @Put(`/roles/:id`)
//   @ValidateBody({
//     additionalProperties: false,
//     properties: {
//       type: { type: 'string' },
//     },
//     required: [ 'type' ],
//     type: 'object',
//   })
//   async update(ctx: Context) {
//     const data = await this.repository.findOne(ctx.request.params.id)
//     if (!data) return new HttpResponseNotFound()
//     this.repository.merge(data, ctx.request.body)
//     await this.repository.save(data)
//     return new HttpResponseOK(data)
//   }

//   @Delete(`/roles/:id`)
//   @ValidatePathParam('id', { type: 'string' })
//   async delete(ctx: Context) {
//     const data = await this.repository.findOne(ctx.request.params.id)
//     if (!data) return new HttpResponseNotFound()
//     await this.repository.remove(data)
//     return new HttpResponseNoContent()
//   }
// }

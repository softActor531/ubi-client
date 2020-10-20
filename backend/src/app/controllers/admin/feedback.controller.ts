import {
  Context,
  Get,
  Post,
  Put,
  Delete,
  ValidateBody,
  ValidatePathParam,
  HttpResponseOK,
  HttpResponseCreated,
  HttpResponseNotFound,
  HttpResponseNoContent,
} from '@foal/core'
import { getRepository } from 'typeorm';

import paginate, { getRange } from './paginate'
import { Feedback } from '../../entities';

export class FeedbackController {
  repository = getRepository(Feedback)

  @Get(`/feedbacks`)
  async list(ctx: Context) {
    const entityName = 'feedbacks'
    const query = paginate(ctx.request.query)
    query.relations = ['session']
    const [data, total] = await this.repository.findAndCount(query)
    const response = new HttpResponseOK(data)

    const [from, to] = getRange(ctx.request.query.range)

    if (typeof from === 'number' && typeof to === 'number') {
      response.setHeader('Access-Control-Expose-Headers', 'Content-Range')
      response.setHeader('Access-Control-Allow-Credentials', 'true')
      response.setHeader('Content-Range', `${entityName} ${from}-${to}/${total}`)
    }

    return response
  }

  @Get(`/feedbacks/:id`)
  @ValidatePathParam('id', { type: 'string' })
  async view(ctx: Context) {
    const data = await this.repository.findOne(ctx.request.params.id)
    if (!data) return new HttpResponseNotFound()
    return new HttpResponseOK(data)
  }

  @Post(`/feedbacks`)
  @ValidateBody({
    additionalProperties: false,
    properties: {
      sessionId: { type: 'string' },
      serviceRating: { type: 'number' },
      techRating: { type: 'number' },
      comments: { type: 'string' },
    },
    required: [ 'sessionId', 'comments' ],
    type: 'object',
  })
  async create(ctx: Context) {
    const data = await this.repository.create(ctx.request.body)
    await this.repository.save(data)
    return new HttpResponseCreated(data)
  }

  @Put(`/feedbacks/:id`)
  @ValidateBody({
    additionalProperties: false,
    properties: {
      sessionId: { type: 'string' },
      serviceRating: { type: 'number' },
      techRating: { type: 'number' },
      comments: { type: 'string' },
    },
    required: [ 'sessionId', 'comments' ],
    type: 'object',
  })
  async update(ctx: Context) {
    const data = await this.repository.findOne(ctx.request.params.id)
    if (!data) return new HttpResponseNotFound()
    this.repository.merge(data, ctx.request.body)
    await this.repository.save(data)
    return new HttpResponseOK(data)
  }

  @Delete(`/feedbacks/:id`)
  @ValidatePathParam('id', { type: 'string' })
  async delete(ctx: Context) {
    const data = await this.repository.findOne(ctx.request.params.id)
    if (!data) return new HttpResponseNotFound()
    await this.repository.remove(data)
    return new HttpResponseNoContent()
  }
}

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
import { Session } from '../../entities';

export class SessionController {
  repository = getRepository(Session)

  @Get(`/sessions`)
  async list(ctx: Context) {
    const entityName = 'sessions'
    const query = paginate(ctx.request.query)
    query.relations = ['appointment']
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

  @Get(`/sessions/:id`)
  @ValidatePathParam('id', { type: 'string' })
  async view(ctx: Context) {
    const data = await this.repository.findOne(ctx.request.params.id)
    if (!data) return new HttpResponseNotFound()
    return new HttpResponseOK(data)
  }

  @Post(`/sessions`)
  @ValidateBody({
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
    required: [ 'eventId', 'status', 'date' ],
    type: 'object',
  })
  async create(ctx: Context) {
    const data = await this.repository.create(ctx.request.body)
    await this.repository.save(data)
    return new HttpResponseCreated(data)
  }

  @Put(`/sessions/:id`)
  @ValidateBody({
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
  })
  async update(ctx: Context) {
    const data = await this.repository.findOne(ctx.request.params.id)
    if (!data) return new HttpResponseNotFound()
    this.repository.merge(data, ctx.request.body)
    await this.repository.save(data)
    return new HttpResponseOK(data)
  }

  @Delete(`/sessions/:id`)
  @ValidatePathParam('id', { type: 'string' })
  async delete(ctx: Context) {
    const data = await this.repository.findOne(ctx.request.params.id)
    if (!data) return new HttpResponseNotFound()
    await this.repository.remove(data)
    return new HttpResponseNoContent()
  }
}

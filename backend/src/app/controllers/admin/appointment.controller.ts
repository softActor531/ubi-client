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
import { Appointment } from '../../entities';

export class AppointmentController {
  repository = getRepository(Appointment)

  @Get(`/appointments`)
  async list(ctx: Context) {
    const entityName = 'appointments'
    const query = paginate(ctx.request.query)
    query.relations = ['event']
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

  @Get(`/appointments/:id`)
  @ValidatePathParam('id', { type: 'string' })
  async view(ctx: Context) {
    const data = await this.repository.findOne(ctx.request.params.id)
    if (!data) return new HttpResponseNotFound()
    return new HttpResponseOK(data)
  }

  @Post(`/appointments`)
  @ValidateBody({
    additionalProperties: false,
    properties: {
      eventId: { type: 'string' },
      userIds: { type: 'array' },
      startDate: { type: 'string' },
      endDate: { type: 'string' },
      title: { type: 'string' },
      allDay: { type: 'boolean' },
      rrule: { type: 'string' },
      exDate: { type: 'string' },
      notes: { type: 'string' },
      timezone: { type: 'string' },
    },
    required: [ 'eventId', 'startDate' ],
    type: 'object',
  })
  async create(ctx: Context) {
    const data = await this.repository.create(ctx.request.body)
    await this.repository.save(data)
    return new HttpResponseCreated(data)
  }

  @Put(`/appointments/:id`)
  @ValidateBody({
    additionalProperties: false,
    properties: {
      eventId: { type: 'string' },
      userIds: { type: 'array' },
      startDate: { type: 'string' },
      endDate: { type: 'string' },
      title: { type: 'string' },
      allDay: { type: 'boolean' },
      rrule: { type: 'string' },
      exDate: { type: 'string' },
      notes: { type: 'string' },
      timezone: { type: 'string' },
    },
    required: [ 'eventId', 'startDate' ],
    type: 'object',
  })
  async update(ctx: Context) {
    const data = await this.repository.findOne(ctx.request.params.id)
    if (!data) return new HttpResponseNotFound()
    this.repository.merge(data, ctx.request.body)
    await this.repository.save(data)
    return new HttpResponseOK(data)
  }

  @Delete(`/appointments/:id`)
  @ValidatePathParam('id', { type: 'string' })
  async delete(ctx: Context) {
    const data = await this.repository.findOne(ctx.request.params.id)
    if (!data) return new HttpResponseNotFound()
    await this.repository.remove(data)
    return new HttpResponseNoContent()
  }
}

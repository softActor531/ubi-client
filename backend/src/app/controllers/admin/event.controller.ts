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
import { Event } from '../../entities';
import { User } from '../../entities';
import { Organization } from '../../entities';

export class EventController {
  repository = getRepository(Event)

  @Get(`/events`)
  async list(ctx: Context) {
    const entityName = 'events'
    const query = paginate(ctx.request.query)
    query.relations = ['organization']
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

  @Get(`/events/:id`)
  @ValidatePathParam('id', { type: 'string' })
  async view(ctx: Context) {
    const query = {
      id: ctx.request.params.id,
      relations: ['organization']
    }
    const data = await this.repository.findOne(query)
    if (!data) return new HttpResponseNotFound()
    return new HttpResponseOK(data)
  }

  @Post(`/events`)
  @ValidateBody({
    additionalProperties: false,
    properties: {
      name: { type: 'string' },
      location: { type: 'string' },
      description: { type: 'string' },
      organizationId: { type: 'string'},
      userIds: { type: 'array'},
    },
    required: [ 'name' ],
    type: 'object',
  })
  async create(ctx: Context) {
    const data = await this.repository.create(ctx.request.body) as unknown as Event

    const { organizationId, userIds } = ctx.request.body

    // Update Organization
    if (organizationId) {
      const org = await getRepository(Organization).findOne(organizationId)
      if (org) data.organization = org
    }

    // Update Users
    if (userIds && userIds.length) {
      data.users = []
      userIds.forEach(async id => {
        const user = await getRepository(User).findOne(id)
        if (user) {
          data.users.push(user)
        }
      })
    } else {
      data.users = []
    }

    await this.repository.save(data)
    return new HttpResponseCreated(data)
  }

  @Put(`/events/:id`)
  @ValidateBody({
    additionalProperties: false,
    properties: {
      name: { type: 'string' },
      location: { type: 'string' },
      description: { type: 'string' },
      organizationId: { type: 'string' },
      userIds: { type: 'array'},
    },
    required: [ 'name' ],
    type: 'object',
  })
  async update(ctx: Context) {
    const data = await this.repository.findOne(ctx.request.params.id)
    if (!data) return new HttpResponseNotFound()
    this.repository.merge(data, ctx.request.body)

    const { organizationId, userIds } = ctx.request.body

    // Update Organization
    if (organizationId) {
      const org = await getRepository(Organization).findOne(organizationId)
      if (org) data.organization = org
    }

    // Update Users
    if (userIds && userIds.length) {
      data.users = []
      userIds.forEach(async id => {
        const user = await getRepository(User).findOne(id)
        if (user) {
          data.users.push(user)
        }
      })
    } else {
      data.users = []
    }

    await this.repository.save(data)
    return new HttpResponseOK(data)
  }

  @Delete(`/events/:id`)
  @ValidatePathParam('id', { type: 'string' })
  async delete(ctx: Context) {
    const data = await this.repository.findOne(ctx.request.params.id)
    if (!data) return new HttpResponseNotFound()
    await this.repository.remove(data)
    return new HttpResponseNoContent()
  }
}

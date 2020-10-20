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
import { getRepository } from 'typeorm'

import paginate, { getRange } from './paginate'
import { Organization, User } from '../../entities'

export class OrganizationController {
  repository = getRepository(Organization)

  @Get(`/organizations`)
  async list(ctx: Context) {
    const entityName = 'organizations'
    const query = paginate(ctx.request.query)
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

  @Get(`/organizations/:id`)
  @ValidatePathParam('id', { type: 'string' })
  async view(ctx: Context) {
    const query = {
      id: ctx.request.params.id,
      relations: ['owner', 'users', 'events']
    }
    const data = await this.repository.findOne(query)
    if (!data) return new HttpResponseNotFound()
    return new HttpResponseOK(data)
  }

  @Post(`/organizations`)
  @ValidateBody({
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
      userIds: { type: 'array'},
    },
    required: [ 'name', 'portalName', 'timezone' ],
    type: 'object',
  })
  async create(ctx: Context) {
    const data = await this.repository.create(ctx.request.body) as unknown as Organization

    // Update UserIds
    const { userIds } = ctx.request.body
    if (userIds && userIds.length) {
      data.users = []
      userIds.forEach(async id => {
        const org = await getRepository(User).findOne(id)
        if (org) {
          data.users.push(org)
        }
      })
    } else {
      data.users = []
    }

    await this.repository.save(data)
    return new HttpResponseCreated(data)
  }

  @Put(`/organizations/:id`)
  @ValidateBody({
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
      userIds: { type: 'array'},
    },
    type: 'object',
  })
  async update(ctx: Context) {
    const data = await this.repository.findOne(ctx.request.params.id)
    if (!data) return new HttpResponseNotFound()
    this.repository.merge(data, ctx.request.body)

    // Update UserIds
    const { userIds } = ctx.request.body
    if (userIds && userIds.length) {
      data.users = []
      userIds.forEach(async id => {
        const org = await getRepository(User).findOne(id)
        if (org) {
          data.users.push(org)
        }
      })
    } else {
      data.users = []
    }

    await this.repository.save(data)
    return new HttpResponseOK(data)
  }

  @Delete(`/organizations/:id`)
  @ValidatePathParam('id', { type: 'string' })
  async delete(ctx: Context) {
    const data = await this.repository.findOne(ctx.request.params.id)
    if (!data) return new HttpResponseNotFound()
    await this.repository.remove(data)
    return new HttpResponseNoContent()
  }
}

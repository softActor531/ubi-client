import { Context, controller, createHttpResponseFile, Get, HttpResponseNotFound } from '@foal/core';

import { ApiController, AuthController } from './controllers';

export class AppController {
  subControllers = [
    controller('/api', ApiController),
    controller('/auth', AuthController)
  ];

  @Get('*')
  renderApp(ctx: Context) {
    if (!ctx.request.accepts('html')) {
      return new HttpResponseNotFound();
    }

    return createHttpResponseFile({
      directory: `${__dirname}/../../../portal/build`,
      file: 'index.html'
    });
    // OR render('./templates/index.html');
  }
}

import {
  Context,
  Options,
  Hook,
  dependency,
  controller,
  Get,
  Post,
  ValidateBody,
  HttpResponseOK,
  HttpResponseCreated,
  HttpResponseNoContent,
  TokenRequired,
} from "@foal/core";
import { TypeORMStore } from "@foal/typeorm";
import {
  UserController,
  OrganizationController,
  EventController,
  AppointmentController,
  FeedbackController,
  SessionController,
} from "./admin";

import { TwilioApi } from "../services";
import { createDoc } from "../../share";

@Hook(() => (response) => {
  // Every response of this controller and its sub-controllers will be added this header.
  response.setHeader("Access-Control-Allow-Origin", "*");
})
export class ApiController {
  subControllers = [
    controller("/admin", UserController),
    controller("/admin", OrganizationController),
    controller("/admin", EventController),
    controller("/admin", AppointmentController),
    controller("/admin", SessionController),
    controller("/admin", FeedbackController),
  ];

  @Options("*")
  options(ctx: Context) {
    const response = new HttpResponseNoContent();
    response.setHeader(
      "Access-Control-Allow-Methods",
      "HEAD, GET, POST, PUT, PATCH, DELETE"
    );
    // You may need to allow other headers depending on what you need.
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return response;
  }

  @dependency
  twilioApi: TwilioApi;

  @Get("/")
  index(ctx: Context) {
    console.log("index");
    return new HttpResponseOK("Hello world!");
  }

  @Post("/rooms")
  createRoom(ctx: Context) {
    // console.log(body)
    // const body = ctx.request.body;
    // Do something.
    return new HttpResponseCreated();
    // return new HttpResponseOK('Created!');
  }

  @Get("/rooms/:id")
  getRoom(ctx: Context) {
    // const productId = ctx.request.params.id;
    // Do something.
    return new HttpResponseOK("Hello world!");
  }

  @Post("/rooms/token")
  @ValidateBody({
    additionalProperties: false,
    properties: {
      userName: { type: "string" },
      roomName: { type: "string" },
    },
    required: ["userName", "roomName"],
    type: "object",
  })
  createRoomToken(ctx: Context) {
    const body = ctx.request.body;
    createDoc(body.roomName);
    const resp = this.twilioApi.getRoomToken(body.roomName, body.userName);
    return new HttpResponseOK(resp);
  }

  @Post("/testText")
  @TokenRequired({
    cookie: true,
    extendLifeTimeOrUpdate: true,
    store: TypeORMStore,
    redirectTo: "/login",
  })
  async sendText(ctx: Context) {
    return new HttpResponseOK({
      TestResult: "This is for a test",
    });
  }
}

import {
  hashPassword,
  HttpResponseNoContent,
  Context,
  dependency,
  Get,
  Post,
  Session,
  TokenRequired,
  ValidateBody,
  setSessionCookie,
  HttpResponseUnauthorized,
  HttpResponseOK,
  verifyPassword,
  removeSessionCookie,
  SessionStore,
} from "@foal/core";
import { TypeORMStore } from "@foal/typeorm";
import { getRepository } from "typeorm";
import { User } from "../entities";
// ... to complete

const credentialsSchema = {
  additionalProperties: false,
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string" },
    rememberMe: { type: "boolean" },
  },
  required: ["email", "password", "rememberMe"],
  type: "object",
};

export class AuthController {
  @dependency
  store: TypeORMStore;

  @Post("/signup")
  @ValidateBody(credentialsSchema)
  async signup(ctx: Context) {
    const user = new User();
    user.email = ctx.request.body.email;
    user.passwordHash = await hashPassword(ctx.request.body.password);
    await getRepository(User).save(user);

    const session = await this.store.createAndSaveSessionFromUser(user);
    const response = new HttpResponseOK({
      userRole: user.role,
      credentials: "include",
    });
    const token = session.getToken();
    setSessionCookie(response, token);
    return response;
  }

  @Post("/login")
  @ValidateBody(credentialsSchema)
  async login(ctx: Context) {
    const user = await User.authenticate(
      ctx.request.body.email,
      ctx.request.body.password
    );

    if (!user) {
      return new HttpResponseUnauthorized();
    }

    const response = new HttpResponseOK({
      role: user.role,
      name: user.firstName + " " + user.lastName,
      email: user.email,
    });
    const session = await this.store.createAndSaveSessionFromUser(user);
    session.set("expirationTimeouts", 130 * 86400);
    const token = session.getToken();
    console.log("token: ", session, token, session.getContent());
    setSessionCookie(response, token);

    return response;
  }

  @Post("/logout")
  @TokenRequired({
    cookie: true,
    extendLifeTimeOrUpdate: false,
    store: TypeORMStore,
  })
  async logout(ctx: Context<any, Session>) {
    const response = new HttpResponseNoContent();
    try {
      await this.store.destroy(ctx.session.sessionID);
      removeSessionCookie(response);
    } catch (err) {
      console.log("session clear error: ", err);
    }
    return response;
  }
}

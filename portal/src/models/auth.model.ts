import { Action, action, Thunk, thunk } from "easy-peasy";

export interface AuthApiModel {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthModel {
  userName: string;
  userMail: string;
  userPassword: string;
  token: string;
  userRole: string;
  rememberMe: boolean;
  isInvalid: boolean;
  setToken: Action<AuthModel, string>;
  setUserRole: Action<AuthModel, string>;
  setUserMail: Action<AuthModel, string>;
  setUserName: Action<AuthModel, string>;
  setUserPassword: Action<AuthModel, string>;
  setRemeber: Action<AuthModel, boolean>;
  logIn: Thunk<AuthModel, AuthApiModel>;
  logOut: Thunk<AuthModel>;
  setErrMsg: Action<AuthModel, boolean>;
  authenticate: Thunk<AuthModel>;
}

const auth: AuthModel = {
  userName: "",
  userMail: "",
  token: "",
  userRole: "",
  userPassword: "",
  rememberMe: false,
  isInvalid: false,

  setToken: action((state, token) => {
    state.token = token;
  }),

  setUserRole: action((state, role) => {
    state.userRole = role;
  }),

  setUserMail: action((state, mail) => {
    state.userMail = mail;
  }),

  setUserName: action((state, username) => {
    state.userName = username;
  }),

  setUserPassword: action((state, password) => {
    state.userPassword = password;
  }),

  setRemeber: action((state, checked) => {
    state.rememberMe = checked;
  }),

  setErrMsg: action((state, status) => {
    state.isInvalid = status;
  }),

  logIn: thunk(async (actions, data) => {
    fetch(`http://localhost:3001/auth/login`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response
        .json()
        .then((body) => {
          const token = document.cookie.split("=")[1];
          actions.setToken(token);
          actions.setUserMail(body["email"]);
          actions.setUserName(body["name"]);
          actions.setUserRole(body["role"]);
          actions.setErrMsg(false);
        })
        .catch(() => {
          actions.setErrMsg(true);
        });
    });
  }),

  logOut: thunk(async (actions) => {
    fetch(`http://localhost:3001/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        actions.setUserMail("");
        actions.setUserName("");
        actions.setUserRole("");
        actions.setToken("");
        actions.setUserPassword("");
        actions.setErrMsg(false);
      })
      .catch((err) => console.log(err));
  }),

  authenticate: thunk(async (actions) => {
    console.log("authenticate");
    const token = document.cookie.split("=")[1];
    actions.setToken(token);
  }),
};

export default auth;

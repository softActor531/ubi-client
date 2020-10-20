import { Action, action, Thunk, thunk } from 'easy-peasy';

export interface UserApiModel {
  email: string;
  password: string;
}

export interface UserModel {
  email: string;
  password: string;
  token: string;
  fontSize: string;
  isLoading: boolean;
  autoScroll: boolean;
  setIsLoading: Action<UserModel, boolean>;
  setAutoScroll: Action<UserModel, boolean>;
  setFontSize: Action<UserModel, string>;
  setEmail: Action<UserModel, string>;
  setPassword: Action<UserModel, string>;
  setToken: Action<UserModel, string>;
  leaveMeeting: Action<UserModel>;
  // reset: Action<UserModel>;
  getToken: Thunk<UserModel, UserApiModel>;
};

const user: UserModel = {
  email: '',
  password: '',
  token: '',
  fontSize: 'md',
  isLoading: false,
  autoScroll: true,
  setIsLoading: action((state, boolean) => {
    if (boolean) {
      state.isLoading = boolean
    } else {
      state.isLoading = !state.isLoading
    }
  }),
  setAutoScroll: action((state, boolean) => {
    state.autoScroll = boolean
  }),
  setFontSize: action((state, size) => {
    state.fontSize = size;
  }),
  setEmail: action((state, email) => {
    state.email = email;
  }),
  setPassword: action((state, password) => {
    state.password = password;
  }),
  setToken: action((state, token) => {
    state.token = token;
  }),
  leaveMeeting: action((state) => {
    // @ts-ignore
    const user = window.twilioUser
    if (user) {
      user.disconnect();
    }
    state.password = state.token = '';
    document.location.href = '/'
  }),
  // reset: action(state => {
  //   state.id = state.token = ''
  // }),
  getToken: thunk(async (actions, data) => {
    actions.setIsLoading(true)
    // /users/:userId/token
    // const response = await fetch(`http://localhost:3001/api/users/token`, {
      const response = await fetch(`/api/users/token`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const body = await response.json()
    console.log(body)
    actions.setToken(body.token)
    actions.setIsLoading(false)
  }),
};

export default user;

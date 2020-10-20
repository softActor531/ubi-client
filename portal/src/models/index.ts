import auth, { AuthModel } from './auth.model';

export interface StoreModel {
  auth: AuthModel;
};

const model: StoreModel = {
  auth,
};

export default model;

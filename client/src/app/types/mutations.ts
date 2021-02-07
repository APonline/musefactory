import { User } from './user';


export interface Mutation {
  CreateUser: User;
  DeleteUser: User;
  UploadFiles?: any[];
  UploadFile?: any[];
}

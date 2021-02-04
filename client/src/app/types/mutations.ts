import { User } from './user';


export interface Mutation {
  MergeUser: User;
  DeleteUser: User;
  UploadFiles?: any[];
  UploadFile?: any[];
}

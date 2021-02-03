import { User } from './user';


export interface Mutation {
  MergeUser: User;
  MergeUserSub: User;
  DeleteUser: User;
  UploadFiles?: any[];
  UploadFile?: any[];
}

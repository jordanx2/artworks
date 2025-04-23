import { LoginDetailsDomain } from "../../components/login-form/login-form.const";

export interface loginOrCreateUserResponse {
  message: string;
  user: LoginDetailsDomain;
}
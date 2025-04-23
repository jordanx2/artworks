import { LoginFormFormik } from '../../components/login-form/login-form.const';
import baseApiAxios from '../base-axios-api/base-axios-api';
import { loginOrCreateUserResponse } from './login-api.model';

const ENDPOINT = 'login';

// Get all artworks
export const loginOrCreateUser = async (submission: LoginFormFormik) => {
  const response = await baseApiAxios.post<loginOrCreateUserResponse>(ENDPOINT, submission);

  return response.data;
};


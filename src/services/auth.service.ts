import { api } from './api';

export interface LoginRequestDTO {
  username: string;
  password: string;
}

export interface LoginResponseDTO {
  id: number;
  username: string;
  role: string;
  name?: string;
  registration?: string;
  urlImage?: string;
}

export const authService = {
  login(data: LoginRequestDTO) {
    return api.post<LoginResponseDTO>('/auth/login', data);
  },
};

import { api } from './api';

export interface AccountRequestDTO {
  username: string;
  password: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
}

export interface AccountResponseDTO {
  id: number;
  username: string;
  role: string;
}

export const accountService = {
  findAll() {
    return api.get<AccountResponseDTO[]>('/accounts');
  },

  findById(id: number) {
    return api.get<AccountResponseDTO>(`/accounts/${id}`);
  },

  delete(id: number) {
    return api.delete(`/accounts/${id}`).then(() => undefined);
  },
};

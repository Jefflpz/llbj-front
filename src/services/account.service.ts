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
    return api.get<AccountResponseDTO[]>('/accounts').then((r) => r.data);
  },

  findById(id: number) {
    return api.get<AccountResponseDTO>(`/accounts/${id}`).then((r) => r.data);
  },

  create(data: AccountRequestDTO) {
    return api.post<AccountResponseDTO>('/accounts', data).then((r) => r.data);
  },
};

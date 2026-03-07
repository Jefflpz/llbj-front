import {api} from "./api.ts";

interface Teacher {
  urlImage: string;
  name: string;
  email: string;
  registration: string;
  subject: string;
  status: 'Ativo' | 'Inativo';
}

const mockTeachers: Teacher[] = [
  {
    urlImage: 'https://randomuser.me/api/portraits/women/1.jpg',
    name: 'Ana Souza',
    email: 'ana.souza@escola.com',
    registration: 'T001',
    subject: 'Matemática',
    status: 'Ativo',
  },
  {
    urlImage: 'https://randomuser.me/api/portraits/men/2.jpg',
    name: 'Carlos Mendes',
    email: 'carlos.mendes@escola.com',
    registration: 'T002',
    subject: 'História',
    status: 'Ativo',
  },
  {
    urlImage: 'https://randomuser.me/api/portraits/women/3.jpg',
    name: 'Fernanda Lima',
    email: 'fernanda.lima@escola.com',
    registration: 'T003',
    subject: 'Português',
    status: 'Inativo',
  },
  {
    urlImage: 'https://randomuser.me/api/portraits/men/4.jpg',
    name: 'Ricardo Alves',
    email: 'ricardo.alves@escola.com',
    registration: 'T004',
    subject: 'Geografia',
    status: 'Ativo',
  },
  {
    urlImage: 'https://randomuser.me/api/portraits/women/5.jpg',
    name: 'Juliana Rocha',
    email: 'juliana.rocha@escola.com',
    registration: 'T005',
    subject: 'Biologia',
    status: 'Ativo',
  },
  {
    urlImage: 'https://randomuser.me/api/portraits/men/6.jpg',
    name: 'Bruno Martins',
    email: 'bruno.martins@escola.com',
    registration: 'T006',
    subject: 'Física',
    status: 'Inativo',
  },
  {
    urlImage: 'https://randomuser.me/api/portraits/women/7.jpg',
    name: 'Patrícia Gomes',
    email: 'patricia.gomes@escola.com',
    registration: 'T007',
    subject: 'Química',
    status: 'Ativo',
  },
  {
    urlImage: 'https://randomuser.me/api/portraits/men/8.jpg',
    name: 'Eduardo Silva',
    email: 'eduardo.silva@escola.com',
    registration: 'T008',
    subject: 'Educação Física',
    status: 'Ativo',
  },
  {
    urlImage: 'https://randomuser.me/api/portraits/women/9.jpg',
    name: 'Mariana Costa',
    email: 'mariana.costa@escola.com',
    registration: 'T009',
    subject: 'Inglês',
    status: 'Inativo',
  },
  {
    urlImage: 'https://randomuser.me/api/portraits/men/10.jpg',
    name: 'Felipe Andrade',
    email: 'felipe.andrade@escola.com',
    registration: 'T010',
    subject: 'Artes',
    status: 'Ativo',
  },
  {
    urlImage: 'https://randomuser.me/api/portraits/women/11.jpg',
    name: 'Camila Freitas',
    email: 'camila.freitas@escola.com',
    registration: 'T011',
    subject: 'Filosofia',
    status: 'Ativo',
  },
  {
    urlImage: 'https://randomuser.me/api/portraits/men/12.jpg',
    name: 'Gustavo Ribeiro',
    email: 'gustavo.ribeiro@escola.com',
    registration: 'T012',
    subject: 'Sociologia',
    status: 'Ativo',
  },
  {
    urlImage: 'https://randomuser.me/api/portraits/women/13.jpg',
    name: 'Larissa Mendes',
    email: 'larissa.mendes@escola.com',
    registration: 'T013',
    subject: 'Literatura',
    status: 'Inativo',
  },
  {
    urlImage: 'https://randomuser.me/api/portraits/men/14.jpg',
    name: 'Thiago Barros',
    email: 'thiago.barros@escola.com',
    registration: 'T014',
    subject: 'Informática',
    status: 'Ativo',
  },
  {
    urlImage: 'https://randomuser.me/api/portraits/women/15.jpg',
    name: 'Renata Oliveira',
    email: 'renata.oliveira@escola.com',
    registration: 'T015',
    subject: 'Ensino Religioso',
    status: 'Ativo',
  },
];

export const teacherService = {
  findAll: async () => {
    return new Promise<Teacher[]>((resolve) => {
      setTimeout(() => {
        resolve(mockTeachers);
      }, 500);
    });
  },

  findByRegistration: (registration: string) =>
    api.get(`/teachers/${registration}`),
};

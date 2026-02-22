export interface User {
  id: number;
  username: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  studentProfile?: {
    name: string;
    className: string;
    urlImage: string;
  };
}

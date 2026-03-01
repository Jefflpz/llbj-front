import { Sigma, Beaker, Grid3X3, Telescope, Lock } from 'lucide-react';

export const turmasData = [
    {
        id: 1,
        name: '9º Ano A',
        subject: 'Matemática',
        level: 'Avançada',
        students: 32,
        shift: 'Matutino',
        active: true,
        icon: Sigma,
        iconClass: 'icon-badge--blue'
    },
    {
        id: 2,
        name: '1º Ano EM B',
        subject: 'Física',
        level: 'Termodinâmica',
        students: 32,
        shift: 'Matutino',
        active: true,
        icon: Beaker,
        iconClass: 'icon-badge--orange'
    },
    {
        id: 3,
        name: '8º Ano C',
        subject: 'Geometria',
        level: 'Espacial',
        students: 32,
        shift: 'Matutino',
        active: true,
        icon: Grid3X3,
        iconClass: 'icon-badge--purple'
    },
    {
        id: 4,
        name: '3º Ano EM A',
        subject: 'Física Nuclear',
        level: null,
        students: 32,
        shift: 'Matutino',
        active: true,
        icon: Telescope,
        iconClass: 'icon-badge--red'
    },
    {
        id: 5,
        name: '2º Ano EM C',
        subject: 'Mecânica',
        level: 'Clássica',
        students: 0,
        shift: null,
        active: false,
        icon: Lock,
        iconClass: 'icon-badge--gray'
    },
];

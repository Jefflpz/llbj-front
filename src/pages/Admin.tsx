// import '../styles/Admin.css'
// import Sidebar from '../components/Sidebar/Sidebar';
// import Header from '../components/Header/Header';
// import HeaderTable from '../components/Header/HeaderTable';
// import Table from '../components/Table/Table';

// interface Props {
//     content: "professores" | "disciplinas" | "alunos"
// }
// export default function Admin({ content }: Props) {
//     const header = {
//         professores: {
//             image: "/teacher-full.svg",
//             desc: "Ícone professor",
//             title: "Professores"
//         },
//         disciplinas: {
//             image: "/subjects-full.svg",
//             desc: "Ícone disciplina",
//             title: "Disciplinas"
//         },
//         alunos: {
//             image: "/students-full.svg",
//             desc: "Ícone aluno",
//             title: "Alunos"
//         },
//     }
//     return (
//         <div className="admin-page">
//             <div className="admin-card"> 
//                 <Sidebar></Sidebar>
//                 <div className="table">
//                     <Header text1='Seja bem-vindo, Jeff!' text2='Seja bem-vindo à plataforma do Colégio LLBJ!'></Header>
//                     <HeaderTable image={header[content].image} desc={header[content].desc} title={header[content].title}></HeaderTable>
//                     <Table></Table>
//                 </div>
//             </div>
            
//         </div>
//     );
// }
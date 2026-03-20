import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const reportService = {
  generateBoletim: (student: any, subjects: any[], grades: any[]) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Boletim Escolar - Colégio LLBJ', 14, 20);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Aluno: ${student.name}`, 14, 30);
    doc.text(`Turma: ${student.className}`, 14, 35);
    doc.text(
      `Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`,
      14,
      40,
    );

    const tableRows = subjects.map((sub) => {
      const g1 =
        grades.find((g) => g.subjectId === sub.id && g.quarter === 'Q1')
          ?.value || '-';
      const g2 =
        grades.find((g) => g.subjectId === sub.id && g.quarter === 'Q2')
          ?.value || '-';
      const g3 =
        grades.find((g) => g.subjectId === sub.id && g.quarter === 'Q3')
          ?.value || '-';
      const g4 =
        grades.find((g) => g.subjectId === sub.id && g.quarter === 'Q4')
          ?.value || '-';

      const validGrades = [g1, g2, g3, g4].filter((v) => typeof v === 'number');
      const media =
        validGrades.length > 0
          ? (
              validGrades.reduce((a, b) => a + b, 0) / validGrades.length
            ).toFixed(1)
          : '-';

      return [sub.name, sub.teacherName, g1, g2, g3, g4, media];
    });

    autoTable(doc, {
      startY: 50,
      head: [
        ['Disciplina', 'Professor', '1º B', '2º B', '3º B', '4º B', 'Média'],
      ],
      body: tableRows,
      headStyles: { fillColor: [67, 24, 255] },
      theme: 'grid',
    });

    doc.save(`Boletim_${student.name.replace(/\s+/g, '_')}.pdf`);
  },
};

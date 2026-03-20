import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PASSING_GRADE = 6.0;

function getStatus(g: any): string {
  if (g.n1 == null || g.n2 == null || g.n3 == null) return 'Pendente';
  return Number(g.average) >= PASSING_GRADE ? 'Aprovado' : 'Reprovado';
}

function statusColor(status: string): [number, number, number] {
  if (status === 'Aprovado') return [22, 163, 74];
  if (status === 'Reprovado') return [220, 38, 38];
  return [161, 161, 170];
}

export const reportService = {
  generateBoletim: (student: any, grades: any[]) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Boletim Escolar - Colégio LLBJ', 14, 20);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Aluno: ${student.name}`, 14, 30);
    if (student.className) {
      doc.text(`Turma: ${student.className}`, 14, 35);
    }
    doc.text(
      `Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`,
      14,
      student.className ? 40 : 35,
    );

    const tableRows = grades.map((g) => {
      const n1 = g.n1 != null ? Number(g.n1).toFixed(1) : '-';
      const n2 = g.n2 != null ? Number(g.n2).toFixed(1) : '-';
      const n3 = g.n3 != null ? Number(g.n3).toFixed(1) : '-';
      const media = g.average != null ? Number(g.average).toFixed(1) : '-';
      const status = getStatus(g);
      return [g.subjectName, n1, n2, n3, media, status];
    });

    autoTable(doc, {
      startY: student.className ? 50 : 45,
      head: [['Disciplina', 'N1', 'N2', 'N3', 'Média', 'Situação']],
      body: tableRows,
      headStyles: { fillColor: [67, 24, 255] },
      theme: 'grid',
      didDrawCell: (data) => {
        if (data.column.index === 5 && data.section === 'body') {
          const status = String(data.cell.raw);
          const [r, g, b] = statusColor(status);
          data.doc.setTextColor(r, g, b);
          data.doc.setFontSize(data.cell.styles.fontSize ?? 10);
          const x = data.cell.x + data.cell.padding('left');
          const y = data.cell.y + data.cell.height / 2 + 1;
          data.doc.text(status, x, y);
          data.doc.setTextColor(0, 0, 0);
        }
      },
      willDrawCell: (data) => {
        if (data.column.index === 5 && data.section === 'body') {
          data.cell.text = [];
        }
      },
    });

    doc.save(`Boletim_${student.name.replace(/\s+/g, '_')}.pdf`);
  },
};

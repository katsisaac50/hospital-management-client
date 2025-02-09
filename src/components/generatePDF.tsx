import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { calculateAge, formatDate } from '../lib/utils';
import { PDFHelper, PDFSection, Patient } from '../lib/interfaces';

declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => void;
    }
}

declare module 'jspdf' {
    interface jsPDF {
        lastAutoTable?: { finalY: number };
    }
}


(jsPDF as any).prototype.autoTable = autoTable;
(jsPDF as any).prototype.lastAutoTable = autoTable;

class PDFGenerator implements PDFHelper {
    doc: jsPDF;
    pageWidth: number;
    pageHeight: number;
    currentY: number;

    constructor() {
        this.doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        this.pageWidth = this.doc.internal.pageSize.getWidth();
        this.pageHeight = this.doc.internal.pageSize.getHeight();
        this.currentY = 70;
    }

    addHeader(): void {
        const imgData = '/assets/hospital-icon.png';
        const logoWidth = 50;
        const logoHeight = 25;
        const logoX = (this.pageWidth - logoWidth) / 2;

        this.doc.addImage(imgData, 'PNG', logoX, 10, logoWidth, logoHeight);
        this.doc.setFont('helvetica', 'bold').setFontSize(18);
        this.doc.text('Bismillah Medical Center', this.pageWidth / 2, 45, { align: 'center' });
        this.doc.setFont('helvetica', 'normal').setFontSize(12);
        this.doc.text('HEALTHY COMMUNITIES, BRIGHTER FUTURES.', this.pageWidth / 2, 52, { align: 'center' });
        this.doc.text('Contact: 123-456-7890 | Email: info@bismillahmedical.com', this.pageWidth / 2, 57, { align: 'center' });
        this.doc.line(10, 60, 200, 60);
    }

    checkNewPage(neededSpace: number): void {
        if (this.currentY + neededSpace > this.pageHeight - 20) {
            this.doc.addPage();
            this.addHeader();
            this.currentY = 70;
        }
    }

    addText(text: string, yIncrement: number, isSectionHeader: boolean = false): void {
        this.checkNewPage(yIncrement);
        this.doc.setFont('helvetica', isSectionHeader ? 'bold' : 'normal').setFontSize(isSectionHeader ? 14 : 12);
        this.doc.text(text, 10, this.currentY);
        if (isSectionHeader) {
            this.doc.line(10, this.currentY + 2, 200, this.currentY + 2);
        }
        this.currentY += yIncrement;
    }

    addTable(tableData: any[]): void {
        this.checkNewPage(60);
        this.doc.autoTable({
            startY: this.currentY,
            head: [tableData[0]],
            body: tableData.slice(1),
            theme: 'grid',
            margin: { top: 10 },
            columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 40 }, 2: { cellWidth: 60 } },
        });

        if (this.doc.lastAutoTable) {
            this.currentY = this.doc.lastAutoTable.finalY + 10;
        } else {
            // Handle the case when lastAutoTable is undefined
            this.currentY = 10; // Set a default value or handle accordingly
        }
    }

    addSection(section: PDFSection): void {
        this.addText(section.title, 10, true);
        if (Array.isArray(section.content)) {
            section.content.forEach(line => this.addText(line, 8));
        } else {
            this.addText(section.content, 10);
        }
    }
}

const generatePDF = (selectedPatient: Patient, preview = false): void => {
    if (!selectedPatient) return;

    const pdf = new PDFGenerator();
    pdf.addHeader();

    pdf.addSection({
        title: 'Patient Information',
        content: [
            `Name: ${selectedPatient.name}`,
            `Age: ${selectedPatient.age ?? (calculateAge(selectedPatient.dob) || 'N/A')}`,
            `Date of Birth: ${formatDate(selectedPatient.dob)}`,
            `Gender: ${selectedPatient.gender}`,
            `Contact: ${selectedPatient.contact}`,
            `Address: ${selectedPatient.address}`,
            `Emergency Contact: ${selectedPatient.emergencyContact || 'N/A'}`
        ]
    });

    pdf.addSection({
        title: 'Medical Information',
        content: [
            `Physical Examination: ${selectedPatient.physicalExamination || 'N/A'}`,
            `Diagnosis: ${selectedPatient.currentDiagnosis || 'N/A'}`,
            `Treatment: ${selectedPatient.treatment || 'N/A'}`,
            `Medical History: ${selectedPatient.medicalHistory || 'N/A'}`
        ]
    });

    pdf.addSection({
        title: 'Laboratory Information',
        content: ''
    });
    
    const labResults = selectedPatient.laboratoryResults?.map(test => [test.name, test.result, test.reference]) || [['No Test Available', '-', '-']];
    pdf.addTable([['Test Name', 'Result', 'Reference'], ...labResults]);

    pdf.addSection({ title: 'Medication', content: `Current Medications: ${selectedPatient.medications || 'N/A'}` });
    pdf.addSection({ title: 'Allergies', content: `Known Allergies: ${selectedPatient.allergies || 'N/A'}` });
    pdf.addSection({ title: 'Follow-up Instructions', content: `Instructions: ${selectedPatient.followUpInstructions || 'N/A'}` });

    if (preview) {
        pdf.doc.output('dataurlnewwindow');
    } else {
        pdf.doc.save(`${selectedPatient.name}_Medical_Form.pdf`);
    }
};

export default generatePDF;
import { jsPDF } from 'jspdf';

// Interface for PDF helper methods
export interface PDFHelper {
    doc: jsPDF;
    pageWidth: number;
    pageHeight: number;
    currentY: number;
    addHeader(): void;
    checkNewPage(neededSpace: number): void;
    addText(text: string, yIncrement: number, isSectionHeader?: boolean): void;
    addTable(tableData: any[]): void;
    addSection(section: PDFSection): void;
}

// Interface for the PDF section (content type)
export interface PDFSection {
    title: string;
    content: string | string[];
    isWrappedText?: boolean;
}

// Interface for patient data
export interface Patient {
    name: string;
    dob: string;
    age?: number;
    gender: string;
    contact: string;
    address: string;
    emergencyContact?: string;
    physicalExamination?: string;
    currentDiagnosis?: string;
    treatment?: string;
    medicalHistory?: string;
    laboratoryResults?: Array<{ name: string, result: string, reference: string }>;
    medications?: string;
    allergies?: string;
    followUpInstructions?: string;
}

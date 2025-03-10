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
    addTable(tableData: [string | number][][]): void;
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
    _id?: string;
patientID?: string;
}

// Define Product interface
export interface Product {
    _id?: string;
  id?: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  batchNumber?: string;
  }

export interface Test {
        _id: string;
        testName: string;
        category?: string;
    }

    export interface TestResult {
        _id: string;
        testName: string;
        result: string;
        reference: string;
        date: string;
    }
    export interface MedicalTest {
        _id: string;
        patient: string;
        doctor: string;
        date: string;
        testName: string;
        result: string;
        reference: string;
    }

    export interface Prescription {
        _id: string;
        patient: string;
        doctor: string;
        date: string;
        medication: string;
        dosage: string;
        instructions: string;
    }

    export interface Appointment {
        _id: string;
        patient: string;
        doctor: string;
        date: string;
        time: string;
        reason: string;
        status: string;
    }
    export interface Invoice {
        _id: string;
        patient: string;
        doctor: string;
        date: string;
        totalAmount: number;
        items: Array<{ name: string; quantity: number; price: number }>;
    }
    export interface User {
        _id: string;
        name: string;
        email: string;
        role: string;
        password?: string;
        token?: string;
    }
    export interface Inventory {
        _id: string;
        name: string;
        category: string;
        quantity: number;
        price: number;
        batchNumber?: string;
    }
    export interface LabTest {
        _id: string;
        testName: string;
        category?: string;
    }
    export interface LabTestResult {
        _id: string;
        testName: string;
        result: string;
        reference: string;
        date: string;
    }

    export interface TestHistoryParams {
  row: {
    result: string;  // Adjust the type as necessary
    _id: string;     // Adjust the type as necessary
  };
}
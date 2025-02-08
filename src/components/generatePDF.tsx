// generatePDF.js
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // If you are using autoTable
import { calculateAge, formatDate } from '../lib/utils';


const generatePDF = (selectedPatient, preview = false) => { 
    if (!selectedPatient) return;

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentY = 70;

    const addHeader = () => {
        const imgData = "/assets/hospital-icon.png";
        const logoWidth = 50;
        const logoHeight = 25;
        const logoX = (pageWidth - logoWidth) / 2;

        doc.addImage(imgData, "PNG", logoX, 10, logoWidth, logoHeight);

        doc.setFont("helvetica", "bold").setFontSize(18);
        doc.text("Bismillah Medical Center", pageWidth / 2, 45, { align: "center" });

        doc.setFont("helvetica", "normal").setFontSize(12);
        doc.text("HEALTHY COMMUNITIES, BRIGHTER FUTURES.", pageWidth / 2, 52, { align: "center" });
        doc.text("Contact: 123-456-7890 | Email: info@bismillahmedical.com", pageWidth / 2, 57, { align: "center" });

        doc.line(10, 60, 200, 60);
    };

    const checkNewPage = (neededSpace) => {
        if (currentY + neededSpace > pageHeight - 20) {
            doc.addPage();
            addHeader();
            currentY = 70;
        }
    };

    const addContent = (text, yIncrement) => {
        checkNewPage(yIncrement);
        doc.setFont("helvetica", "normal").setFontSize(12);
        doc.text(text, 10, currentY);
        currentY += yIncrement;
    };

    const addSectionHeader = (headerText) => {
        checkNewPage(12);
        doc.setFont("helvetica", "bold").setFontSize(14);
        doc.text(headerText, 10, currentY);
        doc.line(10, currentY + 2, 200, currentY + 2);
        currentY += 10;
    };

    addHeader();

    // 🏥 Patient Information
    addSectionHeader("Patient Information");
    addContent(`Name: ${selectedPatient.name}`, 10);
    addContent(`Age: ${(selectedPatient.age ?? calculateAge(selectedPatient.dob)) || "N/A"}`, 10);
    addContent(`Date of Birth: ${formatDate(selectedPatient.dob)}`, 10);
    addContent(`Gender: ${selectedPatient.gender}`, 10);
    addContent(`Contact: ${selectedPatient.contact}`, 10);
    addContent(`Address: ${selectedPatient.address}`, 10);
    addContent(`Emergency Contact: ${selectedPatient.emergencyContact || "N/A"}`, 10);

    // 🏥 Medical Information
    addSectionHeader("Medical Information");
    addContent(`Physical Examination: ${selectedPatient.physicalExamination || "N/A"}`, 10);
    addContent(`Diagnosis: ${selectedPatient.currentDiagnosis || "N/A"}`, 10);
    addContent(`Treatment: ${selectedPatient.treatment || "N/A"}`, 10);

    // Wrapped Medical History
    const medicalHistory = `Medical History: ${selectedPatient.medicalHistory || "N/A"}`;
    const textLines = doc.splitTextToSize(medicalHistory, 180);
    textLines.forEach(line => addContent(line, 8));

    const estimatedTableHeight = 60; 
    checkNewPage(estimatedTableHeight + 15);

    // 🧪 Laboratory Information
    addSectionHeader("Laboratory Information");

    const tableData = [
        ["Test Name", "Result", "Reference"],
        ...(selectedPatient.laboratoryResults?.map((test) => [
            test.name, test.result, test.reference
        ]) || [
            ["No Test Available", "-", "-"]
        ])
    ];

    doc.autoTable({
        startY: currentY,
        head: [tableData[0]],
        body: tableData.slice(1),
        theme: "grid",
        margin: { top: 10 },
        columnStyles: {
            0: { cellWidth: 60 },
            1: { cellWidth: 40 },
            2: { cellWidth: 60 },
        },
        didDrawPage: () => {
            if (currentY > pageHeight - 60) {
                doc.addPage();
                addHeader();
                currentY = 70;
            }
        }
    });

    currentY = doc.lastAutoTable.finalY + 10;

    // 💊 Medication Section
    addSectionHeader("Medication");
    addContent(`Current Medications: ${selectedPatient.medications || "N/A"}`, 10);

    // 🚨 Allergies
    addSectionHeader("Allergies");
    addContent(`Known Allergies: ${selectedPatient.allergies || "N/A"}`, 10);

    // 📅 Follow-up Instructions
    addSectionHeader("Follow-up Instructions");
    addContent(`Instructions: ${selectedPatient.followUpInstructions || "N/A"}`, 10);

    if (preview) {
        doc.output("dataurlnewwindow");
    } else {
        doc.save(`${selectedPatient.name}_Medical_Form.pdf`);
    }
};

export default generatePDF;

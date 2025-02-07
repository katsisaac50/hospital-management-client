import axios from "axios";
import { useState } from "react";
import * as cookie from "cookie";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useRouter } from "next/router";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getServerSideProps(context: {
  req: { headers: { cookie?: string } };
}) {
  const { req } = context;
  
  // Log the cookie header to check if it's being passed properly
  console.log('Cookies:', req.headers.cookie);

  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie || "") : {};
  const token = cookies.authToken;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const response = await axios.get(`${API_URL}/patients`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { props: { patients: response.data } };
  } catch (error) {
    console.error("Error fetching patients:", error);

    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    return { props: { patients: [] } };
  }
}
interface Patient {
  _id: string;
  name: string;
  dob?: string;
  age?: number;
  gender: string;
  contact: string;
  address: string;
  medicalHistory: string;
  currentDiagnosis: string;
  treatment: string;
  appointments: string[];
  labResults: string[];
  lastVisit: string;
  physicalExamination: string;
  laboratory: string;
}

const calculateAge = (dob?: string): number | null => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return "Not provided";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(date); // e.g., "24 December 2024"
};

const Patients = ({ patients }: { patients: Patient[] }) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Patient>>({});
  const [saving, setSaving] = useState(false); // State for save action
  const [deleting, setDeleting] = useState(false); // State for delete action
  const router = useRouter();

  const handlePatientClick = async (patientId: string) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];

    if (!token) {
      alert(
        "Session expired or you are not logged in. Redirecting to login..."
      );
      window.location.href = "/login";
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/patients/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const patientData = response.data;

      if (!patientData.age) {
        patientData.age = calculateAge(patientData.dob);
      }

      setSelectedPatient(patientData);
      setIsModalOpen(true);
    } catch (error: unknown) {
      console.error("Error fetching patient details:", error);

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert("Session expired. Please log in again.");
        window.location.href = "/login";
      }
    }
  };
  const closeModal = () => {
    setSelectedPatient(null);
    setIsModalOpen(false);
    setIsEditing(false);
    setFormData({});
  };

  const handleEditClick = () => {
    if (selectedPatient) {
      setFormData(selectedPatient);
      setIsEditing(true);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !selectedPatient) return;

    try {
      setSaving(true); // Set saving to true when saving data
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1];
        console.log(formData);
      await axios.put(
        `${API_URL}/patients/${selectedPatient._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Patient updated successfully.");
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error("Error updating patient:", error);
      alert("Failed to update the patient. Please try again.");
    } finally {
      setSaving(false); // Reset saving state after completion
    }
  };
 
  const handleGeneratePDF = () => { 
    if (!selectedPatient) return;

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    // Constants
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentY = 70; // Initial Y position for content

    // Function to add the header
    const addHeader = () => {
        const imgData = "/assets/hospital-icon.png";
        const logoWidth = 50;
        const logoHeight = 25;
        const logoX = (pageWidth - logoWidth) / 2;

        doc.addImage(imgData, "PNG", logoX, 10, logoWidth, logoHeight);

        // Title (Bold)
        doc.setFont("helvetica", "bold").setFontSize(18);
        doc.text("Bismillah Medical Center", pageWidth / 2, 45, { align: "center" });

        // Subtitle (Normal Font)
        doc.setFont("helvetica", "normal").setFontSize(12);
        doc.text("HEALTHY COMMUNITIES, BRIGHTER FUTURES.", pageWidth / 2, 52, { align: "center" });
        doc.text("Contact: 123-456-7890 | Email: info@bismillahmedical.com", pageWidth / 2, 57, { align: "center" });

        doc.line(10, 60, 200, 60);
    };

    // Function to check if we need a new page
    const checkNewPage = (neededSpace: number) => {
        if (currentY + neededSpace > pageHeight - 20) {
            doc.addPage();
            addHeader();
            currentY = 70;
        }
    };

    // Function to add content (Normal Font)
    const addContent = (text: string, yIncrement: number) => {
        checkNewPage(yIncrement);
        doc.setFont("helvetica", "normal").setFontSize(12);
        doc.text(text, 10, currentY);
        currentY += yIncrement;
    };

    // Function to add section headers (Bold Titles)
    const addSectionHeader = (headerText: string) => {
        checkNewPage(12);
        doc.setFont("helvetica", "bold").setFontSize(14);
        doc.text(headerText, 10, currentY);
        doc.line(10, currentY + 2, 200, currentY + 2);
        currentY += 10;
    };

    // Add header to the first page
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

    // 🧪 Laboratory Information
    addSectionHeader("Laboratory Information");
    addContent(`Laboratory Results: ${selectedPatient.laboratory || "N/A"}`, 10);

    // ✅ Check space before adding the table
    checkNewPage(50);

    // 🏥 Table Data
    const tableData = [
        ["Test Name", "Result", "Reference"],
        ["Blood Pressure", selectedPatient.bloodPressure || "N/A", "120/80 mmHg"],
        ["Heart Rate", selectedPatient.heartRate || "N/A", "60-100 bpm"],
        ["Blood Sugar", selectedPatient.bloodSugar || "N/A", "70-140 mg/dL"],
    ];

    doc.autoTable({
        startY: currentY + 10,
        head: [tableData[0]],
        body: tableData.slice(1),
        theme: "grid",
        margin: { top: 10 },
    });

    // Update currentY after table
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

    // ✅ Save the PDF
    doc.save(`${selectedPatient.name}_Medical_Form.pdf`);
};
  
  const handleDeleteClick = async () => {
    if (!selectedPatient) return;
    const confirmation = confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmation) return;

    try {
      setDeleting(true); // Set deleting to true when deleting data
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1];

      await axios.delete(
        `${API_URL}/patients/${selectedPatient._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Patient deleted successfully.");
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert("Failed to delete the patient. Please try again.");
    } finally {
      setDeleting(false); // Reset deleting state after completion
    }
  };

  const navigateToAddPatient = () => {
    router.push("/add-patient");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center py-8 px-4">
      <div className="max-w-6xl w-full bg-white shadow-2xl rounded-lg p-6">
        <h3 className="text-4xl font-semibold text-center text-blue-700 py-4">
          Patients Dashboard
        </h3>
        <div className="flex justify-between mb-6">
          <input
            type="text"
            placeholder="Search by Name or ID"
            className="border rounded-lg px-4 py-2 w-1/3 shadow-sm focus:outline-blue-500"
          />
          <select className="border rounded-lg px-4 py-2 shadow-sm focus:outline-blue-500">
            <option value="">Filter by Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <button
            onClick={navigateToAddPatient}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 shadow-lg transition"
          >
            Add New Patient
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <div
              key={patient._id}
              className="bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-md p-5 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={() => handlePatientClick(patient._id)}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xl font-semibold text-gray-800">
                  {patient.name}
                </span>
                <span className="text-gray-500">
                  {patient.age ?? calculateAge(patient.dob)} years
                </span>
              </div>
              <p className="text-gray-700 mb-2">{patient.contact}</p>
              <p className="text-gray-500 text-sm">{patient.gender}</p>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl w-11/12 max-w-4xl p-8 relative animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              onClick={closeModal}
            >
              ✕
            </button>
            <h4 className="text-3xl font-semibold text-center text-blue-700 mb-4">
              {isEditing ? "Edit Patient Details" : "Patient Profile"}
            </h4>
            {!isEditing ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <p>
                    <strong>Name:</strong> {selectedPatient.name}
                  </p>
                  <p>
                    <strong>Age:</strong>{" "}
                    {(selectedPatient.age ??
                      calculateAge(selectedPatient.dob)) ||
                      "Not provided"}
                  </p>
                  <p>
                    <strong>Date of Birth:</strong>{" "}
                    {formatDate(selectedPatient.dob) || "Not provided"}
                  </p>
                  <p>
                    <strong>Contact:</strong> {selectedPatient.contact}
                  </p>
                  <p>
                    <strong>Gender:</strong> {selectedPatient.gender}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedPatient.address}
                  </p>
                  <p>
                    <strong>Physical Examination:</strong>{" "}
                    {selectedPatient.physicalExamination || "No data available"}
                  </p>
                  <p>
                    <strong>Laboratory:</strong>{" "}
                    {selectedPatient.laboratory || "No data available"}
                  </p>
                  <p>
                    <strong>Diagnosis:</strong>{" "}
                    {selectedPatient.currentDiagnosis || "No data available"}
                  </p>
                  <p>
                    <strong>Treatment:</strong>{" "}
                    {selectedPatient.treatment || "No data available"}
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleFormSubmit}
                className="grid grid-cols-1 gap-4"
              >
                <div className="max-h-[70vh] overflow-y-auto">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                      name="name"
                      value={formData.name || ""}
                      onChange={handleFormChange}
                      className="w-full border rounded-lg px-4 py-2 shadow-sm"
                    />
                  </div>

                  {/* Date of Birth Field */}
                  <div>
                    <label className="block text-sm font-medium">
                      Date of Birth
                    </label>
                    <input
                      name="dob"
                      type="date"
                      value={formData.dob || ""}
                      onChange={handleFormChange}
                      className="w-full border rounded-lg px-4 py-2 shadow-sm"
                    />
                  </div>

                  {/* Contact Field */}
                  <div>
                    <label className="block text-sm font-medium">Contact</label>
                    <input
                      name="contact"
                      value={formData.contact || ""}
                      onChange={handleFormChange}
                      className="w-full border rounded-lg px-4 py-2 shadow-sm"
                    />
                  </div>

                  {/* Address Field */}
                  <div>
                    <label className="block text-sm font-medium">Address</label>
                    <textarea
                      name="address"
                      value={formData.address || ""}
                      onChange={handleFormChange}
                      className="w-full border rounded-lg px-4 py-2 shadow-sm"
                    />
                  </div>

                  {/* Gender Field */}
                  <div>
                    <label className="block text-sm font-medium">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender || ""}
                      onChange={(e) =>
                        handleFormChange(
                          e as unknown as React.ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                          >
                        )
                      }
                      className="w-full border rounded-lg px-4 py-2 shadow-sm"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  {/* Medical History Field */}
                  <div>
                    <label className="block text-sm font-medium">
                      Medical History
                    </label>
                    <textarea
                      name="medicalHistory"
                      value={formData.medicalHistory || ""}
                      onChange={handleFormChange}
                      className="w-full border rounded-lg px-4 py-2 shadow-sm"
                    />
                  </div>

                  {/* Current Diagnosis Field */}
                  <div>
                    <label className="block text-sm font-medium">Diagnosis</label>
                    <input
                      name="currentDiagnosis"
                      value={formData.currentDiagnosis || ""}
                      onChange={handleFormChange}
                      className="w-full border rounded-lg px-4 py-2 shadow-sm"
                    />
                  </div>

                  {/* Treatment Field */}
                  <div>
                    <label className="block text-sm font-medium">
                      Treatment
                    </label>
                    <textarea
                      name="treatment"
                      value={formData.treatment || ""}
                      onChange={handleFormChange}
                      className="w-full border rounded-lg px-4 py-2 shadow-sm"
                    />
                  </div>

                  {/* Physical Examination Field */}
                  <div>
                    <label className="block text-sm font-medium">
                      Physical Examination
                    </label>
                    <textarea
                      name="physicalExamination"
                      value={formData.physicalExamination || ""}
                      onChange={handleFormChange}
                      className="w-full border rounded-lg px-4 py-2 shadow-sm"
                    />
                  </div>

                  {/* Laboratory Field */}
                  <div>
                    <label className="block text-sm font-medium">
                      Laboratory Results
                    </label>
                    <textarea
                      name="laboratory"
                      value={formData.laboratory || ""}
                      onChange={handleFormChange}
                      className="w-full border rounded-lg px-4 py-2 shadow-sm"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 shadow-lg transition"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            )}
            {!isEditing && (
              <>
                <div>
                  <h5 className="text-xl font-medium mt-4">Medical History</h5>
                  <p className="text-gray-500">
                    {selectedPatient.medicalHistory || "No data available"}
                  </p>
                </div>
                <div className="flex justify-end items-center mt-6">
                <button
                  onClick={handleGeneratePDF}
                  className="text-green-600 hover:text-green-800 mr-4"
                >
                  Generate PDF
                </button>
                  <button
                    onClick={handleEditClick}
                    className="text-yellow-600 hover:text-yellow-800 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="text-red-600 hover:text-red-800"
                  >
                    {deleting ? "Deleting..." : "Delete"}{" "}
                    {/* Use deleting state */}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;

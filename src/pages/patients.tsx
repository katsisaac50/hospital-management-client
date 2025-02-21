import axios from "axios";
import { useState, useMemo } from "react";
import * as cookie from "cookie";
import "jspdf-autotable";
import { useRouter } from "next/router";
import generatePDF from "../components/generatePDF";
import { calculateAge, formatDate } from '../lib/utils';
import { useAppContext } from "../context/AppContext";
import LabRequestForm from "./laboratory/lab-test-request";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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



export async function getServerSideProps(context: {
  req: { headers: { cookie?: string } };
}) {
  const { req } = context;
  
  
  // Log the cookie header to check if it's being passed properly
  // console.log('Cookies:', req.headers.cookie);

  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie || "") : {};
  const token = cookies.authToken;
  console.log("Token being sent:", token);
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

    // console.log(response)

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

const Patients = ({ patients }: { patients: Patient[] }) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Patient>>({});
  const [saving, setSaving] = useState(false); // State for save action
  const [deleting, setDeleting] = useState(false); // State for delete action
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const router = useRouter();
  const { user } = useAppContext();
  const [openTest, setOpenTest] = useState(false);

  const handleTestOpen = () =>setOpenTest(true);
  const handleTestClose = () => setOpenTest(false);

  // console.log(user);

  const handleTestSubmit = async (formData) => {
    console.log(formData)
    if (!formData.patientId || !formData.doctorId || !formData.testName) {
      alert("Please fill in all required fields: Patient ID, Doctor ID, and Test Name.");
      return;
    }
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
  
    if (!token) {
      alert("Session expired or you are not logged in. Redirecting to login...");
      window.location.href = "/login";
      return;
    }
    // console.log(token)
    try {
      const response = await fetch(`${API_URL}/lab-test-request`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        alert("Test request submitted successfully!");
      } else {
        alert(`Error: ${data.message}`);
      }
  
      // handleTestClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the request.");
    }
  };
  
  const handlePatientClick = async (patientId: string) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];
  
    if (!token) {
      alert("Session expired or you are not logged in. Redirecting to login...");
      window.location.href = "/login";
      return;
    }
  
    // 🚨 Prevent modal from opening for lab technicians
    if (user?.role === "labTechnician") {
      router.push(`/laboratory/${patientId}`);
      return; // Exit function early
    }
  // console.log(token)
    try {
      const response = await axios.get(`${API_URL}/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const patientData = response.data;
  
      if (!patientData.age) {
        patientData.age = calculateAge(patientData.dob);
      }
  
      setSelectedPatient(patientData);
      setIsModalOpen(true);
    } catch (error: unknown) {
      console.error("Error fetching patient details:",  error.response?.data?.message || error.message);
  
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
      // window.location.reload();
      setSelectedPatient({ ...selectedPatient, ...formData });
setPatients((prevPatients) =>
  prevPatients.map((p) => (p._id === selectedPatient._id ? { ...p, ...formData } : p))
);
    } catch (error) {
      console.error("Error updating patient:", error);
      alert("Failed to update the patient. Please try again.");
    } finally {
      setSaving(false); // Reset saving state after completion
    }
  };

  const handleGeneratePDF = (preview = false) => {
    generatePDF(selectedPatient, preview);
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
      setSelectedPatient({ ...selectedPatient, ...formData });
setPatients((prevPatients) =>
  prevPatients.map((p) => (p._id === selectedPatient._id ? { ...p, ...formData } : p))
);
      // window.location.reload();
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

  // const filteredPatients = patients.filter(patient => {
  //   const matchesNameOrId = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || patient._id.toLowerCase().includes(searchQuery.toLowerCase());
  //   const matchesGender = filterGender ? patient.gender === filterGender : true;
  //   return matchesNameOrId && matchesGender;
  // });
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesNameOrId =
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient._id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGender = filterGender ? patient.gender === filterGender : true;
      return matchesNameOrId && matchesGender;
    });
  }, [patients, searchQuery, filterGender]);  

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="border rounded-lg px-4 py-2 shadow-sm focus:outline-blue-500"
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
          >
            <option value="">Filter by Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <button
            onClick={navigateToAddPatient}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 shadow-lg transition"
          >
            {console.log("Selected Patient:", selectedPatient)}
            Add New Patient
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <li key={patient._id}>
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
            </li>
          ))}
        </div>
      </div>

      {isModalOpen && selectedPatient && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="modal-container bg-white rounded-lg p-6 shadow-lg max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between">
              <h3 className="text-2xl font-semibold">{selectedPatient.name}</h3>
              <button onClick={closeModal} className="text-gray-600 text-2xl">
                &times;
              </button>
            </div>
            <div className="mt-6 space-y-4">
              {!isEditing ? (
                <>
                  <p>
                    <strong>Age:</strong> {selectedPatient.age}
                  </p>
                  <p>
                    <strong>Gender:</strong> {selectedPatient.gender}
                  </p>
                  <p>
                    <strong>Contact:</strong> {selectedPatient.contact}
                  </p>
                  {/* Only show medical data for doctors or admins */}
                  {console.log("User Role:", user?.role)}
                  {user?.role !== "labTechnician" && (
                    <>
                      <p>
                        <strong>Medical History:</strong> {selectedPatient.medicalHistory || "No history available"}
                      </p>
                      <p>
                        <strong>Diagnosis:</strong> {selectedPatient.currentDiagnosis || "No diagnosis available"}
                      </p>
                    </>
                  )}
                  <div className="flex justify-end gap-4 mt-6">
                  <button 
                  className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-grey-600"
                  onClick={() => router.push(`/patients/DischargeForm?patientId=${selectedPatient._id}`)}>
                    Discharge
                  </button>
                    <button
                      className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                      onClick={handleEditClick}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                      onClick={() => handleGeneratePDF(false)}
                    >
                      Generate PDF
                    </button>
                    {/* Add the "Request Lab Test" button */}
                    <button
                      className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600"
                      onClick={handleTestOpen}
                    >
                      Request Lab Test
                    </button>
                    <button
                      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                      onClick={handleDeleteClick}
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={handleFormSubmit}>
                  <div className="space-y-4">
                    <label className="block">
                      <span className="text-gray-700">Name</span>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </label>

                    <label className="block">
                      <span className="text-gray-700">Gender</span>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleFormChange}
                        className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="text-gray-700">Contact</span>
                      <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleFormChange}
                        className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </label>
                    
                    <div className="flex justify-end gap-4 mt-6">
                      <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                        type="submit"
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                        type="button"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      <LabRequestForm open={openTest} onClose={handleTestClose} onSubmit={handleTestSubmit} selectedPatient={selectedPatient} />
    </div>
  );
};

export default Patients;

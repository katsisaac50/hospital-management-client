import axios from "axios";
import { useState, useMemo } from "react";
import * as cookie from "cookie";
import "jspdf-autotable";
import { useRouter } from "next/router";
import generatePDF from "../components/generatePDF";
import { calculateAge, formatDate } from '../lib/utils';
import { useAppContext } from "../context/AppContext";
import LabRequestForm from "./laboratory/lab-test-request";
import { useTheme } from "../context/ThemeContext";
import { ArrowsUpDownIcon, MagnifyingGlassIcon, AdjustmentsHorizontalIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { saveOfflineData } from '../utils/indexedDB';

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
  // console.log("Cookies:", req);
  const token = cookies?.authToken;
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
  const { theme } = useTheme();
  const [view, setView] = useState("grid");

  const handleTestOpen = () =>setOpenTest(true);
  const handleTestClose = () => setOpenTest(false);

  // console.log(user);

  const handleTestSubmit = async (formData) => {
    console.log(formData)
    if (!navigator.onLine) {
      console.log('Offline: Saving data locally');
      await saveOfflineData(formData);
      return { success: false, message: 'Saved offline' };
    }
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
      router.replace(router.asPath);
      // window.location.reload();
//       setSelectedPatient({ ...selectedPatient, ...formData });
// setPatients((prevPatients) =>
//   prevPatients.map((p) => (p._id === selectedPatient._id ? { ...p, ...formData } : p))
// );
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
      // Update patient in the list
    setPatients((prevPatients) =>
      prevPatients.map((p) =>
        p._id === selectedPatient._id ? { ...p, ...formData } : p
      )
    );
      closeModal();
      setSelectedPatient({ ...selectedPatient, ...formData });
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
    <div className={`min-h-screen flex flex-col items-center justify-center py-8 px-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
      <div className={`max-w-6xl w-full ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} shadow-2xl rounded-lg p-6`}>
        <h3 className={`text-4xl font-semibold text-center py-4 ${theme === 'dark' ? 'text-white' : 'text-blue-700'}`}>
          Patients Dashboard
        </h3>
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
  {/* Left: Switch View Button */}
  <button
    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
    onClick={() => setView(view === "grid" ? "table" : "grid")}
  >
    <ArrowsUpDownIcon className="w-5 h-5" />
    Switch to {view === "grid" ? "Table" : "Grid"} View
  </button>

  {/* Middle: Search & Filter */}
  <div className="flex gap-2 items-center w-full md:w-auto">
    <div className="relative">
      <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search by Name or ID"
        className={`border rounded-lg pl-10 pr-4 py-2 shadow-sm focus:outline-blue-500 ${
          theme === "dark" ? "bg-gray-800 text-white border-gray-600" : "bg-white text-gray-900"
        }`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
    
    <div className="relative">
  <AdjustmentsHorizontalIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
  <select
    className={`border rounded-lg pl-10 pr-4 py-2 shadow-sm focus:outline-blue-500 ${
      theme === "dark" ? "bg-gray-800 text-white border-gray-600" : "bg-white text-gray-900"
    }`}
    value={filterGender}
    onChange={(e) => setFilterGender(e.target.value)}
  >
    <option value="">Filter by Gender</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
  </select>
</div>

  </div>

  {/* Right: Add Patient Button */}
  <button
    onClick={navigateToAddPatient}
    className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 shadow-lg transition"
  >
    <UserPlusIcon className="w-5 h-5" />
    Add New Patient
  </button>
</div>        {view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-8">
          {filteredPatients.map((patient) => (
            <li key={patient._id} className="list-none">
              <div
                className={`bg-gradient-to-br ${theme === 'dark' ? 'from-gray-800 to-gray-900 text-gray-200' : 'from-white to-gray-100 text-gray-800'} 
                rounded-lg shadow-lg p-6 hover:shadow-2xl transition duration-200 ease-in-out transform hover:scale-[1.02] cursor-pointer`}
                onClick={() => handlePatientClick(patient._id)}
              >
                {/* Name & Age */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xl font-semibold">{patient.name}</span>
                  <span className="text-gray-400">
                    {patient.age ?? calculateAge(patient.dob)} years
                  </span>
                </div>
        
                {/* Contact */}
                <p className="text-gray-500 mb-2">{patient.contact}</p>
        
                {/* Gender */}
                <p className="text-sm text-gray-400 capitalize">{patient.gender}</p>
              </div>
            </li>
          ))}
        </div>
        ):(
          <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Patient ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Gender</th>
            <th className="px-4 py-2">Age</th>
            <th className="px-4 py-2">Last Visit</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((patient) => (
            <tr key={patient._id}>
              <td className="border px-4 py-2">{patient._id}</td>
              <td className="border px-4 py-2">{patient.name}</td>
              <td className="border px-4 py-2">{patient.gender}</td>
              <td className="border px-4 py-2">
                {patient.age || calculateAge(patient.dob)}
              </td>
              <td className="border px-4 py-2">{formatDate(patient.lastVisit)}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handlePatientClick(patient._id)}
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        )}
        
      </div>

      {isModalOpen && selectedPatient && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className={`modal-container ${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg p-6 shadow-lg max-w-3xl w-full`}
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
                    {(user?.role === "admin" || user?.role === "doctor") && (
                      <>
                      <button
                      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                      onClick={handleDeleteClick}
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
                    <button
                      className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                      onClick={handleEditClick}
                    >
                      Edit
                    </button>
                    </>
              )}
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

import axios from 'axios';
import { useState } from 'react';
import cookie from 'cookie';
import { useRouter } from 'next/router';

export async function getServerSideProps(context) {
  const { req } = context;
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.authToken;

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    const response = await axios.get('http://localhost:5000/api/patients', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { props: { patients: response.data } };
  } catch (error) {
    console.error('Error fetching patients:', error);

    if (error.response?.status === 401) {
      return {
        redirect: {
          destination: '/login',
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

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Not provided';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(date); // e.g., "24 December 2024"
};

const Patients = ({ patients }: { patients: Patient[] }) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Patient>>({});
  const [saving, setSaving] = useState(false);  // State for save action
  const [deleting, setDeleting] = useState(false);  // State for delete action
  const router = useRouter();

  const handlePatientClick = async (patientId: string) => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('authToken='))
      ?.split('=')[1];

    if (!token) {
      alert('Session expired or you are not logged in. Redirecting to login...');
      window.location.href = '/login';
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/patients/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const patientData = response.data;

      if (!patientData.age) {
        patientData.age = calculateAge(patientData.dob);
      }

      setSelectedPatient(patientData);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching patient details:', error);

      if (error.response?.status === 401) {
        alert('Session expired. Please log in again.');
        window.location.href = '/login';
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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !selectedPatient) return;

    try {
      setSaving(true);  // Set saving to true when saving data
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('authToken='))
        ?.split('=')[1];

      await axios.put(
        `http://localhost:5000/api/patients/${selectedPatient._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Patient updated successfully.');
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error('Error updating patient:', error);
      alert('Failed to update the patient. Please try again.');
    } finally {
      setSaving(false);  // Reset saving state after completion
    }
  };

  const handleDeleteClick = async () => {
    if (!selectedPatient) return;
    const confirmation = confirm('Are you sure you want to delete this patient?');

    if (!confirmation) return;

    try {
      setDeleting(true);  // Set deleting to true when deleting data
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('authToken='))
        ?.split('=')[1];

      await axios.delete(`http://localhost:5000/api/patients/${selectedPatient._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Patient deleted successfully.');
      closeModal();
      window.location.reload();
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert('Failed to delete the patient. Please try again.');
    } finally {
      setDeleting(false);  // Reset deleting state after completion
    }
  };

  const navigateToAddPatient = () => {
    router.push('/add-patient');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center py-8 px-4">
      <div className="max-w-6xl w-full bg-white shadow-2xl rounded-lg p-6">
        <h3 className="text-4xl font-semibold text-center text-blue-700 py-4">Patients Dashboard</h3>
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
                <span className="text-xl font-semibold text-gray-800">{patient.name}</span>
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
            <h4 className="text-3xl font-semibold text-center text-blue-700 mb-4">{isEditing ? "Edit Patient Details" : "Patient Profile"}</h4>
            {!isEditing ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <p><strong>Name:</strong> {selectedPatient.name}</p>
                <p>
                  <strong>Age:</strong> {selectedPatient.age ?? calculateAge(selectedPatient.dob) || 'Not provided'}
                </p>
                <p>
                  <strong>Date of Birth:</strong> {formatDate(selectedPatient.dob)|| 'Not provided'}
                </p>
                <p><strong>Contact:</strong> {selectedPatient.contact}</p>
                <p><strong>Gender:</strong> {selectedPatient.gender}</p>
                <p><strong>Address:</strong> {selectedPatient.address}</p>
                <p>
                  <strong>Physical Examination:</strong> {selectedPatient.physicalExamination || 'No data available'}
                </p>
                <p>
                  <strong>Laboratory:</strong> {selectedPatient.laboratory || 'No data available'}
                </p>
                <p><strong>Treatment:</strong> {selectedPatient.treatment || 'No data available'}</p>
              </div>
            </div>
            ):(
              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 gap-4 max-h-[70vh] overflow-y-auto">
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
                  <label className="block text-sm font-medium">Date of Birth</label>
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
                    onChange={handleFormChange}
                    className="w-full border rounded-lg px-4 py-2 shadow-sm"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* Medical History Field */}
                <div>
                  <label className="block text-sm font-medium">Medical History</label>
                  <textarea
                    name="medicalHistory"
                    value={formData.medicalHistory || ""}
                    onChange={handleFormChange}
                    className="w-full border rounded-lg px-4 py-2 shadow-sm"
                  />
                </div>

                {/* Treatment Field */}
                <div>
                  <label className="block text-sm font-medium">Treatment</label>
                  <textarea
                    name="treatment"
                    value={formData.treatment || ""}
                    onChange={handleFormChange}
                    className="w-full border rounded-lg px-4 py-2 shadow-sm"
                  />
                </div>

                {/* Physical Examination Field */}
                <div>
                  <label className="block text-sm font-medium">Physical Examination</label>
                  <textarea
                    name="physicalExamination"
                    value={formData.physicalExamination || ""}
                    onChange={handleFormChange}
                    className="w-full border rounded-lg px-4 py-2 shadow-sm"
                  />
                </div>

                {/* Laboratory Field */}
                <div>
                  <label className="block text-sm font-medium">Laboratory Results</label>
                  <textarea
                    name="laboratory"
                    value={formData.laboratory || ""}
                    onChange={handleFormChange}
                    className="w-full border rounded-lg px-4 py-2 shadow-sm"
                  />
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
              <p className="text-gray-500">{selectedPatient.medicalHistory || 'No data available'}</p>
            </div>
            <div className="flex justify-end items-center mt-6">
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
                  {deleting ? "Deleting..." : "Delete"}  {/* Use deleting state */}
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
// import { GetServerSideProps } from 'next';
// import { verifyToken } from '../utils/auth';

// const ProtectedPage = ({ user }: { user: any }) => {
//   return (
//     <div className="max-w-md mx-auto mt-10">
//       <h1 className="text-2xl font-bold">Welcome, {user.role}</h1>
//       <p>This is a protected page.</p>
//     </div>
//   );
// };

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const token = context.req.cookies.token; // Ensure cookies are sent with the request
//   const user = token ? verifyToken(token) : null;

//   if (!user) {
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: { user },
//   };
// };

// export default ProtectedPage;


import { useState } from "react";
import axios from "axios";

const Patients = ({ patients }: { patients: Patient[] }) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Patient>>({});
  const [loading, setLoading] = useState(false);

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];

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

  const handleDeleteClick = async () => {
    if (selectedPatient && confirm("Are you sure you want to delete this patient?")) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:5000/api/patients/${selectedPatient._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Patient deleted successfully.");
        closeModal();
        window.location.reload(); // Refresh to show updated patient list
      } catch (error) {
        console.error("Error deleting patient:", error);
        alert("Failed to delete the patient. Please try again.");
      } finally {
        setLoading(false);
      }
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
      setLoading(true);
      await axios.put(`http://localhost:5000/api/patients/${selectedPatient._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Patient updated successfully.");
      closeModal();
      window.location.reload(); // Refresh to show updated patient list
    } catch (error) {
      console.error("Error updating patient:", error);
      alert("Failed to update the patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center py-8 px-4">
      {/* Patient List */}
      <div className="max-w-6xl w-full bg-white shadow-2xl rounded-lg p-6">
        <h3 className="text-4xl font-semibold text-center text-blue-700 py-4">Patients Dashboard</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <div
              key={patient._id}
              className="bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-md p-5 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={() => {
                setSelectedPatient(patient);
                setIsModalOpen(true);
              }}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xl font-semibold text-gray-800">{patient.name}</span>
                <span className="text-gray-500">{patient.age || "N/A"} years</span>
              </div>
              <p className="text-gray-700 mb-2">{patient.contact}</p>
              <p className="text-gray-500 text-sm">{patient.gender}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
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
              <div>
                <div>
                  <p><strong>Name:</strong> {selectedPatient.name}</p>
                  <p><strong>Age:</strong> {selectedPatient.age || "N/A"}</p>
                  <p><strong>Contact:</strong> {selectedPatient.contact}</p>
                  <p><strong>Gender:</strong> {selectedPatient.gender}</p>
                  <p><strong>Address:</strong> {selectedPatient.address}</p>
                  <p><strong>Treatment:</strong> {selectedPatient.treatment || "N/A"}</p>
                </div>
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={handleEditClick}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="text-red-600 hover:text-red-800"
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ) : (
              
            )}
          </div>
        </div>
      )}
    </div>
  );
};

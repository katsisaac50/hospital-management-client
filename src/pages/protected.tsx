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


const Patients = ({ patients }: { patients: Patient[] }) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Patient>>({});
  const [saving, setSaving] = useState(false);  // State for save action
  const [deleting, setDeleting] = useState(false);  // State for delete action
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center py-8 px-4">
      {/* ... other parts of the component */}

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
                {/* Display patient information */}
                <p><strong>Name:</strong> {selectedPatient.name}</p>
                <p><strong>Age:</strong> {selectedPatient.age ?? calculateAge(selectedPatient.dob) || 'Not provided'}</p>
                <p><strong>Date of Birth:</strong> {formatDate(selectedPatient.dob) || 'Not provided'}</p>
                <p><strong>Contact:</strong> {selectedPatient.contact}</p>
                <p><strong>Gender:</strong> {selectedPatient.gender}</p>
                <p><strong>Address:</strong> {selectedPatient.address}</p>
                <p><strong>Physical Examination:</strong> {selectedPatient.physicalExamination || 'No data available'}</p>
                <p><strong>Treatment:</strong> {selectedPatient.treatment || 'No data available'}</p>
                <p><strong>Medical History:</strong> {selectedPatient.medicalHistory || 'No data available'}</p>
                <p><strong>Laboratory Results:</strong> {selectedPatient.laboratory || 'No data available'}</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 gap-4">
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
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

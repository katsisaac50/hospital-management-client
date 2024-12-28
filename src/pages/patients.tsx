import axios from 'axios';
import { useState } from 'react';

export async function getServerSideProps() {
  try {
    const response = await axios.get('http://localhost:5000/api/patients');
    return { props: { patients: response.data } };
  } catch (error) {
    console.error('Error fetching patients:', error);
    return { props: { patients: [] } }; // Return empty list on error
  }
}

interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
  // Add any other properties you want to display for the patient
}

const Patients = ({ patients }: { patients: Patient[] }) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handlePatientClick = async (patientId: string) => {
    try {
        // Fetch patient details using patientId
      const response = await axios.get(`http://localhost:5000/api/patients/${patientId}`);
      setSelectedPatient(response.data); // Set selected patient data
    } catch (error) {
      console.error('Error fetching patient details:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Patients List
        </h3>
        {patients.length > 0 ? (
          <ul className="space-y-3">
            {patients.map((patient) => (
              <li
                key={patient._id}
                className="p-4 bg-blue-50 border border-blue-200 rounded-md flex justify-between items-center cursor-pointer"
                onClick={() => handlePatientClick(patient._id)} // Handle click
              >
                
                <span className="text-lg font-semibold text-gray-700">
                  {patient.name}
                </span>
                <span className="text-gray-600">{patient.age} years old</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">
            No patients found. Please add a patient to the list.
          </p>
        )}
      </div>

      {selectedPatient && (
        <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-6 mt-6">
          <h4 className="text-xl font-bold text-center text-blue-600 mb-4">
            Patient Details
          </h4>
          <div>
            <p><strong>Name:</strong> {selectedPatient.name}</p>
            <p><strong>Age:</strong> {selectedPatient.age}</p>
            <p><strong>Gender:</strong> {selectedPatient.gender}</p>
            <p><strong>Phone Number:</strong> {selectedPatient.contact}</p>
            {/* Add other patient details here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;

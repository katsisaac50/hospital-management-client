import axios from 'axios';
import { useState } from 'react';

export async function getServerSideProps(context) {
  const token = localStorage.getItem('token');

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
    const token = localStorage.getItem('authToken'); // Get token from localStorage
  
    if (!token) {
      alert('You need to be logged in to view this patient.');
      window.location.href = '/login';
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:5000/api/patients/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedPatient(response.data);
    } catch (error) {
      console.error('Error fetching patient details:', error);
  
      if (error.response?.status === 401) {
        alert('Session expired. Please log in again.');
        window.location.href = '/login';
      }
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
                <span className="text-gray-600">
                  {patient.age} {patient.age > 1 ? 'years' : 'year'} old
                </span>
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
            <p><strong>Age:</strong> {selectedPatient.age} {selectedPatient.age > 1 ? 'years' : 'year'} old</p>
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

import axios from 'axios';
import { useState } from 'react';
import cookie from 'cookie';

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
  age: number;
  gender: string;
  contact: string;
  address: string;
  medicalHistory: string[];
  currentDiagnosis: string;
  treatment: string;
}

const Patients = ({ patients }: { patients: Patient[] }) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const getAuthTokenFromCookies = () => {
    const cookies = document.cookie.split('; ').reduce((acc, cookieStr) => {
      const [key, value] = cookieStr.split('=');
      acc[key] = value;
      return acc;
    }, {});
    return cookies.authToken || '';
  };

  const handlePatientClick = async (patientId: string) => {
    const token = getAuthTokenFromCookies();

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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-4">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-lg overflow-hidden">
        <h3 className="text-3xl font-semibold text-center text-blue-700 py-4 border-b">Patients List</h3>
        {patients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
            {patients.map((patient) => (
              <div
                key={patient._id}
                className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                onClick={() => handlePatientClick(patient._id)}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xl font-semibold text-gray-800">{patient.name}</span>
                  <span className="text-gray-500">{patient.age} {patient.age > 1 ? 'years' : 'year'}</span>
                </div>
                <p className="text-gray-700 mb-2">{patient.contact}</p>
                <p className="text-gray-500 text-sm">{patient.gender}</p>
                <div className="flex justify-between items-center mt-4 text-sm">
                  <button className="text-blue-600 hover:text-blue-800">View Profile</button>
                  <button className="text-yellow-600 hover:text-yellow-800">Edit</button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 p-6">No patients found. Please add a patient to the list.</p>
        )}
      </div>

      {selectedPatient && (
        <div className="max-w-3xl w-full bg-white shadow-xl rounded-lg mt-8 p-6">
          <h4 className="text-2xl font-semibold text-center text-blue-700 mb-4">Patient Details</h4>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Name:</span>
              <span>{selectedPatient.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Age:</span>
              <span>{selectedPatient.age} {selectedPatient.age > 1 ? 'years' : 'year'} old</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Gender:</span>
              <span>{selectedPatient.gender}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Phone Number:</span>
              <span>{selectedPatient.contact}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Address:</span>
              <span>{selectedPatient.address}</span>
            </div>
            <div>
              <span className="font-medium">Medical History:</span>
              <ul className="list-disc pl-6 space-y-1">
                {selectedPatient.medicalHistory.map((history, index) => (
                  <li key={index}>{history}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Current Diagnosis:</span>
              <span>{selectedPatient.currentDiagnosis}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Treatment:</span>
              <span>{selectedPatient.treatment}</span>
            </div>
          </div>
          <div className="mt-6 flex justify-between">
            <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">Edit Info</button>
            <button className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300">Add Notes</button>
            <button className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300">Remove Patient</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;

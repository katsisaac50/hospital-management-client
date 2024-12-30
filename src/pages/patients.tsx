import axios from 'axios'; 
import { useState } from 'react';
import cookie from 'cookie';
import { useRouter } from 'next/router';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

  // Adjust age if the birth date hasn't occurred yet this year
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const Patients = ({ patients }: { patients: Patient[] }) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const getAuthTokenFromCookies = () => {
    const cookies = document.cookie.split('; ').reduce((acc, cookieStr) => {
      const [key, value] = cookieStr.split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
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

      const patientData = response.data;
      // Calculate age if not provided
      if (!patientData.age) {
        patientData.age = calculateAge(patientData.dob);
      }

      setSelectedPatient(patientData);
    } catch (error) {
      console.error('Error fetching patient details:', error);

      if (error.response?.status === 401) {
        alert('Session expired. Please log in again.');
        window.location.href = '/login';
      }
    }
  };

  const router = useRouter();

  const navigateToAddPatient = () => {
    router.push('/add-patient');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-4">
      <div className="max-w-6xl w-full bg-white shadow-xl rounded-lg p-6">
        <h3 className="text-3xl font-semibold text-center text-blue-700 py-4">Patients Dashboard</h3>
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search by Name or ID"
            className="border rounded px-4 py-2 w-1/3"
          />
          <select className="border rounded px-4 py-2">
            <option value="">Filter by Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <button onClick={navigateToAddPatient} className="bg-blue-600 text-white py-2 px-4 rounded-lg">Add New Patient</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <div
              key={patient._id}
              className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
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

      {selectedPatient && (
        <div className="max-w-4xl w-full bg-white shadow-xl rounded-lg mt-8 p-6">
          <h4 className="text-2xl font-semibold text-center text-blue-700 mb-4">Patient Profile</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p><strong>Name:</strong> {selectedPatient.name}</p>
              <p><strong>Age:</strong> {selectedPatient.age}</p>
              <p><strong>Date of Birth:</strong> {selectedPatient.dob || 'Not provided'}</p>
              <p><strong>Contact:</strong> {selectedPatient.contact}</p>
              <p><strong>Gender:</strong> {selectedPatient.gender}</p>
              <p><strong>Address:</strong> {selectedPatient.address}</p>
              <p><strong>Physical Examination:</strong> {selectedPatient.physicalExamination || 'No data available'}</p>
              <p><strong>Laboratory:</strong> {selectedPatient.laboratory || 'No data available'}</p>
              <p><strong>Treatment:</strong> {selectedPatient.treatment || 'No data available'}</p>
            </div>
          </div>
          <div>
            <h5 className="text-xl font-medium mt-4">Medical History</h5>
            <p className="text-gray-500">{selectedPatient.medicalHistory}</p>
          </div>
          <div className="flex justify-between items-center mt-4 text-sm">
                <button className="text-yellow-600 hover:text-yellow-800">Edit</button>
                <button className="text-red-600 hover:text-red-800">Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;

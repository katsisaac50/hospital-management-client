import axios from 'axios';
import { useState, useEffect } from 'react';
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

// Register the necessary components in Chart.js
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
  age: number;
  gender: string;
  contact: string;
  address: string;
  medicalHistory: string[];
  currentDiagnosis: string;
  treatment: string;
  appointments: string[];
  labResults: string[];
  lastVisit: string;
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
  
      // Ensure medicalHistory is an array
      const patientData = response.data;
      const medicalHistory = Array.isArray(patientData.medicalHistory)
        ? patientData.medicalHistory
        : [];  // Fallback to an empty array
  
      setSelectedPatient({
        ...patientData,
        medicalHistory,
      });
    } catch (error) {
      console.error('Error fetching patient details:', error);
  
      if (error.response?.status === 401) {
        alert('Session expired. Please log in again.');
        window.location.href = '/login';
      }
    }
  };
  

  // Example of patient health data (for charting)
  const patientHealthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Weight',
        data: [75, 78, 77, 76, 75, 74, 72, 71],
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
      {
        label: 'Blood Pressure',
        data: [120, 122, 118, 115, 120, 124, 125, 123],
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
      },
    ],
  };

  const router = useRouter();

  const navigateToAddPatient = () => {
    router.push('/add-patient');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-8 px-4">
      {/* Patient List with Filters */}
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
                <span className="text-gray-500">{patient.age} years</span>
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
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="max-w-4xl w-full bg-white shadow-xl rounded-lg mt-8 p-6">
          <h4 className="text-2xl font-semibold text-center text-blue-700 mb-4">Patient Profile</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div>
              <div className="mb-4">
                <span className="font-medium">Name:</span>
                <span>{selectedPatient.name}</span>
              </div>
              <div className="mb-4">
                <span className="font-medium">Age:</span>
                <span>{selectedPatient.age}</span>
              </div>
              <div className="mb-4">
                <span className="font-medium">Contact:</span>
                <span>{selectedPatient.contact}</span>
              </div>
              <div className="mb-4">
                <span className="font-medium">Gender:</span>
                <span>{selectedPatient.gender}</span>
              </div>
              <div className="mb-4">
                <span className="font-medium">Address:</span>
                <span>{selectedPatient.address}</span>
              </div>
            </div>

            {/* Health Chart */}
            <div>
              <h5 className="text-xl font-medium mb-4">Health Data</h5>
              <Bar data={patientHealthData} options={{ responsive: true }} />
            </div>
          </div>

          {/* History and Actions */}
          <div>
  <h5 className="text-xl font-medium">Medical History</h5>
  {/* Safeguard to ensure `selectedPatient` and `medicalHistory` are valid */}
  {Array.isArray(selectedPatient?.medicalHistory) && selectedPatient.medicalHistory.length > 0 ? (
    <ul className="list-disc pl-6 mb-6">
      {selectedPatient.medicalHistory.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500">No medical history available.</p>
  )}
</div>
        </div>
      )}
    </div>
  );
};

export default Patients;

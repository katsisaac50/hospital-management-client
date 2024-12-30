import axios from "axios";
import { useState } from "react";
import cookie from "cookie";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  const { req } = context;
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.authToken;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const response = await axios.get("http://localhost:5000/api/patients", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { props: { patients: response.data } };
  } catch (error) {
    console.error("Error fetching patients:", error);

    if (error.response?.status === 401) {
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

const Patients = ({ patients }: { patients: Patient[] }) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const router = useRouter();

  const navigateToAddPatient = () => {
    router.push("/add-patient");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
          Patients Dashboard
        </h1>
        <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search by Name or ID"
            className="flex-1 border rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select className="border rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Filter by Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <button
            onClick={navigateToAddPatient}
            className="bg-blue-500 text-white rounded-lg px-6 py-2 hover:bg-blue-600 transition"
          >
            Add Patient
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <div
              key={patient._id}
              className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition hover:-translate-y-1 cursor-pointer"
              onClick={() => setSelectedPatient(patient)}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {patient.name}
              </h2>
              <p className="text-gray-600 mb-1">
                <strong>Age:</strong> {patient.age || "N/A"}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Contact:</strong> {patient.contact}
              </p>
              <p className="text-gray-600">
                <strong>Gender:</strong> {patient.gender}
              </p>
            </div>
          ))}
        </div>
      </div>

      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setSelectedPatient(null)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">
              Patient Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p>
                  <strong>Name:</strong> {selectedPatient.name}
                </p>
                <p>
                  <strong>Age:</strong> {selectedPatient.age || "N/A"}
                </p>
                <p>
                  <strong>Gender:</strong> {selectedPatient.gender}
                </p>
                <p>
                  <strong>Contact:</strong> {selectedPatient.contact}
                </p>
                <p>
                  <strong>Address:</strong> {selectedPatient.address}
                </p>
              </div>
              <div>
                <p>
                  <strong>Medical History:</strong> {selectedPatient.medicalHistory}
                </p>
                <p>
                  <strong>Current Diagnosis:</strong> {selectedPatient.currentDiagnosis}
                </p>
                <p>
  <strong>Lab Results:</strong>{" "}
  {Array.isArray(selectedPatient.labResults)
    ? selectedPatient.labResults.join(", ")
    : "No lab results available"}
</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <button className="text-yellow-500 hover:text-yellow-700">Edit</button>
              <button className="text-red-500 hover:text-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;

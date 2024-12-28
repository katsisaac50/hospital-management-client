import axios from 'axios';

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
}

const Patients = ({ patients }: { patients: Patient[] }) => {
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
                className="p-4 bg-blue-50 border border-blue-200 rounded-md flex justify-between items-center"
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
    </div>
  );
};

export default Patients;
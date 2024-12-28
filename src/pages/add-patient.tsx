import React from 'react';
import AddPatientForm from './AddPatientForm';

const AddPatientPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-lg w-full">
        <h3 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Add a New Patient
        </h3>
        <AddPatientForm />
      </div>
    </div>
  );
};

export default AddPatientPage;

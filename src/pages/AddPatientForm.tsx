import React, { useState } from 'react';
import axios from 'axios';

const AddPatientForm = () => {
  const [patientID, setPatientID] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [address, setAddress] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [insurance, setInsurance] = useState('');
  const [allergies, setAllergies] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [occupation, setOccupation] = useState('');
  const [physicalExamination, setPhysicalExamination] = useState('');
  const [treatment, setTreatment] = useState('');
  const [laboratory, setLaboratory] = useState('');

  const getTokenFromCookie = () => {
    const match = document.cookie.match(/(^| )authToken=([^;]+)/);
    return match ? match[2] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = getTokenFromCookie();

    if (!token) {
      alert('Authorization token missing! Please log in again.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/patients',
        {
          patientID,
          name,
          dob,
          gender,
          contact,
          email,
          emergencyContact,
          address,
          medicalHistory,
          insurance,
          allergies,
          bloodType,
          maritalStatus,
          occupation,
          physicalExamination,
          treatment,
          laboratory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Patient added successfully!');
      setPatientID('');
      setName('');
      setDob('');
      setGender('');
      setContact('');
      setEmail('');
      setEmergencyContact('');
      setAddress('');
      setMedicalHistory('');
      setInsurance('');
      setAllergies('');
      setBloodType('');
      setMaritalStatus('');
      setOccupation('');
      setPhysicalExamination('');
      setTreatment('');
      setLaboratory('');
    } catch (error) {
      console.error('Error adding patient:', error);
      alert('Failed to add patient.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Add Patient</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Patient ID:</label>
        <input
          type="text"
          value={patientID}
          onChange={(e) => setPatientID(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Date of Birth:</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Gender:</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Contact Number:</label>
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Email Address:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Emergency Contact:</label>
        <input
          type="text"
          value={emergencyContact}
          onChange={(e) => setEmergencyContact(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Address:</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Medical History:</label>
        <textarea
          value={medicalHistory}
          onChange={(e) => setMedicalHistory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Insurance Details:</label>
        <input
          type="text"
          value={insurance}
          onChange={(e) => setInsurance(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Allergies:</label>
        <textarea
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Blood Type:</label>
        <input
          type="text"
          value={bloodType}
          onChange={(e) => setBloodType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Marital Status:</label>
        <select
          value={maritalStatus}
          onChange={(e) => setMaritalStatus(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Status</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
          <option value="Widowed">Widowed</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Occupation:</label>
        <input
          type="text"
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* New fields */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Physical Examination:</label>
        <textarea
          value={physicalExamination}
          onChange={(e) => setPhysicalExamination(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Treatment:</label>
        <textarea
          value={treatment}
          onChange={(e) => setTreatment(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Laboratory:</label>
        <textarea
          value={laboratory}
          onChange={(e) => setLaboratory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Add Patient
      </button>
    </form>
  );
};

export default AddPatientForm;

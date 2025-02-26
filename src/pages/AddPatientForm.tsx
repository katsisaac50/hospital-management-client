import React, { useState } from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';

const AddPatientForm = () => {
  const [patientID, setPatientID] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
  const [isLoading, setLoading] = useState(false);

  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Access theme from ThemeContext
  const { theme, toggleTheme } = useTheme();

  const getTokenFromCookie = () => {
    const match = document.cookie.match(/(^| )authToken=([^;]+)/);
    return match ? match[2] : null;
  };

  // Set up axios-retry
  axiosRetry(axios, {
    retries: 3, // Number of retries
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 3000), // Exponential backoff
    shouldRetry: (error) => error.response && error.response.status >= 500, // Retry on server errors
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = getTokenFromCookie();

    if (!token) {
      toast.error('Authorization token missing! Please log in again.');
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${API_URL}/patients`,
        {
          patientID,
          name,
          dob,
          gender,
          contact,
          email,
          password,
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

      toast.success("Patient added successfully!");

      // Reset form fields after successful submission
      setPatientID('');
      setName('');
      setDob('');
      setGender('');
      setContact('');
      setEmail('');
      setPassword('');
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

      router.push('/patients');
      setLoading(false);
    } catch (error) {
      console.error('Error adding patient:', error);
      toast.error('Failed to add patient.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`max-w-lg mx-auto p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      {/* Theme Toggle Button */}
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={toggleTheme}
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Toggle Theme
        </button>
      </div>
      <h2 className="text-2xl font-bold text-center mb-6">Add Patient</h2>

      <div className="mb-4">
        <label className={`block font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Patient ID:</label>
        <input
          type="text"
          value={patientID}
          onChange={(e) => setPatientID(e.target.value)}
          required
          className={`w-full p-2 border border-gray-300 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
        />
      </div>

      <div className="mb-4">
        <label className={`block font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={`w-full p-2 border border-gray-300 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
        />
      </div>

      <div className="mb-4">
        <label className={`block font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Date of Birth:</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
          className={`w-full p-2 border border-gray-300 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
        />
      </div>

      <div className="mb-4">
        <label className={`block font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Gender:</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
          className={`w-full p-2 border border-gray-300 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="mb-4">
        <label className={`block font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Contact Number:</label>
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
          className={`w-full p-2 border border-gray-300 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
        />
      </div>

      <div className="mb-4">
        <label className={`block font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Email Address:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`w-full p-2 border border-gray-300 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
        />
      </div>

      <div className="mb-4">
        <label className={`block font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={`w-full p-2 border border-gray-300 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
        />
      </div>

      <div className="mb-4">
        <label className={`block font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Emergency Contact:</label>
        <input
          type="text"
          value={emergencyContact}
          onChange={(e) => setEmergencyContact(e.target.value)}
          className={`w-full p-2 border border-gray-300 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
        />
      </div>

      <div className="mb-4">
        <label className={`block font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Address:</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={`w-full p-2 border border-gray-300 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
        />
      </div>

      <div className="mb-4">
        <label className={`block font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Medical History:</label>
        <textarea
          value={medicalHistory}
          onChange={(e) => setMedicalHistory(e.target.value)}
          className={`w-full p-2 border border-gray-300 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
        />
      </div>

      <div className="mb-4">
        <label className={`block font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Insurance Details:</label>
        <input
          type="text"
          value={insurance}
          onChange={(e) => setInsurance(e.target.value)}
          className={`w-full p-2 border border-gray-300 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
        />
      </div>

      <div className="mb-4">
        <label className={`block font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Allergies:</label>
        <textarea
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          className={`w-full p-2 border border-gray-300 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
        />
      </div>

      <div className="mb-4">
        <label className={`block font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Blood Type:</label>
        <input
          type="text"
          value={bloodType}
          onChange={(e) => setBloodType(e.target.value)}
          className={`w-full p-2 border border-gray-300 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
        />
      </div>

      <div className="mb-4">
        <label className={`block font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Marital Status:</label>
        <select
          value={maritalStatus}
          onChange={(e) => setMaritalStatus(e.target.value)}
          className={`w-full p-2 border border-gray-300 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
        >
          <option value="">Select Status</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Divorced">Divorced</option>
          <option value="Widowed">Widowed</option>
        </select>
      </div>

      <div className="text-center">
        <button
          type="submit"
          className={`px-6 py-2 rounded-md text-white ${isLoading ? 'bg-gray-500' : 'bg-blue-600'}`}
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default AddPatientForm;

import React, { useState } from 'react';
import axios from 'axios';

const AddPatientForm = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [contact, setContact] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/patients', {
        name,
        age,
        gender,
        contact,
      });
      alert('Patient added successfully!');
      setName('');
      setAge('');
      setGender('');
      setContact('');
    } catch (error) {
      console.error('Error adding patient:', error);
      alert('Failed to add patient.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Gender:</label>
        <input
          type="text"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Contact:</label>
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

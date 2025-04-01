import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';


const servicesList = [
  { _id: '1', name: 'General Consultation' },
  { _id: '2', name: 'Blood Test' },
  { _id: '3', name: 'Phiotherapy' },
  { _id: '4', name: 'Dental Checkup' },
  { _id: '5', name: 'Urinalysis' },
  { _id: '6', name: 'CT Scan' },
  { _id: '7', name: 'X-Ray' },
  { _id: '4', name: 'Laboratory' }
];

const AddPatientForm = () => {
  const [formData, setFormData] = useState({
    patientID: '',
    name: '',
    dob: '',
    gender: '',
    contact: '',
    email: '',
    emergencyContact: '',
    address: '',
    medicalHistory: '',
    insurance: '',
    allergies: '',
    bloodType: '',
    maritalStatus: '',
    occupation: '',
    physicalExamination: '',
    treatment: '',
    laboratory: '',
    services: [], // Store selected services with their price and description
  });
  
  const [isLoading, setLoading] = useState(false);
  // const [servicesList, setServicesList] = useState<ServiceType[]>([]);
  const router = useRouter();
  const { theme } = useTheme();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // useEffect(() => {
  //   // Fetch available services from the backend
  //   const fetchServices = async () => {
  //     const token = getTokenFromCookie();
    
  //   if (!token) {
  //     toast.error('Authorization token missing! Please log in again.');
  //     router.push('/login');
  //     return;
  //   }
  //     try {
  //       const response = await axios.get(`${API_URL}/services`);
  //       console.log('response', response);
  //       setServicesList(response.data.data); // Assuming the API returns { services: [...] }
  //     } catch (error) {
  //       console.error('Error fetching services:', error);
  //       toast.error('Failed to load services.');
  //     }
  //   };
    
  //   fetchServices();
  // }, [API_URL]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle service selection
  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...formData.services];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value,
    };
    setFormData({ ...formData, services: updatedServices });
  };

 
  const getTokenFromCookie = () => {
    const match = document.cookie.match(/(^| )authToken=([^;]+)/);
    return match ? match[2] : null;
  };

  const shouldRetry = (error) => {
    const { config, response } = error;
    const retryCount = config['axios-retry']?.retryCount || 0;
    return retryCount < 3 && response?.status >= 500 && response?.status < 600;
  };

  axiosRetry(axios, { retryCondition: shouldRetry });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getTokenFromCookie();
    console.log('ggg', token)
    
    if (!token) {
      toast.error('Authorization token missing! Please log in again.');
      router.push('/login');
      return;
    }

    // Ensure all services have prices before submission
    if (formData.services.some((service) => !service.price)) {
      toast.error('Please provide a price for all selected services.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/patients`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Patient added successfully!');
      setFormData({
        patientID: '', name: '', dob: '', gender: '', contact: '', email: '', password: '',
        emergencyContact: '', address: '', medicalHistory: '', insurance: '', allergies: '',
        bloodType: '', maritalStatus: '', occupation: '', physicalExamination: '', treatment: '', laboratory: '', services: []
      });
      router.push('/patients');
    } catch (error) {
      console.error('Error adding patient:', error);
      toast.error('Failed to add patient.');
    } finally {
      setLoading(false);
    }
  };


  const formFields = [
    { name: 'patientID', label: 'Patient ID', type: 'text' },
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'dob', label: 'Date of Birth', type: 'date' },
    { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
    { name: 'contact', label: 'Contact Number', type: 'text' },
    { name: 'email', label: 'Email Address', type: 'email' },
    { name: 'emergencyContact', label: 'Emergency Contact', type: 'text' },
    { name: 'address', label: 'Address', type: 'textarea' },
    { name: 'medicalHistory', label: 'Medical History', type: 'textarea' },
    { name: 'insurance', label: 'Insurance Details', type: 'text' },
    { name: 'allergies', label: 'Allergies', type: 'textarea' },
    { name: 'bloodType', label: 'Blood Type', type: 'text' },
    { name: 'maritalStatus', label: 'Marital Status', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed'] },
  ];

  return (
    <form onSubmit={handleSubmit} className={`max-w-lg mx-auto p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h2 className="text-2xl font-bold text-center mb-6">Add Patient</h2>

      {formFields.map((field) => (
        <div className="mb-4" key={field.name}>
          <label className={`block font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{field.label}:</label>
          {field.type === 'select' ? (
            <select
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required
              className={`w-full p-2 border border-gray-300 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className={`w-full p-2 border border-gray-300 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            />
          ) : (
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required
              className={`w-full p-2 border border-gray-300 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            />
          )}
        </div>
      ))}

      <div className="mb-4">
        <label className={`block font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Services Rendered:</label>
        {formData.services.map((service, index) => (
          <div key={index} className="flex items-center gap-4 mb-2">
            <select
              value={service.serviceId || ''}
              onChange={(e) => handleServiceChange(index, 'serviceId', e.target.value)}
              className={`p-2 border border-gray-300 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            >
              <option value="">Select Service</option>
              {servicesList.length === 0 ? (
                    <option>Loading services...</option>
                  ) : (
                    servicesList.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.name}
                      </option>
                    ))
                  )}

            </select>
            <input
              type="number"
              placeholder="Price"
              value={service.price || ''}
              onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
              className={`p-2 border border-gray-300 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            />
            <textarea
              placeholder="Description"
              value={service.description || ''}
              onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
              className={`p-2 border border-gray-300 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            />
            <button
              type="button"
              onClick={() => {
                const updatedServices = [...formData.services];
                updatedServices.splice(index, 1);
                setFormData({ ...formData, services: updatedServices });
              }}
              className="bg-red-500 text-white p-2 rounded-md"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setFormData({ ...formData, services: [...formData.services, { serviceId: '', price: '', description: '' }] })}
          className="bg-green-500 text-white p-2 rounded-md"
        >
          Add Service
        </button>
      </div>

      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md mt-4" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Add Patient'}
      </button>
    </form>
  );
};

export default AddPatientForm;
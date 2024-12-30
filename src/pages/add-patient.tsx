import React, { useEffect, useState } from 'react';
import AddPatientForm from './AddPatientForm';
import { useRouter } from 'next/router';

const AddPatientPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Function to check if user is authenticated
  const checkAuth = () => {
    const token = document.cookie.match(/(^| )authToken=([^;]+)/);
    if (token) {
      setIsAuthenticated(true); // User is authenticated
    } else {
      setIsAuthenticated(false); // User is not authenticated
      router.push('/login'); // Redirect to login page
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700">You must be logged in to add a patient.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-lg w-full">
        <AddPatientForm />
      </div>
    </div>
  );
};

export default AddPatientPage;

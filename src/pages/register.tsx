import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';



const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const [success, setSuccess] = useState<null | string>(null); // Explicitly define the type
  const [error, setError] = useState<null | string>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', formData);
      console.log(data);


      // if (data.success) {
      //   if (data.user.role === 'admin') {
      //     router.push('/admin/dashboard');
      //   } else if (data.user.role === 'doctor') {
      //     router.push('/doctor/dashboard');
      //   } else if (data.user.role === 'patient') {
      //     router.push('/patient/dashboard');
      //   }
      // }
      setSuccess('Registration successful! Please log in.');
      setFormData({ name: '', email: '', password: '', role: '' });
      setTimeout(() => {
        router.push('/login'); // Redirect to the login page
      }, 2000); // Delay for user feedback
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during registration.');
    }

  };

  return (    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-700 font-medium mb-2">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="">Select a Role</option>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;

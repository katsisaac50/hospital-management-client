'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMoon, AiOutlineSun } from 'react-icons/ai';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Login = () => {
  const { setUser } = useAppContext();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { theme, toggleTheme } = useTheme(); // Use the theme context

  useEffect(() => {
    document.body.classList.add('login-page');
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      document.cookie = `authToken=${response.data.token}; path=/; secure; samesite=strict;`;
      setUser(response.data.user);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative min-h-screen flex items-center justify-center transition-all duration-500 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-transparent text-gray-900'}`}>
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-40"
        src="/assets/hospital.mp4"
        autoPlay
        loop
        muted
        poster="/assets/fallback.jpg"
        playsInline
      />

      <button
        className="absolute top-5 right-5 text-xl p-2 bg-gray-700 text-white rounded-full shadow-md hover:bg-gray-600 transition"
        onClick={toggleTheme} // Toggle the theme using the context's toggle function
      >
        {theme === 'dark' ? <AiOutlineSun /> : <AiOutlineMoon />}
      </button>

      <div className={`relative z-10 p-8 rounded-lg shadow-xl w-full max-w-md transition-all duration-500 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white/30 backdrop-blur-lg border border-gray-300'}`}>
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">Welcome Back</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-10 text-gray-400 hover:text-gray-200"
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 rounded-md text-white font-semibold hover:bg-blue-700 transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <span className="animate-spin w-5 h-5 border-t-2 border-white"></span> : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Don’t have an account?{' '}
          <Link href="/register" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

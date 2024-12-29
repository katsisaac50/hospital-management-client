import Link from 'next/link';
import { FaUser, FaStethoscope, FaCalendarAlt, FaFileAlt, FaHeart, FaChartPie, FaMoneyBillWave } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-20 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 shadow-xl flex flex-col justify-between items-center">
  {/* Profile Icon */}
  <div className="mb-8">
    <img
      src="/hospital-logo.jpg" // Replace with actual logo URL
      alt="Hospital Logo"
      className="w-12 h-12 rounded-full shadow-md"
    />
  </div>

  {/* Navigation Links */}
  <nav>
    <ul className="flex flex-col space-y-6 items-center">
      <li title="View Patients">
        <Link
          href="/patients"
          className="flex items-center justify-center w-14 h-14 rounded-lg hover:bg-blue-800 transition-all duration-300"
        >
          <span className="material-icons-outlined text-2xl">people</span>
        </Link>
      </li>
      <li title="View Doctors">
        <Link
          href="/doctors"
          className="flex items-center justify-center w-14 h-14 rounded-lg hover:bg-blue-800 transition-all duration-300"
        >
          <span className="material-icons-outlined text-2xl">person</span>
        </Link>
      </li>
      <li title="Appointments">
        <Link
          href="/appointments"
          className="flex items-center justify-center w-14 h-14 rounded-lg hover:bg-blue-800 transition-all duration-300"
        >
          <span className="material-icons-outlined text-2xl">event</span>
        </Link>
      </li>
      <li title="Reports">
        <Link
          href="/reports"
          className="flex items-center justify-center w-14 h-14 rounded-lg hover:bg-blue-800 transition-all duration-300"
        >
          <span className="material-icons-outlined text-2xl">description</span>
        </Link>
      </li>
      <li title="Settings">
        <Link
          href="/settings"
          className="flex items-center justify-center w-14 h-14 rounded-lg hover:bg-blue-800 transition-all duration-300"
        >
          <span className="material-icons-outlined text-2xl">settings</span>
        </Link>
      </li>
    </ul>
  </nav>

  {/* Logout */}
  <div>
    <Link
      href="/logout"
      className="flex items-center justify-center w-14 h-14 rounded-lg hover:bg-blue-800 transition-all duration-300"
    >
      <span className="material-icons-outlined text-2xl">logout</span>
    </Link>
  </div>
</aside>


      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Welcome Header */}
        <header className="bg-white shadow-lg rounded-lg p-8 mb-6 flex items-center space-x-6">
  <img
    src="/profile-picture.jpg" // Replace with actual image URL
    alt="User Profile"
    className="w-16 h-16 rounded-full shadow-md"
  />
  <div>
    <h1 className="text-4xl font-extrabold text-blue-600">
      Welcome Back, Dr. Mera Malaika!
    </h1>
    <p className="text-gray-600 mt-2 text-lg">
      Have you had a routine health check this month?
    </p>
    <div className="mt-4 flex space-x-4">
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600">
        Check Now
      </button>
      <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-300">
        View Report
      </button>
    </div>
  </div>
</header>


        {/* Quick Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
  {/* Heart Rate */}
  <div className="bg-white p-6 rounded-lg shadow-lg flex justify-between items-center">
    <div>
      <h3 className="text-lg font-semibold text-gray-700">Heart Rate</h3>
      <p className="text-2xl font-bold text-blue-600">80 bpm</p>
    </div>
    <span className="material-icons-outlined text-blue-600 text-4xl">
      favorite
    </span>
  </div>

  {/* Lung Capacity */}
  <div className="bg-white p-6 rounded-lg shadow-lg flex justify-between items-center">
    <div>
      <h3 className="text-lg font-semibold text-gray-700">Lung Capacity</h3>
      <p className="text-2xl font-bold text-green-600">4.75 L</p>
    </div>
    <span className="material-icons-outlined text-green-600 text-4xl">
      air
    </span>
  </div>

  {/* Blood Cells */}
  <div className="bg-white p-6 rounded-lg shadow-lg flex justify-between items-center">
    <div>
      <h3 className="text-lg font-semibold text-gray-700">Blood Cells</h3>
      <p className="text-2xl font-bold text-red-600">5 million/ml</p>
    </div>
    <span className="material-icons-outlined text-red-600 text-4xl">
      bloodtype
    </span>
  </div>
</section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Body Fluid Composition */}
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h3 className="text-lg font-semibold text-gray-700 mb-4">
      Body Fluid Composition
    </h3>
    <img
      src="/body-fluid-chart.jpg" // Replace with an actual chart image or library integration
      alt="Body Fluid Composition Chart"
      className="w-full"
    />
  </div>

  {/* Composition of Solids */}
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h3 className="text-lg font-semibold text-gray-700 mb-4">
      Composition of Solids
    </h3>
    <img
      src="/solid-composition-chart.jpg" // Replace with an actual chart image or library integration
      alt="Solid Composition Chart"
      className="w-full"
    />
  </div>
</section>


        {/* Upcoming Events */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
  {/* Upcoming Check-Up */}
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h3 className="text-lg font-semibold text-gray-700 mb-4">
      Upcoming Check-Up
    </h3>
    <div className="border rounded-lg p-4 text-center">
      <p className="text-sm font-medium text-gray-600">January 2024</p>
      <div className="grid grid-cols-7 gap-2 mt-4">
        {[...Array(31)].map((_, index) => (
          <span
            key={index}
            className={`text-sm p-2 rounded-full ${
              index + 1 === 10
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {index + 1}
          </span>
        ))}
      </div>
    </div>
  </div>

  {/* Last Health Check */}
  <div className="bg-white p-6 rounded-lg shadow-lg col-span-2">
    <h3 className="text-lg font-semibold text-gray-700 mb-4">
      Last Health Check
    </h3>
    <ul className="space-y-4">
      <li className="flex justify-between items-center">
        <p className="text-sm font-medium text-gray-600">
          Dental Health - Dec 10, 2023
        </p>
        <span className="text-xs text-gray-500">Completed</span>
      </li>
      <li className="flex justify-between items-center">
        <p className="text-sm font-medium text-gray-600">
          BrainIQ Test - Oct 20, 2023
        </p>
        <span className="text-xs text-gray-500">Completed</span>
      </li>
      <li className="flex justify-between items-center">
        <p className="text-sm font-medium text-gray-600">
          Regular Kidney Check - Aug 15, 2023
        </p>
        <span className="text-xs text-gray-500">Completed</span>
      </li>
    </ul>
  </div>
</section>

      </main>
    </div>
  );
};

export default Dashboard;
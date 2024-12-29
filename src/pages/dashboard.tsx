import Link from 'next/link';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState } from 'react';
import Image from 'next/image';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg flex justify-between items-center">
    <div>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
    <span className={`material-icons-outlined ${color} text-4xl`}>{icon}</span>
  </div>
);

const NavigationLink = ({ href, icon, title }) => (
  <li title={title}>
    <Link
      href={href}
      className="flex items-center justify-center w-14 h-14 rounded-lg hover:bg-blue-800 transition-all duration-300"
    >
      <span className="material-icons-outlined text-2xl">{icon}</span>
    </Link>
  </li>
);

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-20 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 shadow-xl flex flex-col justify-between items-center">
        {/* Profile Icon */}
        <div className="mb-8">
          <Image
            src="/hospital-logo.jpg"
            alt="Hospital Logo"
            width={48}
            height={48}
            className="rounded-full shadow-md"
          />
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="flex flex-col space-y-6 items-center">
            <NavigationLink href="/patients" icon="people" title="View Patients" />
            <NavigationLink href="/doctors" icon="person" title="View Doctors" />
            <NavigationLink href="/appointments" icon="event" title="Appointments" />
            <NavigationLink href="/reports" icon="description" title="Reports" />
            <NavigationLink href="/settings" icon="settings" title="Settings" />
          </ul>
        </nav>

        {/* Logout */}
        <Link
          href="/logout"
          className="flex items-center justify-center w-14 h-14 rounded-lg hover:bg-blue-800 transition-all duration-300"
        >
          <span className="material-icons-outlined text-2xl">logout</span>
        </Link>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Welcome Header */}
        <header className="bg-white shadow-lg rounded-lg p-8 mb-6 flex items-center space-x-6">
          <Image
            src="/profile-picture.jpg"
            alt="User Profile"
            width={64}
            height={64}
            className="rounded-full shadow-md"
          />
          <div>
            <h1 className="text-4xl font-extrabold text-blue-600">Welcome Back, Dr. Mera Malaika!</h1>
            <p className="text-gray-600 mt-2 text-lg">Have you had a routine health check this month?</p>
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
          <StatCard title="Heart Rate" value="80 bpm" icon="favorite" color="text-blue-600" />
          <StatCard title="Lung Capacity" value="4.75 L" icon="air" color="text-green-600" />
          <StatCard title="Blood Cells" value="5 million/ml" icon="bloodtype" color="text-red-600" />
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Body Fluid Composition</h3>
            <img
              src="/body-fluid-chart.jpg"
              alt="Body Fluid Composition Chart"
              className="w-full"
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Composition of Solids</h3>
            <img
              src="/solid-composition-chart.jpg"
              alt="Solid Composition Chart"
              className="w-full"
            />
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Calendar */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Upcoming Check-Up</h3>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              className="react-calendar"
            />
            <p className="text-sm text-gray-600 mt-4">
              Selected Date: <span className="font-medium">{selectedDate.toDateString()}</span>
            </p>
          </div>

          {/* Last Health Check */}
          <div className="bg-white p-6 rounded-lg shadow-lg col-span-2">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Last Health Check</h3>
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-600">Dental Health - Dec 10, 2023</p>
                <span className="text-xs text-gray-500">Completed</span>
              </li>
              <li className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-600">BrainIQ Test - Oct 20, 2023</p>
                <span className="text-xs text-gray-500">Completed</span>
              </li>
              <li className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-600">Regular Kidney Check - Aug 15, 2023</p>
                <span className="text-xs text-gray-500">Completed</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Insurance Balance */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Insurance Balance</h3>
            <p className="text-2xl font-bold text-green-600 mb-4">$24,000</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all">
              View Card
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
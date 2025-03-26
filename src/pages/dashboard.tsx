import Link from 'next/link';
import { useRouter } from 'next/router';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAppContext } from "../context/AppContext";

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
}

// const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
//   <div className="bg-white p-6 rounded-lg shadow-lg flex justify-between items-center">
//     <div>
//       <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
//       <p className={`text-2xl font-bold ${color || 'text-gray-800'}`}>{value}</p>
//     </div>
//     <span className={`material-icons-outlined ${color || 'text-gray-500'} text-4xl`}>{icon}</span>
//   </div>
// );

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const [open, setOpen] = useState(false);

  const handleCardClick = () => {
    setOpen(true);
  };

  return (
    <>
      <div
        className="bg-white p-6 rounded-lg shadow-lg flex justify-between items-center cursor-pointer"
        onClick={handleCardClick}
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          <p className={`text-2xl font-bold ${color || 'text-gray-800'}`}>{value}</p>
        </div>
        <span className={`material-icons-outlined ${color || 'text-gray-500'} text-4xl`}>
          {icon}
        </span>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-96">
            <h3 className="text-xl font-semibold">{title} History</h3>
            {/* Here you can show a graph or other detailed data */}
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

interface NavigationLinkProps {
  href: string;
  icon: string;
  title: string;
}

const NavigationLink: React.FC<NavigationLinkProps> = ({ href, icon, title }) => (
  <li title={title}>
    <Link
      href={href}
      className="flex items-center justify-center w-14 h-14 rounded-lg hover:bg-blue-800 transition-all duration-300"
    >
      <span className="material-icons-outlined text-2xl">{icon}</span>
    </Link>
  </li>
);

const Dashboard: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | [Date, Date] | null>(new Date());
  const router = useRouter();
  const { user } = useAppContext();
  const userRole = user?.role;
  console.log(userRole);

  useEffect(() => {
    if (!userRole) {
      router.replace("/login"); // Redirect if no role is found
    }
    // if (userRole === "labTechnician" && router.pathname !== "/reports") {
    //   router.replace("/reports");
    // }
  }, [router, userRole]);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // const fetchHealthData = (date: Date) => {
  //   // This function can fetch health data related to the selected date
  //   // You can display appointments, reports, or reminders related to that date.
  // };

  const handleDateChange = (value: Date | [Date, Date] | null) => {
    if (value instanceof Date || Array.isArray(value)) {
        setSelectedDate(value as Date | [Date, Date]); // Type assertion
         // Fetch health events for the selected date
    // fetchHealthData(value);
    }
};

if (!isClient) {
  return null; // Optionally show a loading indicator or fallback UI
};

  // Handle logout functionality
  const handleLogout = () => {
    // Clear session storage or cookies (depending on your authentication mechanism)
    localStorage.removeItem('authToken'); // Example: clearing localStorage
    sessionStorage.removeItem('authToken'); // Example: clearing sessionStorage
    // Redirect to the login page
    router.replace('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-16 md:w-64 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 shadow-xl flex flex-col justify-between items-center">
  <div className="mb-4 w-30 h-30">
    <Image
      src="/assets/hospital-icon.png"
      alt="Hospital Logo"
      width={64}
      height={64}
      className="rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
    />
  </div>

  <nav>
    <ul className="flex flex-col space-y-4 items-center">
      <NavigationLink href="/patients" icon="people" title="View Patients" />
      <NavigationLink href="/doctors" icon="person" title="View Doctors" />
      <NavigationLink href="/appointments" icon="event" title="Appointments" />
      <NavigationLink href="/reports" icon="description" title="Reports" />
      <NavigationLink href="/pharmacy" icon="medication" title="Pharmacy" />
      <NavigationLink href="/biling/finance-dashboard" icon="monetization_on" title="Finances" />
      <NavigationLink href="/settings" icon="settings" title="Settings" />

            {/* Navigation Links */}
            {/* {checkAccess(["admin", "doctor"]) && <NavigationLink href="/patients" icon="people" title="View Patients" />}
            {checkAccess(["admin", "doctor", "nurse"]) && <NavigationLink href="/doctors" icon="event" title="View Doctors" />}
            {checkAccess(["admin", "doctor", "nurse"]) && <NavigationLink href="/appointments" icon="event" title="Appointments" />}
            {checkAccess(["admin", "lab_technician"]) && <NavigationLink href="/reports" icon="description" title="Lab Reports" />}
            {checkAccess(["admin", "pharmacist"]) && <NavigationLink href="/pharmacy" icon="medication" title="Pharmacy" />}
            {checkAccess(["admin"]) && <NavigationLink href="/settings" icon="settings" title="Settings" />} */}

          </ul>
        </nav>

        <button
    onClick={handleLogout}
    className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500 hover:bg-blue-700 transition-all duration-300"
  >
    <span className="material-icons-outlined text-xl">logout</span>
  </button>

      </aside>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-8">
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
          <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-blue-600">Welcome, Dr. {user && user.name}!</h1>
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

        {/* Calendar and Health Data */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Calendar */}
          <div className="bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Upcoming Check-Up</h3>
            <Calendar
              onChange={(value) => handleDateChange(value as Date | [Date, Date] | null)} 
              value={selectedDate}
            />
            <p className="text-sm text-gray-600 mt-4">
        Selected Date:{" "}
        <span className="font-medium">
          {Array.isArray(selectedDate)
            ? `${selectedDate[0]?.toDateString()} - ${selectedDate[1]?.toDateString()}`
            : selectedDate?.toDateString() || "None"}
        </span>
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
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-green-600 h-2" style={{ width: '60%' }}></div> {/* Adjust width dynamically */}
          </div>
          <button className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            View Card
          </button>
        </div>
        </section>
      </main>
    </div>

  );};

export default Dashboard;
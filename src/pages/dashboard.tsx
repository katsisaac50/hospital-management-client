import Link from 'next/link';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Hospital Dashboard</h2>
        </div>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                href="/patients"
                className="block px-6 py-3 hover:bg-blue-600 transition-colors rounded-l-md"
              >
                🏥 View Patients
              </Link>
            </li>
            <li>
              <Link
                href="/doctors"
                className="block px-6 py-3 hover:bg-blue-600 transition-colors rounded-l-md"
              >
                👩‍⚕️ View Doctors
              </Link>
            </li>
            <li>
              <Link
                href="/appointments"
                className="block px-6 py-3 hover:bg-blue-600 transition-colors rounded-l-md"
              >
                📅 Appointments
              </Link>
            </li>
            <li>
              <Link
                href="/reports"
                className="block px-6 py-3 hover:bg-blue-600 transition-colors rounded-l-md"
              >
                📊 Reports
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-auto p-6">
          <Link
            href="/logout"
            className="block text-center bg-red-600 hover:bg-red-500 transition-colors py-2 px-4 rounded-md"
          >
            🚪 Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Welcome Header */}
        <header className="bg-white shadow p-6 rounded-md mb-6">
          <h1 className="text-3xl font-bold text-blue-700">
            Welcome Back, Dr. John Doe!
          </h1>
          <p className="text-gray-600 mt-2">
            Keep track of your patients and appointments today.
          </p>
        </header>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-6">
          <Link
            href="/patients"
            className="bg-green-500 text-white p-6 rounded-md shadow hover:bg-green-600 transition"
          >
            🏥 View Patients
          </Link>
          <Link
            href="/doctors"
            className="bg-blue-500 text-white p-6 rounded-md shadow hover:bg-blue-600 transition"
          >
            👩‍⚕️ View Doctors
          </Link>
          <Link
            href="/appointments"
            className="bg-purple-500 text-white p-6 rounded-md shadow hover:bg-purple-600 transition"
          >
            📅 Manage Appointments
          </Link>
          <Link
            href="/reports"
            className="bg-orange-500 text-white p-6 rounded-md shadow hover:bg-orange-600 transition"
          >
            📊 View Reports
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Hospital Management System</h1>
      </header>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center py-20">
        <h2 className="text-4xl font-bold mb-4">Welcome to the Hospital Management System</h2>
        <p className="text-lg mb-8">
          Streamline hospital operations, manage patients, and enhance care with our cutting-edge platform.
        </p>
        <Link href="/login" legacyBehavior>
          <a className="px-6 py-3 bg-white text-blue-600 font-semibold rounded shadow-lg hover:bg-gray-100">
            Get Started
          </a>
        </Link>
      </div>

      {/* Features Section */}
      <div className="bg-white text-gray-800 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-6">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border rounded shadow-sm text-center">
              <h4 className="text-xl font-bold mb-2">Patient Management</h4>
              <p>Efficiently manage patient records, appointments, and histories.</p>
            </div>
            <div className="p-6 border rounded shadow-sm text-center">
              <h4 className="text-xl font-bold mb-2">Doctor Scheduling</h4>
              <p>Keep track of doctor schedules and availability seamlessly.</p>
            </div>
            <div className="p-6 border rounded shadow-sm text-center">
              <h4 className="text-xl font-bold mb-2">Comprehensive Reports</h4>
              <p>Generate detailed reports to analyze hospital operations.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 bg-gray-800 text-gray-400">
        <p>&copy; 2024 Hospital Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
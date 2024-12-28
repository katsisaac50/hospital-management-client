import Link from 'next/link';

const Dashboard = () => {
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <Link href="/patients" className="bg-green-500 text-white p-4 rounded">
          View Patients
        </Link>
        <Link href="/doctors" className="bg-blue-500 text-white p-4 rounded">
          View Doctors
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;

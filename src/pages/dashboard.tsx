"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  AccountCircle,
  Event,
  LocalPharmacy,
  Description,
  Inventory,
  Science,
  Settings,
  Logout,
} from "@mui/icons-material";
import { useAppContext } from "../context/AppContext";
import { removeAuthToken } from "../../utils/auth";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, setUser } = useAppContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTimeout(() => {
        if (!user) {
          router.push("/login");
        }
      }, 500);
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Please log in to access the dashboard.</p>
      </div>
    );
  }

  const handleLogout = () => {
    setUser(null);
    removeAuthToken();
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`bg-blue-600 text-white p-6 shadow-lg flex flex-col items-center transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="mb-6 text-xl bg-white text-blue-600 p-2 rounded-full"
        >
          {sidebarCollapsed ? "☰" : "✖"}
        </button>

        <Image
          src="/assets/bismillah-medical-center-logo.jpeg"
          alt="Hospital Logo"
          width={48}
          height={48}
          className="rounded-full shadow-md"
        />

        <nav className="mt-6 space-y-6 flex flex-col items-center">
          {[  
            ["/patients", <AccountCircle />, "Patients"],
            ["/appointments", <Event />, "Appointments"],
            ["/pharmacy", <LocalPharmacy />, "Pharmacy"],
            // ["/inventory", <Inventory />, "Inventory"],
            ["/laboratory", <Science />, "Laboratory"],
            ["/reports", <Description />, "Reports"],
            ["/settings", <Settings />, "Settings"],
          ].map(([href, icon, title]) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-center w-14 h-14 rounded-lg hover:bg-blue-800"
            >
              {icon}
              {!sidebarCollapsed && <span className="ml-3">{title}</span>}
            </Link>
          ))}
        </nav>

        <button onClick={handleLogout} className="mt-auto p-4 hover:bg-blue-800">
          <Logout className="text-2xl" />
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="bg-white shadow-lg rounded-lg p-8 mb-6 flex items-center space-x-6">
          <Image
            src="/profile-picture.jpg"
            alt="User Profile"
            width={64}
            height={64}
            className="rounded-full shadow-md"
          />
          <div>
            <h1 className="text-4xl font-bold text-blue-600">
              Welcome Back, {user.username}!
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Have you had a routine health check this month?
            </p>
            <div className="mt-4 flex space-x-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Check Now
              </button>
              <button className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">
                View Report
              </button>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Upcoming Check-Up
            </h3>
            <Calendar onChange={setSelectedDate} value={selectedDate} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg col-span-2">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Last Health Check
            </h3>
            <ul className="space-y-4">
              {["Dental Health - Dec 10, 2023", "BrainIQ Test - Oct 20, 2023", "Kidney Check - Aug 15, 2023"].map((item, index) => (
                <li key={index} className="flex justify-between">
                  <p className="text-sm font-medium text-gray-600">{item}</p>
                  <span className="text-xs text-gray-500">Completed</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

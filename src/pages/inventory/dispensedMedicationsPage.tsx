import React, { useState, useEffect, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTheme } from "../../context/ThemeContext"; // Adjust the path

interface Medication {
  patientName: string;
  medicationName: string;
  dosage: string;
  quantity: number;
  price: number;
  dateDispensed: string;
  prescribingDoctor: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const DispensedMedicationsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [filteredMedications, setFilteredMedications] = useState<Medication[]>([]);
  const [filter, setFilter] = useState({
    patientName: "",
    medicationName: "",
    dateRange: [null, null] as [Date | null, Date | null],
  });
  const [loading, setLoading] = useState(false);

  // // Mock Data
  // const mockData: Medication[] = [
  //   {
  //     patientName: "John Doe",
  //     medicationName: "Aspirin",
  //     dosage: "500mg",
  //     quantity: 20,
  //     price: 5.0,
  //     dateDispensed: "2025-03-10",
  //     prescribingDoctor: "Dr. Smith",
  //   },
  //   {
  //     patientName: "Jane Smith",
  //     medicationName: "Ibuprofen",
  //     dosage: "200mg",
  //     quantity: 30,
  //     price: 2.5,
  //     dateDispensed: "2025-03-12",
  //     prescribingDoctor: "Dr. Williams",
  //   },
  // ];




  // useEffect(() => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setMedications(mockData);
  //     setLoading(false);
  //   }, 1000);
  // }, []);

  useEffect(() => {
    const fetchDispensedProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/medicine/dispensed`);
        const data = await response.json();
        console.log(data)

        if (response.ok) {
          setMedications(data);
        } else {
          console.error('Error fetching dispensed products:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDispensedProducts();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  useEffect(() => {
    let filtered = medications;
    if (filter.patientName) {
      filtered = filtered.filter((med) =>
        med.patientName.toLowerCase().includes(filter.patientName.toLowerCase())
      );
    }
    if (filter.medicationName) {
      filtered = filtered.filter((med) =>
        med.medicationName.toLowerCase().includes(filter.medicationName.toLowerCase())
      );
    }
    if (filter.dateRange[0] && filter.dateRange[1]) {
      const [startDate, endDate] = filter.dateRange;
      filtered = filtered.filter((med) => {
        const medDate = new Date(med.dateDispensed);
        return medDate >= startDate && medDate <= endDate;
      });
    }
    setFilteredMedications(filtered);
  }, [filter, medications]);

  const calculateGrandTotal = () => {
    return filteredMedications.reduce((total, med) => total + med.price * med.quantity, 0);
  };

  const handleExport = () => {
    const csvData = filteredMedications.map((med) => ({
      "Patient Name": med.patientName,
      "Medication Name": med.medicationName,
      Dosage: med.dosage,
      Quantity: med.quantity,
      Price: med.price,
      "Total Price": med.price * med.quantity,
      "Date Dispensed": med.dateDispensed,
      "Prescribing Doctor": med.prescribingDoctor,
    }));

    const csvContent = [
      Object.keys(csvData[0]),
      ...csvData.map((med) => Object.values(med)),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "dispensed_medications.csv");
    a.click();
  };

  const filterFields = [
    { name: "patientName", placeholder: "Search by Patient Name" },
    { name: "medicationName", placeholder: "Search by Medication Name" },
    { name: "dateRange", placeholder: "Select Date Range" },
  ];

  return (
    <div className={`container mx-auto p-6 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dispensed Medications</h1>
        <button 
          onClick={() => window.history.back()} 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Filter Section */}
      <div className="mb-4 flex flex-wrap gap-4">
        {filterFields.map((field) => (
          <div key={field.name} className="flex-1">
            {field.name === "dateRange" ? (
              <DatePicker
                selected={filter.dateRange[0]}
                onChange={(dates: [Date | null, Date | null]) =>
                  setFilter((prev) => ({ ...prev, dateRange: dates }))
                }
                selectsRange
                startDate={filter.dateRange[0]}
                endDate={filter.dateRange[1]}
                isClearable
                placeholderText={field.placeholder}
                className={`px-4 py-2 border rounded-lg ${theme === "dark" ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
              />
            ) : (
              <input
                type="text"
                placeholder={field.placeholder}
                value={filter[field.name as keyof typeof filter]}
                onChange={(e) => setFilter((prev) => ({ ...prev, [field.name]: e.target.value }))}
                className={`px-4 py-2 border rounded-lg ${theme === "dark" ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
              />
            )}
          </div>
        ))}

        <button
          onClick={handleExport}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg"
        >
          Export to CSV
        </button>
      </div>

      {/* Loading State */}
      {loading && <p>Loading...</p>}

      {/* Medication Table */}
      {!loading && filteredMedications.length > 0 && (
        <>
          <table className={`table-auto w-full text-left border-collapse ${theme === "dark" ? "border-gray-700" : "border-gray-300"}`}>
            <thead>
              <tr>
                {["Patient Name", "Medication Name", "Dosage", "Quantity", "Price", "Total Price", "Date Dispensed", "Dispensed By"].map((header) => (
                  <th key={header} className={`border px-4 py-2 ${theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-gray-100"}`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredMedications.map((med, index) => (
                <tr key={index} className={theme === "dark" ? "bg-gray-900" : "bg-white"}>
                  <td className="border px-4 py-2">{med.patientName}</td>
                  <td className="border px-4 py-2">{med.medicationName}</td>
                  <td className="border px-4 py-2">{med.dosage}</td>
                  <td className="border px-4 py-2">{med.quantity}</td>
                  <td className="border px-4 py-2">UGX {med.price}</td>
                  <td className="border px-4 py-2">UGX {(med.price * med.quantity).toFixed(2)}</td>
                  <td className="border px-4 py-2">{med.dateDispensed}</td>
                  <td className="border px-4 py-2">{med.dispensedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Grand Total */}
          <div className="mt-4 text-right">
            <p className="text-xl font-semibold">
              Grand Total: UGX {calculateGrandTotal().toFixed(2)}
            </p>
          </div>
        </>
      )}

      {!loading && filteredMedications.length === 0 && <p>No medications found</p>}
    </div>
  );
};

export default DispensedMedicationsPage;

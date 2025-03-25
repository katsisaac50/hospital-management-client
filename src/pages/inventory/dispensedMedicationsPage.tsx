import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker"; // You can use any date picker library of your choice
import "react-datepicker/dist/react-datepicker.css";

interface Medication {
  patientName: string;
  medicationName: string;
  dosage: string;
  quantity: number;
  price: number; // Price per unit
  dateDispensed: string;
  prescribingDoctor: string;
}

const DispensedMedicationsPage: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [filteredMedications, setFilteredMedications] = useState<Medication[]>([]);
  console.log('hello aha')
  const [filter, setFilter] = useState({
    patientName: "",
    medicationName: "",
    dateRange: [null, null] as [Date | null, Date | null],
  });
  const [loading, setLoading] = useState(false);

  
// Mock data for demonstration (including price)
const mockData: Medication[] = [
  {
    patientName: "John Doe",
    medicationName: "Aspirin",
    dosage: "500mg",
    quantity: 20,
    price: 5.0, // Price per unit
    dateDispensed: "2025-03-10",
    prescribingDoctor: "Dr. Smith",
  },
  {
    patientName: "Jane Smith",
    medicationName: "Ibuprofen",
    dosage: "200mg",
    quantity: 30,
    price: 2.5, // Price per unit
    dateDispensed: "2025-03-12",
    prescribingDoctor: "Dr. Williams",
  },
];

  useEffect(() => {
    setLoading(true);
    // Fetch the medications data from an API or a local file
    // Simulating a delay with setTimeout
    setTimeout(() => {
      setMedications(mockData); // Replace with your actual data fetching logic
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Apply filters whenever filter changes
    let filtered = medications;
    if (filter.patientName) {
      filtered = filtered.filter((med) =>
        med.patientName.toLowerCase().includes(filter.patientName.toLowerCase())
      );
    }
    if (filter.medicationName) {
      filtered = filtered.filter((med) =>
        med.medicationName
          .toLowerCase()
          .includes(filter.medicationName.toLowerCase())
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

  // Calculate the grand total based on filtered medications
  const calculateGrandTotal = () => {
    return filteredMedications.reduce((total, med) => {
      return total + med.price * med.quantity;
    }, 0);
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

  return (
    <div className="container mx-auto p-6">
      {/* Filter Section */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Patient Name"
          value={filter.patientName}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, patientName: e.target.value }))
          }
          className="px-4 py-2 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Search by Medication Name"
          value={filter.medicationName}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, medicationName: e.target.value }))
          }
          className="px-4 py-2 border rounded-lg ml-4"
        />
        <DatePicker
          selected={filter.dateRange[0]}
          onChange={(dates: [Date | null, Date | null]) =>
            setFilter((prev) => ({ ...prev, dateRange: dates }))
          }
          selectsRange
          startDate={filter.dateRange[0]}
          endDate={filter.dateRange[1]}
          isClearable
          className="px-4 py-2 border rounded-lg ml-4"
        />
        <button
          onClick={handleExport}
          className="ml-4 bg-blue-500 text-white px-6 py-2 rounded-lg"
        >
          Export to CSV
        </button>
      </div>

      {/* Loading State */}
      {loading && <p>Loading...</p>}

      {/* Medication Table */}
      {!loading && filteredMedications.length > 0 && (
        <>
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Patient Name</th>
                <th className="border px-4 py-2">Medication Name</th>
                <th className="border px-4 py-2">Dosage</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Total Price</th>
                <th className="border px-4 py-2">Date Dispensed</th>
                <th className="border px-4 py-2">Prescribing Doctor</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedications.map((med, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{med.patientName}</td>
                  <td className="border px-4 py-2">{med.medicationName}</td>
                  <td className="border px-4 py-2">{med.dosage}</td>
                  <td className="border px-4 py-2">{med.quantity}</td>
                  <td className="border px-4 py-2">${med.price}</td>
                  <td className="border px-4 py-2">${med.price * med.quantity}</td>
                  <td className="border px-4 py-2">{med.dateDispensed}</td>
                  <td className="border px-4 py-2">{med.prescribingDoctor}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Grand Total */}
          <div className="mt-4 text-right">
            <p className="text-xl font-semibold">
              Grand Total: ${calculateGrandTotal().toFixed(2)}
            </p>
          </div>
        </>
      )}

      {/* No Data */}
      {!loading && filteredMedications.length === 0 && <p>No medications found</p>}
    </div>
  );
};


export default DispensedMedicationsPage;
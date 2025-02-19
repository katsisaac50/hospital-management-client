import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from "next/router";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const DischargeForm = () => {
  const router = useRouter();
  const { patientId} = router.query;
  console.log(router.query)
  const [dischargeData, setDischargeData] = useState(null);
  
  useEffect(() => {
    const fetchDischargeForm = async () => {
      try {
        const response = await axios.get(`${API_URL}/discharge/${patientId}`);
        console.log("Fetching:", `${API_URL}/discharge/${patientId}`);

        setDischargeData(response.data);
      } catch (error) {
        console.error('Error fetching discharge form:', error);
      }
    };
    
    fetchDischargeForm();
  }, [patientId]);
  
  if (!dischargeData) return <p>Loading discharge form...</p>;

  return (
    <div>
      <h3>Discharge Summary</h3>
      <p><strong>Final Diagnosis:</strong> {dischargeData.finalDiagnosis}</p>
      <p><strong>Medications on Discharge:</strong> {dischargeData.medicationsOnDischarge.join(', ')}</p>
      <div>
        <strong>Follow-up Appointments:</strong>
        {dischargeData.followUpAppointments.map((appointment, index) => (
          <div key={index}>
            <p>{appointment.date} - {appointment.reason}</p>
          </div>
        ))}
      </div>
      <p><strong>Discharge Instructions:</strong> {dischargeData.dischargeInstructions}</p>
      <p><strong>Doctor's Notes:</strong> {dischargeData.doctorNotes}</p>
    </div>
  );
};

export default DischargeForm;

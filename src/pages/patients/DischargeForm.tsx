import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from "next/router";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const DischargeForm = () => {
  const router = useRouter();
  const { patientId } = router.query;

  const [dischargeData, setDischargeData] = useState(null);
  const [formData, setFormData] = useState({
    finalDiagnosis: '',
    medicationsOnDischarge: [],
    followUpAppointments: [{ date: '', reason: '' }],
    dischargeInstructions: '',
    doctorNotes: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!patientId) return;

    const fetchDischargeForm = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/discharge/${patientId}`);
        setDischargeData(response.data);
        setError(null);
      } catch (error) {
        setError('Error fetching discharge form: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchDischargeForm();
  }, [patientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFollowUpChange = (index, e) => {
    const { name, value } = e.target;
    const newFollowUpAppointments = [...formData.followUpAppointments];
    newFollowUpAppointments[index][name] = value;
    setFormData((prevData) => ({
      ...prevData,
      followUpAppointments: newFollowUpAppointments
    }));
  };

  const handleAddFollowUp = () => {
    setFormData((prevData) => ({
      ...prevData,
      followUpAppointments: [...prevData.followUpAppointments, { date: '', reason: '' }]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/discharge/${patientId}`, formData);
      alert('Discharge form saved successfully!');
    } catch (error) {
      console.error('Error saving discharge form:', error);
    }
  };

  if (loading) return <p>Loading discharge form...</p>;
  // if (error) return <p style={{ color: 'red' }}>{error}</p>;

  // Add this console log to see if `dischargeData` is `null` when expected
  console.log('dischargeData:', dischargeData);

  return (
    <div>
      <h3>Discharge Summary</h3>
      
      {/* If no discharge form is found, show the "Create Discharge Form" button */}
      {!dischargeData||error && (
        <button onClick={() => setFormData({
          finalDiagnosis: '',
          medicationsOnDischarge: [],
          followUpAppointments: [{ date: '', reason: '' }],
          dischargeInstructions: '',
          doctorNotes: ''
        })}>
          Create Discharge Form
        </button>
      )}

      {/* Form to create or edit the discharge form */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Final Diagnosis</label>
          <input
            type="text"
            name="finalDiagnosis"
            value={formData.finalDiagnosis || dischargeData?.finalDiagnosis || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Medications on Discharge</label>
          <input
            type="text"
            name="medicationsOnDischarge"
            value={formData.medicationsOnDischarge.join(', ') || dischargeData?.medicationsOnDischarge.join(', ')}
            onChange={(e) => handleChange({ target: { name: 'medicationsOnDischarge', value: e.target.value.split(', ') } })}
          />
        </div>

        <div>
          <label>Follow-up Appointments</label>
          {formData.followUpAppointments.map((appointment, index) => (
            <div key={index}>
              <input
                type="date"
                name="date"
                value={appointment.date || dischargeData?.followUpAppointments[index]?.date || ''}
                onChange={(e) => handleFollowUpChange(index, e)}
              />
              <input
                type="text"
                name="reason"
                value={appointment.reason || dischargeData?.followUpAppointments[index]?.reason || ''}
                onChange={(e) => handleFollowUpChange(index, e)}
              />
            </div>
          ))}
          <button type="button" onClick={handleAddFollowUp}>Add Follow-up Appointment</button>
        </div>

        <div>
          <label>Discharge Instructions</label>
          <input
            type="text"
            name="dischargeInstructions"
            value={formData.dischargeInstructions || dischargeData?.dischargeInstructions || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Doctor's Notes</label>
          <textarea
            name="doctorNotes"
            value={formData.doctorNotes || dischargeData?.doctorNotes || ''}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Save Discharge Form</button>
      </form>

      {/* If discharge form is found, show the existing form */}
      {dischargeData && (
        <>
          <h4>Existing Discharge Summary</h4>
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
        </>
      )}
    </div>
  );
};

export default DischargeForm;

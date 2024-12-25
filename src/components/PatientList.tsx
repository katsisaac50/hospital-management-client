import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PatientList = () => {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/patients');
                setPatients(response.data);
            } catch (error) {
                console.error("Error fetching patients:", error);
            }
        };
        fetchPatients();
    }, []);

    return (
        <div>
            <h3>Patients List</h3>
            <ul>
                {patients.map(patient => (
                    <li key={patient._id}>
                        {patient.name} - {patient.age} years old
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PatientList;

import React, { useState } from 'react';
import axios from 'axios';

const AddPatientForm = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [contact, setContact] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/patients', {
                name,
                age,
                gender,
                contact,
            });
            alert("Patient added successfully!");
            setName('');
            setAge('');
            setGender('');
            setContact('');
        } catch (error) {
            console.error("Error adding patient:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <label>Age:</label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
            </div>
            <div>
                <label>Gender:</label>
                <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} required />
            </div>
            <div>
                <label>Contact:</label>
                <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} required />
            </div>
            <button type="submit">Add Patient</button>
        </form>
    );
};

export default AddPatientForm;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PatientsPage from './pages/PatientsPage';
import AddPatientPage from './pages/AddPatientPage';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/patients" element={<PatientsPage />} />
                <Route path="/add-patient" element={<AddPatientPage />} />
            </Routes>
        </Router>
    );
};

export default App;

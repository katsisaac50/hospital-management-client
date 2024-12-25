import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <h2>Hospital Management</h2>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/patients">Patients</Link></li>
                <li><Link to="/add-patient">Add Patient</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;

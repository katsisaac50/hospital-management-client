// import React from 'react';
// import Link from 'next/link'; // Import next/link for navigation

// const Navbar = () => {
//     return (
//         <nav>
//             <h2>Hospital Management</h2>
//             <ul>
//           <li>
//             <Link href="/">Home</Link>
//           </li>
//           <li>
//             <Link href="/patients">Patients</Link>
//           </li>
//           <li>
//             <Link href="/add-patient">Add Patient</Link>
//           </li>
//         </ul>
//         </nav>
//     );
// };

// export default Navbar;

import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/patients">Patients</Link>
        </li>
        <li>
          <Link href="/doctors">Doctors</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

import Navbar from '../components/Navbar';
import Link from 'next/link';

const Home = () => {
  return (
    <div>
      <h1>Welcome to Hospital Management</h1>
      <Navbar />
      {/* <nav>
        <Link href="/patients">Patients</Link> | <Link href="/doctors">Doctors</Link>
      </nav> */}
    </div>
  );
};

export default Home;

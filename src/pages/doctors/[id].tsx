import { useRouter } from 'next/router';

const DoctorProfile = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Doctor Profile</h1>
      <p>Viewing profile for doctor ID: {id}</p>
    </div>
  );
};

export default DoctorProfile;

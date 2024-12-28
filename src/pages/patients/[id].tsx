import { useRouter } from 'next/router';

const PatientProfile = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Patient Profile</h1>
      <p>Viewing profile for patient ID: {id}</p>
    </div>
  );
};

export default PatientProfile;

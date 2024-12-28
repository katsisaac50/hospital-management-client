import { GetServerSideProps } from 'next';
import { verifyToken } from '../utils/auth';

const ProtectedPage = ({ user }: { user: any }) => {
  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold">Welcome, {user.role}</h1>
      <p>This is a protected page.</p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.req.cookies.token; // Ensure cookies are sent with the request
  const user = token ? verifyToken(token) : null;

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
};

export default ProtectedPage;

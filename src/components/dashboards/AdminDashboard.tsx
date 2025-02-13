import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAppContext } from "../../context/AppContext";

const AdminDashboard = () => {
  const { user } = useAppContext();
  
  const { data: users = [], isLoading } = useQuery(["users"], async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
    return data;
  });

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome, {user?.fullName}</p>

      {isLoading ? <p>Loading...</p> : (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              <strong>{user.fullName}</strong> - {user.role}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;

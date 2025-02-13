import Link from "next/link";
import { useAppContext } from "../context/AppContext";

const Sidebar = () => {
  const { user } = useAppContext();

  return (
    <nav>
      <ul>
        <li><Link href="/dashboard">Dashboard</Link></li>

        {user?.role === "doctor" && <li><Link href="/prescriptions">Prescriptions</Link></li>}
        {user?.role === "admin" && <li><Link href="/billing">Billing</Link></li>}
      </ul>
    </nav>
  );
};

export default Sidebar;

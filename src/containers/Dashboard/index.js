import React from "react";
import { useDispatch } from "react-redux";
import TableDashboard from "../../components/TableDashboard";
import { authActions } from "../../redux/actions/auth.actions";

function Dashboard() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(authActions.logout());
  };
  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <h1 className="heavyweight">
        Gibbon
        <br /> Calls
      </h1>
      <TableDashboard />
    </div>
  );
}

export default Dashboard;

import React from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../../redux/actions/auth.actions";

function Dashboard() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(authActions.logout());
  };
  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <h1>DASHB</h1>
    </div>
  );
}

export default Dashboard;

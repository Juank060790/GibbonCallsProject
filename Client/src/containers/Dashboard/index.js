import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import TableDashboard from "../../components/TableDashboard";
import { audioActions } from "../../redux/actions";
import { authActions } from "../../redux/actions/auth.actions";

// Dashboard (Main page with the table)

function Dashboard() {
  const [sortBy, setSortBy] = useState("audioId");
  const [order, setOrder] = useState("desc");
  const [limit, setLimit] = useState(10);
  const dispatch = useDispatch();
  const audios = useSelector((state) => state.audio);

  const handleLogout = () => {
    dispatch(authActions.logout());
  };

  useEffect(() => {
    if (!audios.lenght > 0) {
      dispatch(audioActions.audiosRequest());
    }
  }, [dispatch]);
  return (
    <div>
      <Button variant="success" onClick={handleLogout}>
        Logout
      </Button>
      <h1 className="heavyweight">
        Gibbon
        <br /> Calls
      </h1>
      <TableDashboard />
    </div>
  );
}

export default Dashboard;

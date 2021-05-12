import React from "react";
import Navbar from "../../components/Navbar";
import TableDashboard from "../../components/TableDashboard";

// Dashboard (Main page with the table)

function Dashboard() {
  return (
    <div>
      <Navbar />
      <TableDashboard />
    </div>
  );
}

export default Dashboard;

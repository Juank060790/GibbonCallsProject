import React from "react";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/Header";
import TableDashboard from "../../components/TableDashboard";

// Dashboard (Main page with the table)

function Dashboard() {
  return (
    <>
      <div>
        <Header />
        <TableDashboard />
      </div>
    </>
  );
}

export default Dashboard;

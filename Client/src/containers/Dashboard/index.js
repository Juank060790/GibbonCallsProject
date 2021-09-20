import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../components/Header";
import TableDashboard from "../../components/TableDashboard";

// Dashboard (Main page with the table)

function Dashboard() {
  return (
    <>
      <ToastContainer
        position="top-left"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div>
        <Header />
        <TableDashboard />
      </div>
    </>
  );
}

export default Dashboard;

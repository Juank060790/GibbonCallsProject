import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Routes from "./Routes";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
// import AlertMsg from "./layouts/Alerts";

library.add(fas);

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="App">
      <>
        {isAuthenticated === undefined ? (
          <div className="vh-100 vw-100 d-flex justify-content-center align-items-center">
            <ClipLoader color="#f86c6b" size={150} loading={true} />
          </div>
        ) : (
          <Router>
            {/* <AlertMsg /> */}
            <Routes />
          </Router>
        )}
      </>
    </div>
  );
}

export default App;

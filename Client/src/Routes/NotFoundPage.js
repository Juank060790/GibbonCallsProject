import React from "react";
import logoFF from "../images/logo-reduced.png";
const NotFoundPage = () => {
  return (
    <div className="notfoundpagecontainer">
      <div className="text-center notfoundpage">
        <h1>404</h1>
        <p>The page you are looking for does not exist.</p>
        <img src={logoFF} alt="logoFF" />
      </div>
    </div>
  );
};
export default NotFoundPage;

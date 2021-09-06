import logo from "../images/logo-reduced.png";
import { logoutUser } from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user.email);
  console.log(`user`, user);

  const HandleLogOut = () => {
    dispatch(logoutUser());
  };
  return (
    <div className="header-container">
      <input type="checkbox" id="active" />
      <div className="menu-btn-container">
        <label htmlFor="active" className="logoMenu menu-btn">
          <img className="imgLogo" src={logo} alt="FF" />
        </label>
      </div>
      <label htmlFor="active" className="close-menu"></label>
      <div className="wrapper-menu">
        <div className="inner-menu-container">
          <ul>
            <div className="inner-menu-column">
              <div className="inner-menu-item">{user}</div>
              <div className="inner-menu-item">
                <li>
                  <Button
                    className="m-2"
                    variant="success"
                    onClick={HandleLogOut}
                  >
                    Logout
                  </Button>
                </li>
              </div>
            </div>
          </ul>
        </div>
      </div>
      <div>
        <h1 className="heavyLight titleDashboard">
          {" "}
          Automated Passive Acoustic
          <br /> Monitoring for Cao Vit Gibbons
        </h1>{" "}
      </div>
    </div>
  );
}

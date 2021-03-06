import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/actions";
import logo from "../images/logo-reduced.png";
import { Button, Navbar, Container, NavbarBrand } from "react-bootstrap";
import React from "react";

export default function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);

  const HandleLogOut = () => {
    dispatch(logoutUser());
  };
  return (
    <Navbar className="navbar">
      <div>
        <img className="imgLogo" src={logo} alt="FFI logo" width="80rem" />
        <Navbar.Brand href="#home">
          <h3 className="heavyLight titleDashboard">
            Automated Acoustic Monitoring System
          </h3>
        </Navbar.Brand>
      </div>
      <Button variant="outline-dark" onClick={HandleLogOut}>
        Logout
      </Button>
    </Navbar>

    // <div className="header-container">
    //   <input type="checkbox" id="active" />
    //   <div className="menu-btn-container">
    //     <label htmlFor="active" className="logoMenu menu-btn">
    //       <img className="imgLogo" src={logo} alt="FF" />
    //     </label>
    //   </div>
    //   <label htmlFor="active" className="close-menu"></label>
    //   <div className="wrapper-menu">
    //     <div className="inner-menu-container">
    //       <ul>
    //         <div className="inner-menu-column">
    //           <div className="inner-menu-item">{user.userName}</div>
    //           <div className="inner-menu-item">{user.email}</div>
    //           <div className="inner-menu-item">
    //             <li>
    //               <Button
    //                 className="m-1"
    //                 variant="success"
    //                 onClick={HandleLogOut}
    //               >
    //                 Logout
    //               </Button>
    //             </li>
    //           </div>
    //         </div>
    //       </ul>
    //     </div>
    //   </div>
    //   <div>
    //     <h1 className="heavyLight titleDashboard">
    //       {" "}
    //       Automated Passive Acoustic
    //       <br /> Monitoring for Cao Vit Gibbons
    //     </h1>{" "}
    //   </div>
    // </div>
  );
}

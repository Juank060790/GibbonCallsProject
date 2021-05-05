import React from "react";
import { Button, Container, Nav } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { authActions } from "../redux/actions";
import logo from "../images/logo-reduced.png";

export default function Navbar() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(authActions.logout());
  };
  return (
    <Container fluid>
      <Nav className="NavBar m-2">
        <div>
          <Nav.Item>
            <Button variant="success" onClick={handleLogout}>
              Logout
            </Button>
          </Nav.Item>
          <Nav.Item>
            <h1 className="heavyLight">
              Gibbon
              <br /> Calls
            </h1>{" "}
          </Nav.Item>
        </div>
        <Nav.Item className="logoMenu">
          <img src={logo} alt="FF" width="auto" height="auto" />
        </Nav.Item>
      </Nav>
      <div className="bodySearch">
        {" "}
        <input className="search__input" type="text" placeholder="Search" />
      </div>
    </Container>
  );
}

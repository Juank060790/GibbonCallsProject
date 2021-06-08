import React, { useEffect, useState } from "react";
import { Button, Container, Nav } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { logoutUser, audioActions } from "../redux/actions";
import logo from "../images/logo-reduced.png";

export default function Navbar() {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState(null);

  useEffect(() => {
    if (searchQuery != null) {
      dispatch(audioActions.searchDocuments(searchQuery));
    }
    if (searchQuery === "") {
      console.log("Search query equal to zero");
    } else {
    }
  }, [dispatch, searchQuery]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const searchFunction = (e) => {
    if (e.charCode === 13) {
      setSearchQuery(e.target.value);
    } else {
    }
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
        <input
          className="search__input"
          type="text"
          onKeyPress={(e) => searchFunction(e)}
          placeholder="Search"
        />
      </div>
    </Container>
  );
}

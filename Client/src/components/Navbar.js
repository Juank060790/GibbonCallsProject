import React, { useEffect, useState } from "react";
import { Button, Container, Nav } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { logoutUser, audioActions } from "../redux/actions";
import logo from "../images/logo-reduced.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Navbar() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("audioId");
  const [inputType, setInputType] = useState("text");

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    if (query !== "" && category !== "recordDate") {
      dispatch(audioActions.searchDocuments(query, category));
    } else if (query === "" || null) {
      dispatch(audioActions.audiosRequest(10, "recordDate", "desc"));
    } else if (query !== "" && category === "recordDate") {
      var timestamp = Date.parse(query);
      if (isNaN(timestamp) === false) {
        var t = new Date(timestamp);
      }
      dispatch(audioActions.searchByDate(t, category));
    }
  }, [dispatch, query, category, inputType]);

  const searchByDate = (e) => {
    setCategory("recordDate");
    setInputType("date");
  };

  const categorySearch = (e) => {
    setCategory(e);
    setInputType("text");
    setQuery("");
  };

  return (
    <Container fluid>
      <Nav className="NavBar m-2">
        <Nav.Item>
          <Button variant="success" onClick={handleLogout}>
            Logout
          </Button>
        </Nav.Item>
        <Nav.Item className="titleDashboardContainer">
          <h1 className="heavyLight titleDashboard">
            Automated Passive Acoustic Monitoring for Cao Vit Gibbons
          </h1>{" "}
        </Nav.Item>

        <Nav.Item className="logoMenu">
          <img src={logo} alt="FF" width="auto" height="auto" />
        </Nav.Item>
      </Nav>

      <div className="d-flex bodySearch">
        {" "}
        <div className="dropdown">
          <button className="dropbtn">
            <FontAwesomeIcon
              className="savebutton"
              icon={["fas", "sort-down"]}
              size={"sm"}
            ></FontAwesomeIcon>{" "}
          </button>
          <div className="dropdown-content">
            <div onClick={() => categorySearch("audioId")}>Audio ID</div>
            <div onClick={() => categorySearch("duration")}>Duration</div>
            <div onClick={() => searchByDate("recordDate")}>Record Date</div>
          </div>
        </div>
        <form>
          <input
            value={query}
            className="search__input"
            type={inputType === "date" ? "date" : "text"}
            onChange={
              inputType === "date"
                ? (e) => setQuery(String(e.target.value))
                : (e) => setQuery(e.target.value)
            }
            // onKeyPress={(e) => searchInputFunction(e)}
            placeholder="Search by..."
          />
        </form>
      </div>
    </Container>
  );
}

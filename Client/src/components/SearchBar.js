import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { audioActions } from "../redux/actions";
import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";

export default function SearchBar() {
  const [inputType, setInputType] = useState("text");
  const [category, setCategory] = useState("audioId");
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

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
    setInputType("text");
    setCategory(e);
    setQuery("");
  };

  return (
    <>
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
    </>
  );
}

import React, { useEffect, useState } from "react";
import { audioActions } from "../redux/actions";
import { useDispatch } from "react-redux";

export default function SearchBar() {
  // eslint-disable-next-line
  const [category, setCategory] = useState("recordDate");
  // eslint-disable-next-line
  const [inputType, setInputType] = useState("date");
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

  // const searchByDate = (e) => {
  //   setCategory("recordDate");
  //   setInputType("date");
  // };

  // const categorySearch = (e) => {
  //   setInputType("text");
  //   setCategory(e);
  //   setQuery("");
  // };

  return (
    <>
      <div className="d-flex bodySearch">
        {" "}
        {/* <div className="dropdown">
          <button className="dropbtn">
            <FontAwesomeIcon
              className="savebutton"
              icon={["fas", "sort-down"]}
              size={"sm"}
            ></FontAwesomeIcon>{" "}
          </button>
          {/* <div className="dropdown-content"> */}
        {/* <div onClick={() => categorySearch("audioId")}>Audio ID</div> */}
        {/* <div onClick={() => categorySearch("duration")}>Duration</div> */}
        {/* <div onClick={() => searchByDate("recordDate")}>Record Date</div> */}
        {/* </div> */}
        {/* </div> */}
        <form>
          <input
            style={
              category === "duration"
                ? {
                    backgroundImage:
                      "url(data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3C/svg%3E)",
                  }
                : { backgroundColor: "" }
            }
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

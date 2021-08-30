import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useSelector } from "react-redux";
import "../App.css";

const PaginationItem = ({
  loading,
  handleClickOnPrev,
  handleClickOnNext,
  firstPage,
}) => {
  const audiosPerPage = useSelector((state) => state.audio.audio?.length);

  return (
    <div className="footerPagination">
      <div className="footerPaginationContainer ">
        <div className=" d-flex marginButtonPagination">
          <div className="previousNextbtn">
            <FontAwesomeIcon
              className="  paginationButton "
              icon={["fas", "chevron-left"]}
              onClick={() => handleClickOnPrev()}
            ></FontAwesomeIcon>
          </div>

          <div className="previousNextbtn">
            <FontAwesomeIcon
              icon={["fas", "chevron-right"]}
              className="paginationButton "
              onClick={() => handleClickOnNext()}
            ></FontAwesomeIcon>
          </div>
        </div>
        <div className="marginNone marginButtonPagination ">
          <p>Files per page:{audiosPerPage}</p>
        </div>
      </div>
    </div>
  );
};

export default PaginationItem;

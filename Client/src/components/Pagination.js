import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useSelector } from "react-redux";
import "../App.css";

const PaginationItem = ({
  handleClickOnPrev,
  handleClickOnNext,
  firstPage,
  pageNumber,
  lastPage,
}) => {
  return (
    <div className="footerPagination">
      <div className="footerPaginationContainer ">
        <div className=" d-flex marginButtonPagination align-items-center">
          <div className="previousNextbtn">
            {pageNumber > 1 && (
              <FontAwesomeIcon
                className="  paginationButton "
                icon={["fas", "chevron-left"]}
                onClick={() => handleClickOnPrev()}
              ></FontAwesomeIcon>
            )}
          </div>
          <div className="marginNone marginButtonPagination ">
            <p>Page {pageNumber}</p>
          </div>

          <div className="previousNextbtn">
            {!lastPage && (
              <FontAwesomeIcon
                icon={["fas", "chevron-right"]}
                className="paginationButton "
                onClick={() => handleClickOnNext()}
              ></FontAwesomeIcon>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginationItem;

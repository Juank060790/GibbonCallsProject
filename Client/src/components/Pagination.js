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
  console.log(`firstPage`, firstPage);
  const lastPage = useSelector((state) => state.audio.lastPage);

  return (
    <div className="footerPagination">
      <div className="footerPaginationContainer ">
        <div className="marginNone marginButtonPagination ">
          <p>Rows per page:</p>
        </div>
        <div className="marginNone marginButtonPagination">
          <p>Total of documents</p>
        </div>
        <div className=" d-flex marginButtonPagination">
          {!firstPage ? (
            <div className="previousNextbtn">
              <FontAwesomeIcon
                className="  paginationButton "
                icon={["fas", "chevron-left"]}
                onClick={() => handleClickOnPrev()}
              ></FontAwesomeIcon>
            </div>
          ) : (
            <div className="previousNextbtnDisabled">
              <FontAwesomeIcon
                className="  paginationButton "
                icon={["fas", "chevron-left"]}
              ></FontAwesomeIcon>
            </div>
          )}
          {!lastPage ? (
            <div className="previousNextbtn">
              <FontAwesomeIcon
                icon={["fas", "chevron-right"]}
                className="paginationButton "
                onClick={() => handleClickOnNext()}
              ></FontAwesomeIcon>
            </div>
          ) : (
            <div className="previousNextbtnDisabled">
              <FontAwesomeIcon
                icon={["fas", "chevron-right"]}
                className="paginationButton "
              ></FontAwesomeIcon>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaginationItem;

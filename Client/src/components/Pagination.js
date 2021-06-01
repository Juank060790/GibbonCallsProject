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
  // const lastPage = useSelector((state) => state.audio.lastPage);

  const audiosPerPage = useSelector((state) => state.audio.audio?.length);

  return (
    <div className="footerPagination">
      <div className="footerPaginationContainer ">
        <div className="marginNone marginButtonPagination ">
          <p>Rows per page:{audiosPerPage}</p>
        </div>
        <div className="marginNone "></div>
        <div className=" d-flex marginButtonPagination">
          <div className="previousNextbtn">
            <FontAwesomeIcon
              className="  paginationButton "
              icon={["fas", "chevron-left"]}
              onClick={() => handleClickOnPrev()}
            ></FontAwesomeIcon>
          </div>
          {/* <div className="previousNextbtnDisabled">
            <FontAwesomeIcon
              className="  paginationButton "
              icon={["fas", "chevron-left"]}
            ></FontAwesomeIcon>
          </div> */}
          <div className="previousNextbtn">
            <FontAwesomeIcon
              icon={["fas", "chevron-right"]}
              className="paginationButton "
              onClick={() => handleClickOnNext()}
            ></FontAwesomeIcon>
          </div>
          {/* <div className="previousNextbtnDisabled">
            <FontAwesomeIcon
              icon={["fas", "chevron-right"]}
              className="paginationButton "
            ></FontAwesomeIcon>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PaginationItem;

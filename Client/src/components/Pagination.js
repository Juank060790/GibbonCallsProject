import React from "react";
import { Pagination } from "react-bootstrap";
import "../App.css";

const PaginationItem = ({ loading, handleClickOnPrev, handleClickOnNext }) => {
  return (
    <Pagination
      className="justify-content-center pagination "
      disabled={loading}
    >
      <Pagination.Prev onClick={() => handleClickOnPrev()} />

      <Pagination.Next onClick={() => handleClickOnNext()} />
    </Pagination>
  );
};

export default PaginationItem;

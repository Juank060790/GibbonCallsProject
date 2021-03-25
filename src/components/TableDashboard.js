import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";
import { audioActions } from "../redux/actions";

export default function TableDashboard() {
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("recordDate");
  const [order, setOrder] = useState("desc");
  const dispatch = useDispatch();
  const params = useParams();
  const loading = useSelector((state) => state.audio.loading);
  const totalPageNum = useSelector((state) => state.audio.totalPageNum);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  // const limit = 10;
  const audios = useSelector((state) => state.audio.audio);
  console.log("Audios Table", audios);
  // const [query, setQuery] = useState("");

  const query = (e) => {
    e.preventDefault();
    setOrder("asc");
    setSortBy("recordDate");
    setLimit(10);
  };

  useEffect(() => {
    dispatch(audioActions.audiosRequest(page, limit, sortBy, order));
  }, [dispatch, page, limit, sortBy, order]);
  return (
    <>
      <div>
        <Button onClick={query}></Button>{" "}
      </div>
      {audios.length ? (
        <Table responsive>
          <thead className="text-center tableHeader">
            <tr>
              <th>Id N&deg;</th>
              <th>File Name</th>
              <th>Record Date</th>
              <th>Duration</th>
              <th>Gibbon Calls</th>
              <th>Comments</th>
            </tr>
          </thead>

          <tbody>
            {audios.map((audio, index) => (
              <tr className="text-center tableKey" key={audio.audioId}>
                <td>{audio.audioId}</td>
                <td>{audio.fileName}</td>
                <td>{audio.recordDate}</td>
                <td>{audio.duration}</td>
                <td>{audio.gibbonCalls}</td>
                <td>
                  <form>
                    <textarea className="textareacomments"></textarea>
                    {/* <input
                      className="submitcommentbtn btn btn-info"
                      type="submit"
                    /> */}
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>NO Audio found</p>
      )}
    </>
  );
}

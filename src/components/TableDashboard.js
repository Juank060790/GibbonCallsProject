import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";
import { audioActions } from "../redux/actions";

export default function TableDashboard() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState({ key: "", ascending: -1 });
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const params = useParams();
  const loading = useSelector((state) => state.audio.loading);
  const totalPageNum = useSelector((state) => state.audio.totalPageNum);
  const limit = 10;
  const audios = useSelector((state) => state.audio.audio);
  console.log("Audios Table", audios);

  useEffect(() => {
    dispatch(audioActions.audiosRequest(page, query, limit, sortBy));
  }, [dispatch, page, query, limit, sortBy]);
  return (
    <>
      {" "}
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

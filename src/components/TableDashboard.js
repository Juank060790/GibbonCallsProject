import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
import { audioActions } from "../redux/actions";
import CircleLoader from "react-spinners/CircleLoader";
import { css } from "@emotion/core";
import { useHistory } from "react-router";
// import "../Styles.scss";

export default function TableDashboard() {
  // const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("recordDate");
  const [order, setOrder] = useState("desc");
  const dispatch = useDispatch();
  const audios = useSelector((state) => state.audio.audio);
  const loading = useSelector((state) => state.audio.loading);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const history = useHistory();
  // const params = useParams();
  // const totalPageNum = useSelector((state) => state.audio.totalPageNum);
  // const limit = 10;
  // console.log("Audios Table", audios);

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

  const override = css`
    display: block;
    margin: 0 auto;
  `;

  const toAudioId = (id) => {
    console.log("AUDIOOOOOOO", id);
    history.push(`/audio/audiolist/${id}`);
  };
  return (
    <>
      <div className="reloadBtnContainer">
        <button className="reloadButton" onClick={query}></button>{" "}
      </div>

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
        {loading ? (
          <CircleLoader
            className="spinnerloading"
            color="#04c45c"
            size={150}
            loading={loading}
            css={override}
          />
        ) : (
          <>
            {audios.length ? (
              <tbody>
                {audios.map((audio, index) => (
                  <tr className="text-center tableKey" key={audio.audioId}>
                    <td
                      onClick={() => toAudioId(audio?.audioId)}
                      className="tableSingleKey"
                    >
                      {audio.audioId}
                    </td>
                    <td
                      onClick={() => toAudioId(audio?.audioId)}
                      className="tableSingleKey"
                    >
                      {audio.fileName}
                    </td>
                    <td
                      onClick={() => toAudioId(audio?.audioId)}
                      className="tableSingleKey"
                    >
                      {audio.recordDate}
                    </td>
                    <td
                      onClick={() => toAudioId(audio?.audioId)}
                      className="tableSingleKey"
                    >
                      {audio.duration}
                    </td>
                    <td
                      onClick={() => toAudioId(audio?.audioId)}
                      className="tableSingleKey"
                    >
                      {audio.gibbonCalls}
                    </td>
                    <td className="tableSingleKey commentKey">
                      <form>
                        <textarea className="textareacomments"></textarea>
                        <input className="submitcommentbtn " type="submit" />
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <p>No AudioS </p>
              </tbody>
            )}
          </>
        )}
      </Table>
    </>
  );
}

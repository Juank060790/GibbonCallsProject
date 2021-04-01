import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { audioActions } from "../redux/actions";
import CircleLoader from "react-spinners/CircleLoader";
import { css } from "@emotion/core";
import { useHistory } from "react-router";
import PaginationItem from "./Pagination";

export default function TableDashboard() {
  const [sortBy, setSortBy] = useState("audioId");
  const [order, setOrder] = useState("desc");
  const dispatch = useDispatch();
  const audios = useSelector((state) => state.audio.audio);
  const loading = useSelector((state) => state.audio.loading);
  const [limit, setLimit] = useState(10);
  const history = useHistory();
  const [startDoc, setStartDoc] = useState(null);

  console.log("STATE OF STARDOC", startDoc, audios);

  const query = (e) => {
    e.preventDefault();
    setOrder("desc");
    setSortBy("audioId");
    setLimit(4);
  };

  const handleClickOnNext = () => {
    if (audios.length >= 1 && !loading) {
      setStartDoc(audios[audios.length - 1].audioId);
      console.log("NEXT PAGE", startDoc);
    }
  };

  const handleClickOnPrev = () => {
    if (audios.length <= 1 && !loading) {
      setStartDoc(audios[0].audioId);
      console.log("PREVIOUS PAGE", startDoc);
    }
  };

  useEffect(() => {
    dispatch(audioActions.audiosRequest(limit, sortBy, order, startDoc));
  }, [dispatch, limit, sortBy, order, startDoc]);

  const override = css`
    display: block;
    margin: 0 auto;
  `;

  const toAudioId = (audioId) => {
    history.push(`/audio/audiolist/${audioId}`);
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
        {/* {loading ? (
          <CircleLoader
            className="spinnerloading"
            color="#04c45c"
            size={150}
            loading={loading}
            css={override}
          />
        ) : ( */}
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
        {/* )} */}
      </Table>
      <PaginationItem
        audios={audios}
        loading={loading}
        handleClickOnNext={handleClickOnNext}
        handleClickOnPrev={handleClickOnPrev}
      />
    </>
  );
}

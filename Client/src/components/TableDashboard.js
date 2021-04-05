import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { audioActions, callActions } from "../redux/actions";
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
  const [startDoc, setStartDoc] = useState(null);
  const calls = useSelector((state) => state.call);
  const selectedAudio = useSelector((state) => state.audio.selectedAudio);
  const callsIds = selectedAudio?.gibbonCallsIds;
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const callsperAudio = [];

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

  const toAudioId = (audioId, callsIds) => {
    console.log("audioId", audioId, "CALLSIDS", callsIds);
    if (audioId) {
      dispatch(audioActions.getSingleAudio(audioId));
    }
    if (callsIds) {
      getCalls(callsIds);
    }
    handleShow();
  };

  const getCalls = (callsIds) => {
    callsIds?.forEach((call) => {
      dispatch(callActions.getSingleCall(call));
      callsperAudio.push(calls);
      console.log("CALLSSETSTATE", callsperAudio);
    });
  };

  useEffect(() => {
    dispatch(audioActions.audiosRequest(limit, sortBy, order, startDoc));
  }, [dispatch, limit, sortBy, order, startDoc]);

  const override = css`
    display: block;
    margin: 0 auto;
  `;

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
        <>
          {audios.length ? (
            <tbody>
              {audios.map((audio, index) => (
                <tr className="text-center tableKey" key={audio.audioId}>
                  <td
                    onClick={() => toAudioId(audio?.audioId, callsIds)}
                    className="tableSingleKey"
                  >
                    {audio.audioId}
                  </td>
                  <td
                    onClick={() => toAudioId(audio?.audioId, callsIds)}
                    className="tableSingleKey"
                  >
                    {audio.fileName}
                  </td>
                  <td
                    onClick={() => toAudioId(audio?.audioId, callsIds)}
                    className="tableSingleKey"
                  >
                    {audio.recordDate}
                  </td>
                  <td
                    onClick={() => toAudioId(audio?.audioId, callsIds)}
                    className="tableSingleKey"
                  >
                    {audio.duration}
                  </td>
                  <td
                    onClick={() => toAudioId(audio?.audioId, callsIds)}
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
      </Table>
      <PaginationItem
        audios={audios}
        loading={loading}
        handleClickOnNext={handleClickOnNext}
        handleClickOnPrev={handleClickOnPrev}
      />
      <Modal
        show={show}
        onHide={handleClose}
        size={"xl"}
        dialogClassName="modal-100w"
        centered={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedAudio?.audioId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <Table responsive>
            <thead className="text-center tableHeader">
              <tr>
                <th>Id N&deg;</th>
                <th>Time Stamp</th>
                <th>Spectogram</th>
                <th>Action</th>
                <th>Tags</th>
                <th>Comments</th>
              </tr>
            </thead>
            <>
              {callsperAudio ? (
                <tbody>
                  {callsperAudio?.map((call, index) => (
                    <tr className="text-center tableKey">
                      <td className="tableSingleKey">
                        {selectedAudio.audioId}
                      </td>
                      <td className="tableSingleKey">{call.timeStart}</td>
                      <td className="tableSingleKey">IMG</td>
                      <td className="tableSingleKey">Action</td>
                      <td className="tableSingleKey">{call.label}</td>
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
          </Table>
        </Modal.Body>
      </Modal>
    </>
  );
}

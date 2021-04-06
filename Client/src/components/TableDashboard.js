import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { audioActions, callActions } from "../redux/actions";
import ModalCall from "./ModalCall";
import PaginationItem from "./Pagination";

export default function TableDashboard() {
  // UseSelector brings the state from the reducers.
  // Dispatch send data to redux actions and reducers.
  const handleClose = () => {
    setShow(false);
    setCallsperAudio([]);
  };
  const handleShow = () => setShow(true);
  const audios = useSelector((state) => state.audio.audio);
  const loading = useSelector((state) => state.audio.loading);
  const calls = useSelector((state) => state.call);
  const selectedAudio = useSelector((state) => state.audio.selectedAudio);
  const callsIds = selectedAudio?.gibbonCallList;
  const dispatch = useDispatch();
  const [startDoc, setStartDoc] = useState(null);
  const [show, setShow] = useState(false);
  const [sortBy, setSortBy] = useState("audioId");
  const [order, setOrder] = useState("desc");
  const [limit, setLimit] = useState(10);
  const [callsperAudio, setCallsperAudio] = useState([]);
  console.log("SELECTEDAUDIO------>", callsIds, "---------");
  // To load the audios from storage (to be fixed)
  const query = (e) => {
    e.preventDefault();
    // setOrder("desc");
    // setSortBy("audioId");
    // setLimit(4);
  };

  // Pagination (to be fixed add counter in the model schema)
  const handleClickOnNext = () => {
    if (audios.length >= 1 && !loading) {
      setStartDoc(audios[audios.length - 1].audioId);
      // console.log("NEXT PAGE", startDoc);
    }
  };

  const handleClickOnPrev = () => {
    if (audios.length <= 1 && !loading) {
      setStartDoc(audios[0].audioId);
      // console.log("PREVIOUS PAGE", startDoc);
    }
  };

  // Get an individual calls  inside of a RawAudio (To be fixed)
  // This function returns the state with single calls of a Raw Audio into a state([]).
  const getCalls = (callsIds) => {
    callsIds?.forEach((call) => {
      dispatch(callActions.getSingleCall(call));
      callsperAudio.push(calls);
      setCallsperAudio(callsperAudio);
    });
  };

  // Get individual Rawaudio with a Modal.
  const toAudioId = (audioId, callsIds) => {
    if (audioId) {
      dispatch(audioActions.getSingleAudio(audioId));
      getCalls(callsIds);
      console.log("CALLSSID", callsIds);
      handleShow();
    }
  };

  // Every time there is a change on this values the component will rerender
  useEffect(() => {
    dispatch(audioActions.audiosRequest(limit, sortBy, order, startDoc));
  }, [dispatch, limit, sortBy, order, startDoc]);

  // ------- To do (Filters, add/delete comment in Main table) ----------.

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
                      <div className="commentsection">
                        <div>
                          {" "}
                          <textarea
                            className="textareacomments"
                            type="submit"
                            id="commentBox"
                          ></textarea>
                          {/* <input className="submitcommentbtn" value="Submit" /> */}
                        </div>
                        <div className="buttonscomments">
                          <div className="savebuttoncontainer">
                            <FontAwesomeIcon
                              className="savebutton m-2"
                              // onSubmit={"#"}
                              icon={["fas", "check"]}
                              color="#04c45c"
                            ></FontAwesomeIcon>{" "}
                          </div>
                          <div>
                            <FontAwesomeIcon
                              className="m-2"
                              // onSubmit={"#"}
                              icon={["fas", "times"]}
                              size="1x"
                              color="red"
                            ></FontAwesomeIcon>{" "}
                          </div>
                        </div>
                      </div>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <thead className="text-center tableHeader">
              <tr>No Audios</tr>
            </thead>
          )}
        </>
      </Table>
      <PaginationItem
        audios={audios}
        loading={loading}
        handleClickOnNext={handleClickOnNext}
        handleClickOnPrev={handleClickOnPrev}
      />
      <ModalCall
        showModal={show}
        selectedAudio={selectedAudio}
        callsperAudio={callsperAudio}
        handleClose={handleClose}
      />
    </>
  );
}

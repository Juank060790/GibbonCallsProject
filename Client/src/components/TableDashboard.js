import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { audioActions, callActions } from "../redux/actions";
import ModalCall from "./ModalCall";
import PaginationItem from "./Pagination";

export default function TableDashboard() {
  // UseSelector brings the state from the reducers.
  // Dispatch send data to redux actions and reducers.
  const handleClose = () => {
    setShow(false);
    dispatch(callActions.clearCallsReducer());
    dispatch(audioActions.clearSelectedAudioReducer());
    setCallsperAudio([]);
  };
  const handleShow = () => setShow(true);
  const audios = useSelector((state) => state.audio.audio);
  const loading = useSelector((state) => state.audio.loading);
  const calls = useSelector((state) => state.call);
  const selectedAudio = useSelector((state) => state.audio.selectedAudio);
  // const callsIds = selectedAudio?.gibbonCallList;
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [callsperAudio, setCallsperAudio] = useState([]);
  const [formData, setFormData] = useState({ comment: "" });
  const [audioIdOnComment, setAudioIdOnComment] = useState("");

  //Add Raw Audio Comment functions
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { comment } = formData;
    console.log("COMMENT", formData, audioIdOnComment);
    const audioId = audioIdOnComment;
    dispatch(audioActions.addCommentRawAudio(comment, audioId));
  };

  useEffect(() => {}, [dispatch, audioIdOnComment, audios]);

  // To load the audios from storage (to be fixed)
  const query = (e) => {
    e.preventDefault();
  };

  // Pagination (to be fixed add counter in the model schema)
  const handleClickOnNext = () => {
    // if (audios.length >= 1 && !loading) {
    //   setStartDoc(audios[audios.length - 1].audioId);
    // }
  };
  const handleClickOnPrev = () => {
    // if (audios.length <= 1 && !loading) {
    //   setStartDoc(audios[0].audioId);
    // }
  };

  // Get an individual calls  inside of a RawAudio (To be fixed)
  // This function returns the state with single calls of a Raw Audio into a state([]).
  const getCalls = (gibbonCallList) => {
    gibbonCallList?.forEach((call) => {
      dispatch(callActions.getSingleCall(call));
      // callsperAudio.push(calls);
      setCallsperAudio(calls);
    });
    handleShow();
  };

  // Every time there is a change on this values the component will rerender

  // Get individual Rawaudio with a Modal.
  const toAudioId = (audioId, gibbonCallList) => {
    dispatch(audioActions.getSingleAudio(audioId));
    getCalls(gibbonCallList);
  };
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
                    onClick={() =>
                      toAudioId(audio?.audioId, audio.gibbonCallList)
                    }
                    className="tableSingleKey"
                  >
                    {audio.audioId}
                  </td>
                  <td
                    onClick={() =>
                      toAudioId(audio?.audioId, audio.gibbonCallList)
                    }
                    className="tableSingleKey"
                  >
                    {audio.fileName}
                  </td>
                  <td
                    onClick={() =>
                      toAudioId(audio?.audioId, audio.gibbonCallList)
                    }
                    className="tableSingleKey"
                  >
                    {audio.recordDate}
                  </td>
                  <td
                    onClick={() =>
                      toAudioId(audio?.audioId, audio.gibbonCallList)
                    }
                    className="tableSingleKey"
                  >
                    {audio.duration}
                  </td>
                  <td
                    onClick={() =>
                      toAudioId(audio?.audioId, audio.gibbonCallList)
                    }
                    className="tableSingleKey"
                  >
                    {audio.gibbonCalls}
                  </td>
                  <td className="tableSingleKey commentKey">
                    <Form onSubmit={handleSubmit} key={audio.audioId}>
                      {audio.comments ? (
                        <div className="commentBox textareacomments">
                          <div className="commentSubBox ">
                            <p className="text-center">{audio.comments}</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <td className="tableSingleKey commentKey">
                            <div className="buttonscomments">
                              <Button
                                type="submit"
                                variant="outline-success"
                                size="sm"
                              >
                                {" "}
                                <FontAwesomeIcon
                                  className="savebutton m-2"
                                  // onSubmit={"#"}
                                  icon={["fas", "check"]}
                                  color="#04c45c"
                                ></FontAwesomeIcon>
                              </Button>{" "}
                              <Button variant="outline-danger" size="sm">
                                <FontAwesomeIcon
                                  className="m-2"
                                  // onSubmit={"#"}
                                  icon={["fas", "times"]}
                                  size="1x"
                                  color="red"
                                ></FontAwesomeIcon>{" "}
                              </Button>{" "}
                            </div>
                          </td>
                          <div className="addCommentBox commentBoxInput">
                            <Form.Group
                              style={{ backgroundColor: "#d7ebd6" }}
                              className="textareacomments textareacommentsInput"
                              controlId={audio.audioId}
                            >
                              <Form.Control
                                onClick={() =>
                                  setAudioIdOnComment(audio?.audioId)
                                }
                                key={audio.audioId}
                                type="textarea"
                                required
                                name="comment"
                                onChange={handleChange}
                              />
                            </Form.Group>{" "}
                          </div>
                        </>
                      )}
                    </Form>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <thead className="text-center tableHeader">
              <tr>
                <th>No Audios</th>
              </tr>
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

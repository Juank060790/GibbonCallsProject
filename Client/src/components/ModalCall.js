import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import WaveSpectrogram from "./waveSpectrogram";
import logoFF from "../images/logo-reduced.png";
import { Modal, OverlayTrigger, Table } from "react-bootstrap";
import { callActions } from "../redux/actions";
import Loader from "react-spinners/ScaleLoader";
import { Tooltip } from "react-bootstrap";
import toTimeString from "../helpers/utils";

export default function ModalCall({ handleClose, showModal, showSpectrogram }) {
  const selectedAudio = useSelector((state) => state.audio.selectedAudio);
  const loadingAudio = useSelector((state) => state.audio.loadingAudio);
  const [callIdOnComment, setCallIdOnComment] = useState("");
  const [formData, setFormData] = useState({ comment: "" });
  const [arrayCalls, setArrayCalls] = useState(null);
  const calls = useSelector((state) => state.call);
  const dispatch = useDispatch();
  // const canvasWidth = useSelector((state) => state.spectrogram.canvasWidth);

  // Set the state for the table with the call of each audio
  useEffect(() => {
    setArrayCalls(calls.call);
  }, [calls]);

  // Send the form with the comment and Audio Id to audio actions. //
  const handlesubmit = (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter" || e.type === "click") {
      const { comment } = formData;
      const callId = callIdOnComment;
      dispatch(callActions.addCommentSingleCall(comment, callId));
      e.preventDefault();
    }
    setFormData({ comment: "" });
  };

  // Handle the comment in the call modal //

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // To Do[count how many calls are correct]
  const isCallCorrect = (callId, isCorrect) => {
    const selectedAudioId = selectedAudio?.id;
    // Count the calls if are correct or not
    // const finalCount = callsToCount.call?.filter(
    //   (x) => x.isCorrect === true
    // ).length;
    // const restCallCount = finalCount - 1;
    dispatch(
      callActions.updateIsCallCorrect(callId, selectedAudioId, isCorrect)
    );
  };

  const saveCommentTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Press "Enter" to save comment.
    </Tooltip>
  );

  // function addZero(i) {
  //   if (i < 10) {
  //     i = "0" + i;
  //   }
  //   return i;
  // }

  // function toTimeString(seconds) {
  //   var d = new Date(seconds * 1000);
  //   var m = addZero(d.getMinutes());
  //   var s = addZero(d.getSeconds()); // Add leading zero
  //   return m + ":" + s;
  // }

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>{selectedAudio?.audioLink}</Modal.Header>
      {loadingAudio ? (
        <Modal.Body className="loader-container">
          <div className="loader">
            <Loader color="black" height={85} width={4} radius={2} margin={5} />
          </div>
        </Modal.Body>
      ) : (
        <Modal.Body>
          <WaveSpectrogram />

          <div className="callsTable">
            {" "}
            <h4>Calls Saved in the database</h4>
            <Table responsive="lg">
              <thead className="text-center tableHeader">
                <tr>
                  <th>Num</th>
                  <th className="idNumberModal">Id N&deg;</th>
                  <th>Time Start</th>
                  <th>Time End</th>
                  <th>Spectrogram</th>
                  <th>Validation</th>
                  <th>Label</th>
                  <th>Created by</th>
                  <th>%</th>
                  <th>Comments</th>
                  <th className="text-center"></th>
                </tr>
              </thead>
              <>
                {arrayCalls === null ? (
                  <>
                    <thead className="text-center notfoundpage ">
                      <th>
                        <h1>No calls Found</h1>
                        <img src={logoFF} alt="logoFF" />
                      </th>
                    </thead>
                  </>
                ) : (
                  <>
                    {arrayCalls?.map((call, index) => (
                      <tbody key={index}>
                        <tr className="text-center tableKey" key={call.id}>
                          <td className="tableSingleKey indexKey">
                            {index + 1}
                          </td>
                          <td className="tableSingleKey">{call.id}</td>
                          <td className="tableSingleKey">
                            {toTimeString(call.start)}
                          </td>
                          <td className="tableSingleKey">
                            {" "}
                            {toTimeString(call.end)}
                          </td>
                          {call.spectrogram ? (
                            <td
                              // onClick={() => showSpectrogram(call.spectrogram)}
                              className="tableSingleKey"
                            >
                              <img
                                alt="spectrogram of a single call"
                                src={call.spectrogram}
                                height="100px"
                                width="150px"
                              />
                            </td>
                          ) : (
                            <td
                              // onClick={() => showSpectrogram(call.spectrogram)}
                              className="tableSingleKey"
                            >
                              <FontAwesomeIcon
                                icon={["fas", "eye-slash"]}
                                className="savebutton"
                                size={"sm"}
                              ></FontAwesomeIcon>{" "}
                            </td>
                          )}

                          <td className="tableSingleKey commentKey">
                            <div className="buttonscomments">
                              {call?.isCorrect === false ? (
                                <div
                                  className="commentBtns commentBtnsDelete"
                                  onClick={() => isCallCorrect(call?.id, true)}
                                >
                                  <FontAwesomeIcon
                                    className="validationBtn"
                                    icon={["fas", "times-circle"]}
                                  ></FontAwesomeIcon>{" "}
                                </div>
                              ) : (
                                <div
                                  className="commentBtns commentBtnsSave"
                                  onClick={() => isCallCorrect(call?.id, false)}
                                >
                                  {" "}
                                  <FontAwesomeIcon
                                    icon={["fas", "check-circle"]}
                                    className="validationBtn"
                                    color="#04c45c"
                                  ></FontAwesomeIcon>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="tableSingleKey ">
                            {call.label ? call.label : "N/A"}
                          </td>
                          <td className="tableSingleKey ">{call.createdBy}</td>
                          <td className="tableSingleKey "> {call.accuracy}</td>
                          <td className="tableSingleKey commentKey">
                            <form
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handlesubmit(e);
                                }
                              }}
                              className="commentForm"
                              key={call.id}
                              id={call.id}
                            >
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 1000, hide: 100 }}
                                overlay={saveCommentTooltip}
                              >
                                <textarea
                                  className="commentBoxInput  textareacommentsInput"
                                  onSelect={() => setCallIdOnComment(call?.id)}
                                  defaultValue={call.comment}
                                  onChange={handleChange}
                                  id={index + call.id}
                                  type="textarea"
                                  name="comment"
                                  key={call.id}
                                ></textarea>
                              </OverlayTrigger>
                            </form>{" "}
                          </td>
                        </tr>
                      </tbody>
                    ))}
                  </>
                )}
              </>
            </Table>
          </div>
        </Modal.Body>
      )}
    </Modal>
  );
}

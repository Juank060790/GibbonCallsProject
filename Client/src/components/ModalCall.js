import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import WaveSpectrogram from "./waveSpectrogram";
import logoFF from "../images/logo-reduced.png";
import { Modal, OverlayTrigger, Table } from "react-bootstrap";
import { callActions, spectrogramActions } from "../redux/actions";
import Loader from "react-spinners/ScaleLoader";
import { Tooltip } from "react-bootstrap";
import toTimeString from "../helpers/utils";
import NewCallSpectrogram from "./NewCallSpectrogram";

export default function ModalCall({ handleClose, showModal, showSpectrogram }) {
  const selectedAudio = useSelector((state) => state.audio.selectedAudio);
  const loadingAudio = useSelector((state) => state.audio.loadingAudio);
  const [callIdOnComment, setCallIdOnComment] = useState("");
  const [formData, setFormData] = useState({ comment: "" });
  const [arrayCalls, setArrayCalls] = useState(null);
  const selections = useSelector((state) => state.spectrogram);

  const dispatch = useDispatch();
  // const canvasWidth = useSelector((state) => state.spectrogram.canvasWidth);

  // Set the state for the table with the call of each audio
  useEffect(() => {
    setArrayCalls(selections.selections);
  }, [selections]);

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
    dispatch(
      callActions.updateIsCallCorrect(callId, selectedAudioId, isCorrect)
    );
  };

  const saveCommentTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Press "Enter" to save comment.
    </Tooltip>
  );

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
                      <tbody key={index + 1}>
                        {call.dataBase === true ? (
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

                            <td
                              // onClick={() => showSpectrogram(call.spectrogram)}
                              className="tableSingleKey key-spectrogram"
                              onMouseEnter={() => {
                                setTimeout(() => {
                                  dispatch(spectrogramActions.showImage(call));
                                }, 300);
                              }}
                              onMouseOut={() => {
                                dispatch(spectrogramActions.showImage(null));
                              }}
                            >
                              <NewCallSpectrogram
                                call={call}
                              ></NewCallSpectrogram>
                            </td>

                            <td className="tableSingleKey commentKey">
                              <div className="buttonscomments">
                                {call?.isCorrect === false ? (
                                  <div
                                    className="commentBtns commentBtnsDelete"
                                    onClick={() =>
                                      isCallCorrect(call?.id, true)
                                    }
                                  >
                                    <FontAwesomeIcon
                                      className="validationBtn"
                                      icon={["fas", "times-circle"]}
                                    ></FontAwesomeIcon>{" "}
                                  </div>
                                ) : (
                                  <div
                                    className="commentBtns commentBtnsSave"
                                    onClick={() =>
                                      isCallCorrect(call?.id, false)
                                    }
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
                            <td className="tableSingleKey ">
                              {call.createdBy}
                            </td>
                            <td className="tableSingleKey ">
                              {" "}
                              {call.accuracy}
                            </td>
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
                                    onSelect={() =>
                                      setCallIdOnComment(call?.id)
                                    }
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
                        ) : null}
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

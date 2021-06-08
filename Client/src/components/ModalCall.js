import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Table, Button, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import MediaPlayer from "./MediaPlayer";
import logoFF from "../images/logo-reduced.png";
import Form from "react-bootstrap/Form";
import { callActions } from "../redux/actions";

export default function ModalCall({
  handleClose,
  showModal,
  spectogramImage,
  showSpectrogram,
}) {
  const dispatch = useDispatch();
  const calls = useSelector((state) => state.call.call);
  const [callIdOnComment, setCallIdOnComment] = useState("");
  const [formData, setFormData] = useState({ comment: "" });
  const [arrayCalls, setArrayCalls] = useState([]);
  const selectedAudio = useSelector((state) => state.audio.selectedAudio);
  const callsToCount = useSelector((state) => state.call);

  useEffect(() => {
    setArrayCalls(calls);
  }, [arrayCalls, calls]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { comment } = formData;
    const callId = callIdOnComment;
    dispatch(callActions.addCommentSingleCall(comment, callId));
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const deleteCommentSingleCall = (callId) => {
    dispatch(callActions.deleteCommentCall(callId));
  };

  const deleteCall = (callId) => {
    dispatch(callActions.deleteCall(callId));
  };

  const isCallCorrect = (callId) => {
    const selectedAudioId = selectedAudio?.audioId;
    const finalCount = callsToCount.call?.filter(
      (x) => x.isCorrect === true
    ).length;
    const restCallCount = finalCount - 1;
    dispatch(
      callActions.updateIsCallCorrect(callId, selectedAudioId, restCallCount)
    );
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <h6>{selectedAudio?.audioId}</h6>
      </Modal.Header>
      <Modal.Body>
        {" "}
        <MediaPlayer spectogramImage={spectogramImage} />
        <div>
          {" "}
          <h4>Calls Saved in the database</h4>
        </div>
        <Table responsive>
          <thead className="text-center tableHeader">
            <tr>
              <th>Num</th>
              <th className="idNumberModal">Id N&deg;</th>
              <th>Time Start</th>
              <th>Time End</th>
              <th>Spectogram</th>
              <th>Action</th>
              <th>Label</th>
              <th>Comments</th>
              <th className="text-center"></th>
            </tr>
          </thead>
          <>
            {arrayCalls ? (
              <>
                {arrayCalls.map((call, index) => (
                  <tbody key={index}>
                    {call?.isCorrect === true ? (
                      <tr
                        style={{ backgroundColor: call?.color }}
                        className="text-center tableKey"
                        key={call.callId}
                      >
                        <td className="tableSingleKey indexKey">{index + 1}</td>
                        <td className="tableSingleKey">{call.callId}</td>
                        <td className="tableSingleKey">
                          {call.start.toFixed(4)}
                        </td>
                        <td className="tableSingleKey">
                          {call.end.toFixed(4)}
                        </td>
                        {call.spectogram ? (
                          <td
                            onClick={() => showSpectrogram(call.spectogram)}
                            className="tableSingleKey"
                          >
                            <img
                              src={call.spectogram}
                              alt="spectogram of a single call"
                              width="150px"
                              height="100px"
                            />
                          </td>
                        ) : (
                          <td
                            onClick={() => showSpectrogram(call.spectogram)}
                            className="tableSingleKey"
                          >
                            <p>No picture added</p>
                          </td>
                        )}

                        <td className="tableSingleKey commentKey">
                          <div className="buttonscomments">
                            {call?.isCorrect === false ? (
                              <Button
                                className="savebutton commentBtns commentBtnsSave"
                                onClick={() => isCallCorrect(call?.callId)}
                              >
                                {" "}
                                <FontAwesomeIcon
                                  className="savebutton "
                                  icon={["fas", "check"]}
                                  color="#04c45c"
                                ></FontAwesomeIcon>
                              </Button>
                            ) : (
                              <Button
                                className="savebutton commentBtns commentBtnsDelete"
                                onClick={() => isCallCorrect(call?.callId)}
                              >
                                <FontAwesomeIcon
                                  className="savebutton"
                                  icon={["fas", "times"]}
                                  color="white"
                                ></FontAwesomeIcon>{" "}
                              </Button>
                            )}
                          </div>
                        </td>
                        {call.label === "Female" ? (
                          <td className="tableSingleKey ">
                            {" "}
                            <Badge className="labelTag femaleTag">
                              {" "}
                              {call.label}{" "}
                              <FontAwesomeIcon
                                className="savebutton"
                                icon={["fas", "venus"]}
                                color="white"
                              ></FontAwesomeIcon>
                            </Badge>
                          </td>
                        ) : call.label === "Male" ? (
                          <td className="tableSingleKey ">
                            {" "}
                            <Badge className="labelTag maleTag">
                              {" "}
                              {call.label}{" "}
                              <FontAwesomeIcon
                                className="savebutton"
                                icon={["fas", "mars"]}
                                color="white"
                              ></FontAwesomeIcon>
                            </Badge>
                          </td>
                        ) : call.label === "Other" ? (
                          <td className="tableSingleKey ">
                            {" "}
                            <Badge className="labelTag">
                              {" "}
                              {call.label}{" "}
                              <FontAwesomeIcon
                                className="savebutton"
                                icon={["fas", "feather"]}
                                color="black"
                              ></FontAwesomeIcon>
                            </Badge>
                          </td>
                        ) : (
                          <td className="tableSingleKey "> No label</td>
                        )}
                        {call.comment ? (
                          <td className="tableSingleKey commentKey">
                            <div className="commentBox textareacomments">
                              <div className="commentSubBox ">
                                <p className="text-center">{call.comment}</p>
                              </div>
                            </div>
                            <Button
                              className="savebutton commentBtns commentBtnsDelete"
                              disabled={call.comment ? false : true}
                              onClick={() =>
                                deleteCommentSingleCall(call?.callId)
                              }
                              // variant="success"
                            >
                              <FontAwesomeIcon
                                className="savebutton"
                                icon={["fas", "times"]}
                                color="white"
                              ></FontAwesomeIcon>{" "}
                            </Button>{" "}
                          </td>
                        ) : (
                          <>
                            <td className="tableSingleKey commentKey">
                              {" "}
                              <div className="commentBox textareacomments">
                                <Form className="commentForm" key={call.callId}>
                                  <div className="addCommentBox commentBoxInput ">
                                    <Form.Group
                                      style={{ backgroundColor: "#d7ebd6" }}
                                      className="textareacomments textareacommentsInput"
                                      controlId={call.callId}
                                    >
                                      <Form.Control
                                        onClick={() =>
                                          setCallIdOnComment(call?.callId)
                                        }
                                        key={call.callId}
                                        type="textarea"
                                        name="comment"
                                        onChange={handleChange}
                                      />
                                    </Form.Group>{" "}
                                  </div>
                                </Form>
                              </div>
                              <div className="buttonscomments">
                                <Button
                                  className="savebutton commentBtns commentBtnsSave"
                                  disabled={call.comment ? true : false}
                                  type="submit"
                                  form="commentForm"
                                  onClick={handleSubmit}
                                >
                                  {" "}
                                  <FontAwesomeIcon
                                    className="savebutton "
                                    icon={["fas", "check"]}
                                    color="#04c45c"
                                  ></FontAwesomeIcon>
                                </Button>{" "}
                              </div>
                            </td>
                          </>
                        )}
                        <td className="lastCell tableSingleKey">
                          {" "}
                          <FontAwesomeIcon
                            className="btndeleteAudio"
                            icon={["fas", "times"]}
                            // size="1x"
                            color="#b94242"
                            onClick={() => deleteCall(call?.callId)}
                          ></FontAwesomeIcon>{" "}
                        </td>
                      </tr>
                    ) : (
                      <>
                        <tr key={index}>
                          <th></th>
                        </tr>
                      </>
                    )}
                  </tbody>
                ))}
              </>
            ) : (
              <>
                <thead className="text-center notfoundpage ">
                  <th>
                    <h1>No calls Found</h1>
                    <img src={logoFF} alt="logoFF" />
                  </th>
                </thead>
              </>
            )}
          </>
        </Table>
      </Modal.Body>
    </Modal>
  );
}

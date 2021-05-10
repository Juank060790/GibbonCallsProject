import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import MediaPlayer from "./MediaPlayer";
import logoFF from "../images/logo-reduced.png";
import Form from "react-bootstrap/Form";
import { callActions } from "../redux/actions";

export default function ModalCall({
  handleClose,
  showModal,
  spectogramImage,
  spectogramAudio,
  showSpectrogram,
}) {
  const calls = useSelector((state) => state.call.call);
  const [callIdOnComment, setCallIdOnComment] = useState("");
  const [formData, setFormData] = useState({ comment: "" });
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { comment } = formData;
    const callId = callIdOnComment;
    console.log(`comment, callId`, comment, callId);
    dispatch(callActions.addCommentSingleCall(comment, callId));
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const deleteCommentCall = (callId) => {
    dispatch(callActions.deleteCommentCall(callId));
  };

  useEffect(() => {}, [calls]);

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      size={"xl"}
      dialogClassName="modal-100w"
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        {" "}
        <MediaPlayer
          spectogramAudio={spectogramAudio}
          spectogramImage={spectogramImage}
        />
        <Table responsive>
          <thead className="text-center tableHeader">
            <tr>
              <th className="idNumberModal">Id N&deg;</th>
              <th>Time Start</th>
              <th>Time End</th>
              <th>Spectogram</th>
              <th>Action</th>
              <th>Tags</th>
              <th>Comments</th>
            </tr>
          </thead>
          <>
            {calls.length ? (
              <tbody>
                {calls?.map((call, index) => (
                  <tr className="text-center tableKey" key={index}>
                    <td className="tableSingleKey">{call.callId}</td>
                    <td className="tableSingleKey">{call.timeStart}</td>
                    <td className="tableSingleKey">{call.timeEnd}</td>
                    <td
                      onClick={() =>
                        showSpectrogram(call.spectogram, call.spectogramAudio)
                      }
                      className="tableSingleKey"
                    >
                      <img
                        src={call.spectogram}
                        alt="spectogram of a single call"
                        width="150px"
                        height="100px"
                      />
                    </td>
                    <td className="tableSingleKeyBtn commentKey">
                      <div className="buttonscomments">
                        <Button
                          className="savebutton commentBtns commentBtnsSave"
                          disabled={call.comment ? true : false}
                          type="submit"
                          form="commentForm"
                          onClick={handleSubmit}
                          // variant="outline-success"
                        >
                          {" "}
                          <FontAwesomeIcon
                            className="savebutton "
                            icon={["fas", "check"]}
                            color="#04c45c"
                          ></FontAwesomeIcon>
                        </Button>{" "}
                        <Button
                          className="savebutton commentBtns commentBtnsDelete"
                          disabled={call.comment ? false : true}
                          onClick={() => deleteCommentCall(call?.callId)}
                          // variant="success"
                        >
                          <FontAwesomeIcon
                            className="savebutton"
                            icon={["fas", "times"]}
                            color="white"
                          ></FontAwesomeIcon>{" "}
                        </Button>{" "}
                      </div>
                    </td>
                    <td className="tableSingleKey">{call.label}</td>

                    {call.comment ? (
                      <td className="tableSingleKey commentKey">
                        <div className="commentBox textareacomments">
                          <div className="commentSubBox ">
                            <p className="text-center">{call.comment}</p>
                          </div>
                        </div>
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
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            ) : (
              <>
                <thead className="text-center notfoundpage ">
                  <tr>
                    <th>
                      <h1>No calls Found</h1>
                      <img src={logoFF} alt="logoFF" />
                    </th>
                  </tr>
                </thead>
              </>
            )}
          </>
        </Table>
      </Modal.Body>
    </Modal>
  );
}

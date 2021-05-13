import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Table, Button, Dropdown } from "react-bootstrap";
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
  const [arrayCalls, setArrayCalls] = useState();
  const dispatch = useDispatch();
  const selectedAudio = useSelector((state) => state.audio.selectedAudio);

  useEffect(() => {
    setArrayCalls(calls);
  }, [calls]);
  console.log(`arrayCalls`, arrayCalls);

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

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      size={"xl"}
      dialogClassName="modal-100w"
    >
      <Modal.Header closeButton>
        <h6>{selectedAudio?.fileName}</h6>
      </Modal.Header>
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
              <th className="text-center">
                <Dropdown>
                  <Dropdown.Toggle
                    className="dropdownBtn"
                    variant="success"
                    id="dropdown-basic"
                  >
                    <FontAwesomeIcon icon={["fas", "filter"]}></FontAwesomeIcon>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {/* <Dropdown.Item
                    onClick={(e) => setOrderBy("audioId")}
                    href="#/action-1"
                  >
                    Audio Id
                  </Dropdown.Item> */}
                    {/* <Dropdown.Item href="#/action-2">Record Date</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">File Name</Dropdown.Item> */}
                  </Dropdown.Menu>
                </Dropdown>
              </th>
            </tr>
          </thead>
          <>
            {calls ? (
              <tbody>
                {calls.map((call, index) => (
                  <>
                    {call.isDeleted === false ? (
                      <tr className="text-center tableKey" key={index}>
                        <td className="tableSingleKey">{call.callId}</td>
                        <td className="tableSingleKey">{call.timeStart}</td>
                        <td className="tableSingleKey">{call.timeEnd}</td>
                        <td
                          onClick={() =>
                            showSpectrogram(
                              call.spectogram,
                              call.spectogramAudio
                            )
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
                  </>
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

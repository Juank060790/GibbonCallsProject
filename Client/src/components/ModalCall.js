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
  console.log(`arrayCalls`, arrayCalls);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const { comment } = formData;
  //   const callId = callIdOnComment;
  //   dispatch(callActions.addCommentSingleCall(comment, callId));
  // };

  // Send the form with the comment and Audio Id to audio actions. //
  const handlesubmit = (e) => {
    console.log(`e`, e);
    if (e.code === "Enter" || e.code === "NumpadEnter" || e.type === "click") {
      console.log("Enter key was pressed. Run your function.");
      if (formData.comment === "") {
        console.log("Nothing to send");
      } else {
        // e.preventDefault();
        const { comment } = formData;
        console.log(`e`, formData);
        const callId = callIdOnComment;
        dispatch(callActions.addCommentSingleCall(comment, callId));
      }
      e.preventDefault();
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const deleteCommentSingleCall = (callId) => {
    dispatch(callActions.deleteCommentCall(callId));
  };

  // const deleteCall = (callId) => {
  //   dispatch(callActions.deleteCall(callId));
  // };

  const isCallCorrect = (callId, isCorrect) => {
    console.log(`e`, isCorrect);
    const selectedAudioId = selectedAudio?.audioId;
    // Count the calls if are correct or not
    const finalCount = callsToCount.call?.filter(
      (x) => x.isCorrect === true
    ).length;
    const restCallCount = finalCount - 1;
    console.log(`restCallCount`, callsToCount.call);

    dispatch(
      callActions.updateIsCallCorrect(
        callId,
        selectedAudioId,
        restCallCount,
        isCorrect
      )
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
              <th>Validation</th>
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
                      <td className="tableSingleKey">{call.end.toFixed(4)}</td>
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
                              className="savebutton commentBtns commentBtnsDelete"
                              onClick={() => isCallCorrect(call?.callId, true)}
                            >
                              <FontAwesomeIcon
                                className="savebutton"
                                icon={["fas", "times"]}
                                size={"sm"}
                              ></FontAwesomeIcon>{" "}
                            </Button>
                          ) : (
                            <Button
                              className="savebutton commentBtns commentBtnsSave"
                              onClick={() => isCallCorrect(call?.callId, false)}
                            >
                              {" "}
                              <FontAwesomeIcon
                                className="savebutton "
                                icon={["fas", "check"]}
                                color="#04c45c"
                              ></FontAwesomeIcon>
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
                              <Form
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handlesubmit(e);
                                  }
                                }}
                                // handlesubmit={(e) => {
                                //   /**
                                //    * Prevent submit from reloading the page
                                //    */
                                //   e.preventDefault();
                                //   e.stopPropagation();
                                //   handlesubmit();
                                // }}

                                className="commentForm"
                                key={call.callId}
                              >
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
                              {/* <Button
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
                              </Button>{" "} */}
                            </div>
                          </td>
                        </>
                      )}
                      {/* <td className="lastCell tableSingleKey">
                        {" "}
                        <FontAwesomeIcon
                          className="btndeleteAudio"
                          icon={["fas", "times"]}
                          // size="1x"
                          color="#b94242"
                          onClick={() => deleteCall(call?.callId)}
                        ></FontAwesomeIcon>{" "}
                      </td> */}
                    </tr>
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

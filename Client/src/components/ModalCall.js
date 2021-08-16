import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Table, Button, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import MediaPlayer from "./MediaPlayer";
import logoFF from "../images/logo-reduced.png";
import { callActions } from "../redux/actions";

export default function ModalCall({
  handleClose,
  showModal,
  spectrogramImage,
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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const isCallCorrect = (callId, isCorrect) => {
    const selectedAudioId = selectedAudio?.audioId;
    // Count the calls if are correct or not
    const finalCount = callsToCount.call?.filter(
      (x) => x.isCorrect === true
    ).length;
    const restCallCount = finalCount - 1;

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
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        {" "}
        <MediaPlayer spectrogramImage={spectrogramImage} />
        <div>
          {" "}
          <h4>Calls Saved in the database</h4>
        </div>
        <Table responsive="sm">
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
                      {call.spectrogram ? (
                        <td
                          onClick={() => showSpectrogram(call.spectrogram)}
                          className="tableSingleKey"
                        >
                          <img
                            src={call.spectrogram}
                            alt="spectrogram of a single call"
                            width="150px"
                            height="100px"
                          />
                        </td>
                      ) : (
                        <td
                          onClick={() => showSpectrogram(call.spectrogram)}
                          className="tableSingleKey"
                        >
                          <FontAwesomeIcon
                            className="savebutton"
                            icon={["fas", "eye-slash"]}
                            size={"sm"}
                          ></FontAwesomeIcon>{" "}
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
                      <td className="tableSingleKey "> ML/Hm</td>
                      <td className="tableSingleKey "> %</td>
                      <td className="tableSingleKey commentKey">
                        <form
                          className="commentForm"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handlesubmit(e);
                            }
                          }}
                          key={call.callId}
                          id={call.callId}
                        >
                          <textarea
                            className="commentBoxInput  textareacommentsInput"
                            onSelect={() => setCallIdOnComment(call?.callId)}
                            key={call.callId}
                            type="textarea"
                            name="comment"
                            onChange={handleChange}
                            id={index + call.callId}
                            defaultValue={call.comment}
                          ></textarea>
                        </form>{" "}
                      </td>
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

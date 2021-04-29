import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Col, Dropdown, Table } from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";
import { useDispatch, useSelector } from "react-redux";
import { audioActions, callActions } from "../redux/actions";
import ModalCall from "./ModalCall";
import PaginationItem from "./Pagination";
import Form from "react-bootstrap/Form";

export default function TableDashboard() {
  // UseSelector brings the state from the reducers.
  // Dispatch send data to redux actions and reducers.
  const handleClose = () => {
    setShow(false);
    dispatch(callActions.clearCallsReducer());
    dispatch(audioActions.clearSelectedAudioReducer());
    setCallsperAudio([]);
    setSpectogramImage("");
  };

  const handleShow = () => setShow(true);
  const audios = useSelector((state) => state.audio.audio);
  const loading = useSelector((state) => state.audio.loading);
  const calls = useSelector((state) => state.call);
  const selectedAudio = useSelector((state) => state.audio.selectedAudio);
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [callsperAudio, setCallsperAudio] = useState([]);
  const [page, setPage] = useState(0);
  const [docsPerPage, setDocsPerPage] = useState(0);
  const [orderBy, setOrderBy] = useState("fileName");
  const [firstPage, setFirstPage] = useState(true);
  const [formData, setFormData] = useState({ comment: "" });
  const [audioIdOnComment, setAudioIdOnComment] = useState("");

  useEffect(() => {
    dispatch(audioActions.audiosRequest(docsPerPage, orderBy, "desc", page));
  }, [dispatch, page, docsPerPage, orderBy]);

  // Spectogram
  // Set the image to show in the modal of single calls, same as clear the img when you close the modal
  const [spectogramImage, setSpectogramImage] = useState("");
  const showSpectrogram = (spectogram) => {
    if (spectogram) {
      setSpectogramImage(spectogram);
    }
  };

  //Add Raw Audio Comment functions

  const deleteCommentAudio = (audioId) => {
    // console.log("DELETERAW AUDIO COMMENT", audioId);
    dispatch(audioActions.deleteCommentAudio(audioId));
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    // e.preventDefault();
    const { comment } = formData;
    const audioId = audioIdOnComment;
    dispatch(audioActions.addCommentRawAudio(comment, audioId));
  };

  useEffect(() => {}, [audioIdOnComment, audios, formData]);

  // To load the audios from storage (to be fixed)
  const loadAudios = (e) => {
    e.preventDefault();
    dispatch(audioActions.audiosRequest(docsPerPage, "audioId", "asc", page));
  };

  // Pagination (to be fixed add counter in the model schema)
  const handleClickOnNext = async () => {
    await setPage(page + 1);

    if (page > 0) {
      setFirstPage(false);
    }
  };

  const handleClickOnPrev = () => {
    if (page >= 1 && !loading) {
      setPage(page - 1);
    }
    if (page === 0) {
      setFirstPage(true);
    }
  };

  // Get an individual calls  inside of a RawAudio (To be fixed)
  // This function returns the state with single calls of a Raw Audio into a state([]).
  const getCalls = (gibbonCallList) => {
    gibbonCallList?.forEach((call) => {
      dispatch(callActions.getSingleCall(call));
      setCallsperAudio(calls);
    });
    handleShow();
  };

  // Get individual Rawaudio with a Modal.
  const toAudioId = (audioId, gibbonCallList) => {
    dispatch(audioActions.getSingleAudio(audioId));
    getCalls(gibbonCallList);
  };
  // ------- To do (Filters, add/delete comment in Main table) ----------.

  return (
    <>
      <div className="d-flex">
        <div className="reloadBtnContainer">
          <button className="reloadButton" onClick={loadAudios}></button>{" "}
        </div>
      </div>
      <div className="filterMenu">
        {" "}
        <Dropdown className="d-flex">
          {" "}
          <div className="m-2">Filter </div>{" "}
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            <FontAwesomeIcon
              className="savebutton "
              icon={["fas", "filter"]}
              color="white"
              size="lg"
            ></FontAwesomeIcon>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={(e) => setOrderBy("audioId")}
              href="#/action-1"
            >
              Audio Id
            </Dropdown.Item>
            <Dropdown.Item
              onClick={(e) => setOrderBy("recordDate")}
              href="#/action-2"
            >
              Record Date
            </Dropdown.Item>
            <Dropdown.Item
              onClick={(e) => setOrderBy("fileName")}
              href="#/action-3"
            >
              File Name
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <div>
          <Form>
            <Form.Group className="d-flex">
              <RangeSlider
                value={docsPerPage}
                onChange={(e) => setDocsPerPage(e.target.value)}
                variant="dark"
                size="sm"
                min={1}
                max={20}
                className="reloadButton"
              />{" "}
              <Col xs="3">
                <Form.Control value={docsPerPage} />
              </Col>{" "}
            </Form.Group>
          </Form>
        </div>
      </div>

      <Table responsive>
        <thead className="text-center tableHeader">
          <tr>
            <th>Id N&deg;</th>
            <th>File Name</th>
            <th>Record Date</th>
            <th>Duration</th>
            <th>Gibbon Calls</th>
            <th>Action</th>
            <th>Comments</th>
          </tr>
        </thead>
        <>
          {audios.length ? (
            <tbody>
              {audios.map((audio) => (
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
                    {new Date(
                      audio.recordDate._seconds * 1000
                    ).toLocaleDateString("en-US")}
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
                  <td className="tableSingleKeyBtn commentKey">
                    <div className="buttonscomments">
                      <Button
                        disabled={audio.comments ? true : false}
                        type="submit"
                        form="commentForm"
                        onClick={handleSubmit}
                        variant="outline-success"
                        size="sm"
                      >
                        {" "}
                        <FontAwesomeIcon
                          className="savebutton m-2"
                          icon={["fas", "check"]}
                          color="#04c45c"
                        ></FontAwesomeIcon>
                      </Button>{" "}
                      <Button
                        disabled={audio.comments ? false : true}
                        onClick={() => deleteCommentAudio(audio?.audioId)}
                        variant="outline-danger"
                        size="sm"
                      >
                        <FontAwesomeIcon
                          className="m-2"
                          icon={["fas", "times"]}
                          size="1x"
                          color="red"
                        ></FontAwesomeIcon>{" "}
                      </Button>{" "}
                    </div>
                  </td>
                  {audio.comments ? (
                    <td className="tableSingleKey commentKey">
                      <div className="commentBox textareacomments">
                        <div className="commentSubBox ">
                          <p className="text-center">{audio.comments}</p>
                        </div>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="tableSingleKey commentKey">
                        {" "}
                        <div className="commentBox textareacomments">
                          <Form
                            className="commentForm"
                            // onSubmit={handleSubmit}
                            key={audio.audioId}
                          >
                            <div className="addCommentBox commentBoxInput ">
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
            <thead className="text-center tableHeader">
              <tr>
                <th>No Audios</th>
              </tr>
            </thead>
          )}
        </>
      </Table>
      <PaginationItem
        firstPage={firstPage}
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
        spectogramImage={spectogramImage}
        showSpectrogram={showSpectrogram}
      />
    </>
  );
}

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Badge, Button, Dropdown, Table } from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";
import { useDispatch, useSelector } from "react-redux";
import { audioActions, callActions } from "../redux/actions";
import ModalCall from "./ModalCall";
import PaginationItem from "./Pagination";
import Form from "react-bootstrap/Form";

export default function TableDashboard() {
  const handleClose = () => {
    setShow(false);
    dispatch(callActions.clearCallsReducer());
    dispatch(audioActions.clearSelectedAudioReducer());
    setCallsperAudio([]);
    setSpectogramImage("");
  };
  const handleShow = () => setShow(true);
  const audios = useSelector((state) => state.audio.audio);
  console.log(`audios`, audios);
  const lastDocumentRedux = useSelector((state) => state.audio.latestDoc);
  const loading = useSelector((state) => state.audio.loading);
  const selectedAudio = useSelector((state) => state.audio.selectedAudio);
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [callsperAudio, setCallsperAudio] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [firstDoc, setFirstDoc] = useState();
  const [docsPerPage, setDocsPerPage] = useState(3);
  const [orderBy, setOrderBy] = useState("recordDate");
  const [order, setOrder] = useState("desc");
  const [firstPage, setFirstPage] = useState(true);
  const [formData, setFormData] = useState({ comment: "" });
  const [audioIdOnComment, setAudioIdOnComment] = useState("");
  const [spectogramImage, setSpectogramImage] = useState("");
  const [spectogramAudio, setSpectogramAudio] = useState("");

  useEffect(() => {
    dispatch(audioActions.audiosRequest(docsPerPage, orderBy, order, lastDoc));
  }, [dispatch, docsPerPage, orderBy, order, lastDoc]);

  // Spectogram
  // Set the image to show in the modal of single calls, same as clear the img when you close the modal

  const showSpectrogram = (spectogram, spectogramAudio) => {
    if (spectogram) {
      setSpectogramImage(spectogram);
      setSpectogramAudio(spectogramAudio);
    }
  };

  //Add/Delete RawAudio Comment

  const deleteCommentAudio = (audioId) => {
    dispatch(audioActions.deleteCommentAudio(audioId));
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { comment } = formData;
    const audioId = audioIdOnComment;
    dispatch(audioActions.addCommentRawAudio(comment, audioId));
  };

  // To load the audios from storage (to be fixed)
  const loadAudios = (e) => {
    e.preventDefault();
    dispatch(
      audioActions.audiosRequest(docsPerPage, "recordDate", "asc", lastDoc)
    );
  };

  // Pagination
  const handleClickOnNext = () => {
    setFirstDoc(audios[0]);
    setLastDoc(lastDocumentRedux);
  };

  const handleClickOnPrev = () => {
    console.log(`firstDoc`, firstDoc);
    setLastDoc(firstDoc);
  };

  // Get an individual calls  inside of a RawAudio
  // This function returns the state with single calls of a Raw Audio into a state([]).

  const getCalls = (gibbonCallsList) => {
    gibbonCallsList?.forEach((call) => {
      dispatch(callActions.getSingleCall(call));
    });
    handleShow();
  };

  // Get individual Rawaudio with a Modal.
  const toAudioId = (audioId, gibbonCallsList) => {
    dispatch(audioActions.getSingleAudio(audioId));
    getCalls(gibbonCallsList);
  };

  // ------- To do (Filters, add/delete comment in Main table) ----------.
  const sortOrder = () => {
    if (order === "asc") {
      setOrder("desc");
      setLastDoc(lastDocumentRedux);
    } else {
      setOrder("asc");
      setLastDoc(lastDocumentRedux);
    }
  };

  // Delete Audio from table

  const deleteAudio = (audioId) => {
    dispatch(audioActions.deleteAudio(audioId));
  };

  // Filter

  const clearFilterItem = (value) => () => {
    console.log(`value`, value);
    if ("docsPerPage") {
      setDocsPerPage(5);
    }
    if ("orderBy") {
      setOrderBy("recordDate");
    }
    if ("order") {
      setOrder("asc");
    }
  };

  return (
    <>
      <div className="d-flex">
        <div className="reloadBtnContainer">
          <div className="reloadButton" onClick={loadAudios}></div>{" "}
        </div>
      </div>

      <div className="filterMenu ">
        <div className="filterBadges ">
          <Badge className="singleBadgeNumber" variant="success">
            {" "}
            <FontAwesomeIcon
              onClick={clearFilterItem("docsPerPage")}
              className="savebutton"
              icon={["fas", "times"]}
              color="white"
            ></FontAwesomeIcon>{" "}
            {docsPerPage}
          </Badge>{" "}
          <Badge className="singleBadge" variant="warning">
            {" "}
            <FontAwesomeIcon
              onClick={clearFilterItem("orderBy")}
              className="savebutton"
              icon={["fas", "times"]}
              color="white"
            ></FontAwesomeIcon>{" "}
            {orderBy}
          </Badge>{" "}
          <Badge className="singleBadge" variant="info">
            {" "}
            <FontAwesomeIcon
              onClick={clearFilterItem("order")}
              className="savebutton"
              icon={["fas", "times"]}
              color="white"
            ></FontAwesomeIcon>{" "}
            {order}
          </Badge>{" "}
        </div>
        <div>
          <Form>
            <Form.Group className="formFilter">
              <div>
                Audios Per page
                <RangeSlider
                  value={docsPerPage}
                  onChange={(e) => setDocsPerPage(e.target.value)}
                  variant="dark"
                  size="sm"
                  min={1}
                  max={25}
                  className="reloadButton"
                />{" "}
              </div>
              <div
                className="boxRangerSlider"
                value={docsPerPage}
                readOnly="readonly"
              >
                <div className="boxRangerSliderInner">{docsPerPage}</div>
              </div>
            </Form.Group>
          </Form>
        </div>
      </div>

      <Table className="fullTable" responsive>
        <thead className="text-center tableHeader">
          <tr>
            <th className="lightweight tableSingleKey">N&deg; </th>
            <th className="lightweight tableSingleKey">
              File Name{" "}
              <FontAwesomeIcon
                className="btnSortOrder"
                icon={["fas", "sort-amount-up"]}
                size="1x"
                color="green"
                onClick={sortOrder}
              ></FontAwesomeIcon>{" "}
            </th>
            <th className="lightweight tableSingleKey">
              Record Date{" "}
              <FontAwesomeIcon
                className="btnSortOrder"
                icon={["fas", "sort-amount-up"]}
                size="1x"
                color="green"
                onClick={sortOrder}
              ></FontAwesomeIcon>{" "}
            </th>
            <th className="lightweight tableSingleKey">Duration</th>
            <th className="lightweight tableSingleKey">Gibbon Calls</th>
            <th className="lightweight tableSingleKey">Action</th>
            <th className="lightweight tableSingleKey">Comments </th>
            <th className="lightweight m-2">
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
            </th>
          </tr>
        </thead>
        <>
          {audios?.length ? (
            <tbody className="lightweight">
              {audios.map((audio, index) => (
                <tr
                  key={audio.audioId}
                  className={`${
                    index % 2 === 0
                      ? "cardBlack text-center  tableInner tableKey "
                      : "cardWhite text-center tableInner tableKey"
                  }`}
                >
                  <td
                    onClick={() =>
                      toAudioId(audio?.audioId, audio.gibbonCallsList)
                    }
                    className="tableSingleKey"
                  >
                    {index + 1}
                  </td>
                  <td
                    onClick={() =>
                      toAudioId(audio?.audioId, audio.gibbonCallsList)
                    }
                    className="tableSingleKey"
                  >
                    {audio.fileName}
                  </td>
                  <td
                    onClick={() =>
                      toAudioId(audio?.audioId, audio.gibbonCallsList)
                    }
                    className="tableSingleKey"
                  >
                    {new Date(
                      audio.recordDate.seconds * 1000
                    ).toLocaleDateString()}
                  </td>
                  <td
                    onClick={() =>
                      toAudioId(audio?.audioId, audio.gibbonCallsList)
                    }
                    className="tableSingleKey"
                  >
                    {audio.duration}
                  </td>
                  <td
                    onClick={() =>
                      toAudioId(audio?.audioId, audio.gibbonCallsList)
                    }
                    className="tableSingleKey"
                  >
                    {audio.gibbonCalls}
                  </td>
                  <td className="tableSingleKeyBtn commentKey">
                    <div className="buttonscomments">
                      <Button
                        className="savebutton commentBtns commentBtnsSave"
                        disabled={audio.comments ? true : false}
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
                        disabled={audio.comments ? false : true}
                        onClick={() => deleteCommentAudio(audio?.audioId)}
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
                          <Form className="commentForm" key={audio.audioId}>
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
                  <td className="lastCell tableSingleKey">
                    {" "}
                    <FontAwesomeIcon
                      className="btndeleteAudio"
                      icon={["fas", "times"]}
                      // size="1x"
                      color="#b94242"
                      onClick={() => deleteAudio(audio?.audioId)}
                    ></FontAwesomeIcon>{" "}
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
        spectogramAudio={spectogramAudio}
        showSpectrogram={showSpectrogram}
      />
    </>
  );
}

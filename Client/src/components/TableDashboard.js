import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button, Dropdown, Table } from "react-bootstrap";
// import RangeSlider from "react-bootstrap-range-slider";
import { useDispatch, useSelector } from "react-redux";
import { audioActions, callActions } from "../redux/actions";
import ModalCall from "./ModalCall";
import PaginationItem from "./Pagination";
import Form from "react-bootstrap/Form";
import logoFF from "../images/logo-reduced.png";

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
  const lastDocumentRedux = useSelector((state) => state.audio.latestDoc);
  const firstDocumentRedux = useSelector((state) => state.audio.firstDocument);
  const loading = useSelector((state) => state.audio.loading);
  const selectedAudio = useSelector((state) => state.audio.selectedAudio);
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [callsperAudio, setCallsperAudio] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [firstDoc, setFirstDoc] = useState();
  const [docsPerPage, setDocsPerPage] = useState(15);
  const [orderBy, setOrderBy] = useState("recordDate");
  const [order, setOrder] = useState("desc");
  const [formData, setFormData] = useState({ comment: "" });
  const [audioIdOnComment, setAudioIdOnComment] = useState("");
  const [spectogramImage, setSpectogramImage] = useState("");

  useEffect(() => {
    dispatch(
      // Get audios default limit 2, order by record date, order desc, null, null,//
      audioActions.audiosRequest(docsPerPage, orderBy, order, lastDoc, firstDoc)
    );
  }, [dispatch, docsPerPage, orderBy, order, lastDoc, firstDoc]);

  // Spectogram
  // Set the image to show in the modal of single calls, same as clear the img when you close the modal

  const showSpectrogram = (spectogram) => {
    if (spectogram) {
      setSpectogramImage(spectogram);
    }
  };

  //Add/Delete RawAudio Comment

  const deleteCommentAudio = (audioId) => {
    dispatch(audioActions.deleteCommentAudio(audioId));
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    if (formData.comment === "") {
      console.log("Nothing to send");
    } else {
      e.preventDefault();
      const { comment } = formData;
      console.log(`e`, formData);
      const audioId = audioIdOnComment;
      dispatch(audioActions.addCommentRawAudio(comment, audioId));
    }
  };

  // To load the audios from storage (to be fixed)
  const loadAudios = (e) => {
    e.preventDefault();
    setDocsPerPage(15);
    dispatch(
      audioActions.audiosRequest(docsPerPage, "recordDate", "desc", lastDoc)
    );
  };

  // Pagination
  const handleClickOnNext = () => {
    setFirstDoc(null);
    setLastDoc(lastDocumentRedux);
  };

  const handleClickOnPrev = () => {
    setLastDoc(null);
    setFirstDoc(firstDocumentRedux);
  };

  // Get an individual calls  inside of a RawAudio
  // This function returns the state with single calls of a Raw Audio into a state([]).

  const getCalls = (gibbonCallsList) => {
    gibbonCallsList?.forEach((call) => {
      // console.log(`call`, call);
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
  // Set order Record Date

  const sortOrder = (orderByFunction) => {
    console.log(`orderBy`, orderByFunction);
    if (order === "asc") {
      setOrderBy(orderByFunction);
      setOrder("desc");
      // setLastDoc(firstDocumentRedux);
    } else {
      setOrder("asc");
      // setLastDoc(firstDocumentRedux);
      setOrderBy(orderByFunction);
    }
  };

  // Set order file Name

  // Delete Audio from table

  const deleteAudio = (audioId) => {
    dispatch(audioActions.deleteAudio(audioId));
  };

  // Filter

  // const clearFilterItem = (value) => () => {
  //   console.log(`value`, value);
  //   if ("docsPerPage") {
  //     setDocsPerPage(5);
  //   }
  //   if ("orderBy") {
  //     setOrderBy("recordDate");
  //   }
  //   if ("order") {
  //     setOrder("asc");
  //   }
  // };

  return (
    <>
      <div className="d-flex">
        <div className="reloadBtnContainer">
          <div className="reloadButton" onClick={loadAudios}></div>{" "}
        </div>
      </div>

      <div className="filterMenu ">
        <div className="filterBadges "></div>
        <div>
          <Form>
            <Form.Group className="formFilter">
              {/* <div>
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
              </div> */}
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
                size="sm"
                color="green"
                onClick={(e) => sortOrder("fileName")}
              ></FontAwesomeIcon>{" "}
            </th>
            <th className="lightweight tableSingleKey">
              Record Date{" "}
              <FontAwesomeIcon
                className="btnSortOrder"
                icon={["fas", "sort-amount-up"]}
                size="sm"
                color="green"
                onClick={(e) => sortOrder("recordDate")}
                // onClick={sortOrder}
              ></FontAwesomeIcon>{" "}
            </th>
            <th className="lightweight tableSingleKey">
              Duration{" "}
              <FontAwesomeIcon
                className="btnSortOrder"
                icon={["fas", "sort-amount-up"]}
                size="sm"
                color="green"
                onClick={(e) => sortOrder("duration")}
              ></FontAwesomeIcon>{" "}
            </th>
            <th className="lightweight tableSingleKey">
              Gibbon Calls{" "}
              <FontAwesomeIcon
                className="btnSortOrder"
                icon={["fas", "sort-amount-up"]}
                size="sm"
                color="green"
                onClick={(e) => sortOrder("correctCalls")}
              ></FontAwesomeIcon>{" "}
            </th>
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
                  <Dropdown.Item onClick={(e) => setOrderBy("recordDate")}>
                    Record Date
                  </Dropdown.Item>
                  <Dropdown.Item onClick={(e) => setOrderBy("fileName")}>
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
                    className="tableSingleKey indexKey"
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
                    {audio.correctCalls}
                  </td>
                  <td className="">
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
                      color="#b94242"
                      onClick={() => deleteAudio(audio?.audioId)}
                    ></FontAwesomeIcon>{" "}
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <thead className="text-center notfoundAudios">
              <tr>
                <td>
                  <h5>No Audios Found...</h5>

                  <img src={logoFF} width={"100px"} alt="logoFF" />
                </td>
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
        spectogramImage={spectogramImage}
        showSpectrogram={showSpectrogram}
        getCalls={getCalls}
      />
    </>
  );
}

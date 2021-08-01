import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Dropdown, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { audioActions, callActions } from "../redux/actions";
import ModalCall from "./ModalCall";
import PaginationItem from "./Pagination";
// import Form from "react-bootstrap/Form";
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

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Send the form with the comment and Audio Id to audio actions. //
  const handlesubmit = (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter" || e.type === "click") {
      const { comment } = formData;
      const audioId = audioIdOnComment;
      dispatch(audioActions.addCommentRawAudio(comment, audioId));
      e.preventDefault();
    }
    setFormData({ comment: "" });
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

  return (
    <>
      <div className="d-flex">
        <div className="reloadBtnContainer">
          <div className="reloadButton" onClick={loadAudios}></div>{" "}
        </div>
      </div>

      <Table className="fullTable" responsive="md">
        <thead className="text-center tableHeader">
          <tr>
            <th className="lightweight tableSingleKey">N&deg; </th>
            <th className="lightweight tableSingleKey">
              Audio Id{" "}
              <FontAwesomeIcon
                className="btnSortOrder"
                icon={["fas", "sort-amount-up"]}
                size="sm"
                color="green"
                onClick={(e) => sortOrder("audioId")}
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
            <th className="lightweight tableSingleKey">Gibbon Calls </th>
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
                      ? "cardDark text-center  tableInner tableKey "
                      : "cardWhite text-center tableInner tableKey"
                  }`}
                >
                  <td className="tableSingleKey indexKey">{index + 1}</td>
                  <td className="tableSingleKey">{audio.audioId}</td>
                  <td
                    onClick={() =>
                      toAudioId(audio?.audioId, audio?.gibbonCallsList)
                    }
                    className="tableSingleKey"
                  >
                    {new Date(
                      audio.recordDate.seconds * 1000
                    ).toLocaleDateString()}
                  </td>
                  <td
                    onClick={() =>
                      toAudioId(audio?.audioId, audio?.gibbonCallsList)
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
                    {audio.gibbonCallsList?.length > 0
                      ? audio.gibbonCallsList?.length
                      : 0}
                    {/* {audio.correctCalls} */}
                  </td>

                  <td className="tableSingleKey commentKey">
                    <form
                      className="commentForm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handlesubmit(e);
                        }
                      }}
                      key={audio.audioId}
                      id={audio.audioId}
                    >
                      <textarea
                        className="textareacommentsInput"
                        onSelect={() => setAudioIdOnComment(audio?.audioId)}
                        key={audio.audioId}
                        type="textarea"
                        name="comment"
                        onChange={handleChange}
                        id={index + audio.audioId}
                        defaultValue={audio.comments}
                        placeholder="Add comment..."
                        cols="30"
                        rows="30"
                      ></textarea>
                    </form>
                  </td>

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
                  <h5>No more audios found...</h5>

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

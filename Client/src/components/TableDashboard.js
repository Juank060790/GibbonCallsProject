import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  audioActions,
  callActions,
  spectrogramActions,
} from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import logoFF from "../images/logo-reduced.png";
import PaginationItem from "./Pagination";
import { OverlayTrigger, Table } from "react-bootstrap";
import SearchBar from "./SearchBar";
import ModalCall from "./ModalCall";
import { Tooltip } from "react-bootstrap";
import ScaleLoader from "react-spinners/ScaleLoader";

export default function TableDashboard() {
  const firstDoc = useSelector((state) => state.audio.firstDoc);
  const lastDoc = useSelector((state) => state.audio.lastDoc);
  const loading = useSelector((state) => state.audio.loading);
  const audios = useSelector((state) => state.audio.audio);
  const [audioIdOnComment, setAudioIdOnComment] = useState("");

  const [formData, setFormData] = useState({ comment: "" });
  const [callsperAudio, setCallsperAudio] = useState([]);
  const [orderBy, setOrderBy] = useState("recordDate");
  // eslint-disable-next-line
  const [docsPerPage, setDocsPerPage] = useState(10);

  const [order, setOrder] = useState("desc");
  const [show, setShow] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const handleShow = () => setShow(true);
  const dispatch = useDispatch();

  const handleClose = () => {
    setShow(false);
    dispatch(callActions.clearCallsReducer());
    dispatch(spectrogramActions.clearSelection());
    setCallsperAudio([]);
  };

  useEffect(() => {
    dispatch(
      // Get audios default limit, order by record date, order desc, null, null,//
      audioActions.audiosRequest(docsPerPage, orderBy, order, lastDoc, firstDoc)
    );
  }, []);

  // Spectrogram
  // Set the image to show in the modal of single calls, same as clear the img when you close the modal
  // const showSpectrogram = (spectrogram) => {
  //   if (spectrogram) {
  //     setSpectrogramImage(spectrogram);
  //   }
  // };

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

  // Pagination
  const handleClickOnNext = () => {
    console.log("Next");
    // setFirstDoc(null);
    // setLastDoc(lastDocumentRedux);
    dispatch(
      audioActions.audiosRequest(
        docsPerPage,
        orderBy,
        order,
        lastDoc,
        firstDoc,
        "next"
      )
    );
    setPageNumber(pageNumber + 1);
  };

  const handleClickOnPrev = () => {
    console.log("Prev");
    // setLastDoc(null);
    // setFirstDoc(firstDocumentRedux);
    dispatch(
      audioActions.audiosRequest(
        docsPerPage,
        orderBy,
        order,
        lastDoc,
        firstDoc,
        "previous"
      )
    );
    setPageNumber(pageNumber - 1);
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
  const toAudioId = (audioId, gibbonCallsList, audioLink) => {
    dispatch(audioActions.getSingleAudio(audioId));

    // console.log(audioLink);
    // dispatch(audioActions.getAudioFromFirebase(audioLink));
    console.log(audioLink);
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

  // const deleteAudio = (audioId) => {
  //   console.log(`audioId`, audioId);
  //   dispatch(audioActions.deleteAudio(audioId));
  // };

  const saveCommentTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Press "Enter" to save comment.
    </Tooltip>
  );

  return (
    <div className="dashboard">
      {loading ? (
        <>
          <p style={{ color: "#56c597ab", fontSize: "1.5rem" }}>Loading...</p>
          <ScaleLoader color="#56c597ab" height="4rem" width="0.8rem" />
        </>
      ) : (
        <div className="fullTable">
          {/* <SearchBar /> */}
          <Table responsive="md">
            <thead className="text-center tableHeader">
              <tr>
                {/* <th className="lightweight tableSingleKey">N&deg; </th> */}
                <th className="lightweight tableSingleKey audioIdKey">
                  Audio Id{" "}
                  {/* <FontAwesomeIcon
                  className="btnSortOrder"
                  icon={["fas", "sort-amount-up"]}
                  size="sm"
                  color="green"
                  onClick={(e) => sortOrder("audioId")}
                ></FontAwesomeIcon>{" "} */}
                </th>
                <th className="lightweight tableSingleKey">
                  Record Date{" "}
                  <FontAwesomeIcon
                    className={`${
                      order === "desc"
                        ? "btnSortOrder btn-desc"
                        : "btnSortOrder btn-asc"
                    }`}
                    icon={["fas", "sort-up"]}
                    size="sm"
                    color="green"
                    onClick={(e) => sortOrder("recordDate")}
                  ></FontAwesomeIcon>{" "}
                </th>

                <th className="lightweight tableSingleKey">Duration </th>
                <th className="lightweight tableSingleKey">Calls </th>
                <th className="lightweight tableSingleKey">Comments</th>
              </tr>
            </thead>
            <>
              {audios?.length ? (
                <tbody className="lightweight">
                  {audios
                    .slice(0, docsPerPage) // Offset the extra document to check for last page
                    .map((audio, index) => (
                      <tr
                        key={audio.id}
                        className="cardWhite text-center  tableInner tableKey"
                      >
                        {/* <td className="tableSingleKey indexKey">{index + 1}</td> */}
                        <td
                          className="tableSingleKey audioIdKey"
                          onClick={() =>
                            toAudioId(
                              audio?.id,
                              audio?.gibbonCallsList,
                              audio.audioLink
                            )
                          }
                        >
                          {audio.audioLink}
                        </td>
                        <td
                          onClick={() =>
                            toAudioId(
                              audio?.id,
                              audio?.gibbonCallsList,
                              audio.audioLink
                            )
                          }
                          className="tableSingleKey "
                        >
                          {new Date(
                            audio.recordDate.seconds * 1000
                          ).toLocaleDateString("en-GB", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })}
                        </td>
                        <td
                          onClick={() =>
                            toAudioId(
                              audio?.id,
                              audio.gibbonCallsList,
                              audio.audioLink
                            )
                          }
                          className="tableSingleKey"
                        >
                          5:00
                        </td>

                        <td
                          onClick={() =>
                            toAudioId(
                              audio?.id,
                              audio.gibbonCallsList,
                              audio.audioLink
                            )
                          }
                          className="tableSingleKey gibbonCallsKeys"
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
                            key={audio.id}
                            id={audio.id}
                          >
                            <OverlayTrigger
                              placement="top"
                              delay={{ show: 1000, hide: 100 }}
                              overlay={saveCommentTooltip}
                            >
                              <textarea
                                className="textareacommentsInput"
                                onSelect={() => setAudioIdOnComment(audio?.id)}
                                key={audio.id}
                                type="textarea"
                                name="comment"
                                onChange={handleChange}
                                id={index + audio.id}
                                defaultValue={audio.comments}
                                placeholder="Add comment..."
                                cols="50"
                                rows="40"
                              ></textarea>
                            </OverlayTrigger>
                          </form>
                        </td>

                        {/* <td className="lastCell tableSingleKey">
                      {" "}
                      <FontAwesomeIcon
                        className="btndeleteAudio"
                        icon={["fas", "trash-alt"]}
                        // color="#b94242"
                        onClick={() => deleteAudio(audio.id)}
                      ></FontAwesomeIcon>{" "}
                    </td> */}
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
            // loading={loading}
            handleClickOnNext={handleClickOnNext}
            handleClickOnPrev={handleClickOnPrev}
            pageNumber={pageNumber}
            lastPage={audios.length < docsPerPage}
          />
        </div>
      )}

      <ModalCall
        showModal={show}
        callsperAudio={callsperAudio}
        handleClose={handleClose}
        getCalls={getCalls}
      />
    </div>
  );
}

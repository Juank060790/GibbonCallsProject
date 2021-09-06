import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Container, Dropdown, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { audioActions, callActions } from "../redux/actions";
import ModalCall from "./ModalCall";
import PaginationItem from "./Pagination";
// import Form from "react-bootstrap/Form";
import logoFF from "../images/logo-reduced.png";
import SearchBar from "./SearchBar";

export default function TableDashboard() {
  const handleClose = () => {
    setShow(false);
    dispatch(callActions.clearCallsReducer());
    dispatch(audioActions.clearSelectedAudioReducer());
    setCallsperAudio([]);
    setSpectrogramImage("");
  };
  const selectedAudio = useSelector((state) => state.audio.selectedAudio);
  const firstDocumentRedux = useSelector((state) => state.audio.firstDocument);
  const lastDocumentRedux = useSelector((state) => state.audio.latestDoc);
  const loading = useSelector((state) => state.audio.loading);
  const audios = useSelector((state) => state.audio.audio);
  const handleShow = () => setShow(true);
  const [audioIdOnComment, setAudioIdOnComment] = useState("");
  const [spectrogramImage, setSpectrogramImage] = useState("");
  const [formData, setFormData] = useState({ comment: "" });
  const [callsperAudio, setCallsperAudio] = useState([]);
  const [orderBy, setOrderBy] = useState("recordDate");
  const [docsPerPage, setDocsPerPage] = useState(15);
  const [lastDoc, setLastDoc] = useState(null);
  const [order, setOrder] = useState("desc");
  const [firstDoc, setFirstDoc] = useState();
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      // Get audios default limit, order by record date, order desc, null, null,//
      audioActions.audiosRequest(docsPerPage, orderBy, order, lastDoc, firstDoc)
    );
  }, [dispatch, docsPerPage, orderBy, order, lastDoc, firstDoc]);

  // Spectrogram
  // Set the image to show in the modal of single calls, same as clear the img when you close the modal
  const showSpectrogram = (spectrogram) => {
    if (spectrogram) {
      setSpectrogramImage(spectrogram);
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
  // const loadAudios = (e) => {
  //   e.preventDefault();
  //   setDocsPerPage(15);
  //   dispatch(
  //     audioActions.audiosRequest(docsPerPage, "recordDate", "desc", lastDoc)
  //   );
  // };

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
    console.log(`audioId`, audioId);
    dispatch(audioActions.deleteAudio(audioId));
  };

  return (
    <>
      <div className="fullTable">
        <SearchBar />
        <Table className="fullTable" responsive="md">
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
              <th className="lightweight tableSingleKey">Gibbon Calls </th>
              <th className="lightweight tableSingleKey">Comments</th>
            </tr>
          </thead>
          <>
            {audios?.length ? (
              <tbody className="lightweight">
                {audios.map((audio, index) => (
                  <tr
                    key={audio.id}
                    className={`${
                      index % 2 === 0
                        ? "cardDark text-center  tableInner tableKey "
                        : "cardWhite text-center tableInner tableKey"
                    }`}
                  >
                    {/* <td className="tableSingleKey indexKey">{index + 1}</td> */}
                    <td className="tableSingleKey">{audio.audioLink}</td>
                    <td
                      onClick={() =>
                        toAudioId(audio?.id, audio?.gibbonCallsList)
                      }
                      className="tableSingleKey audioIdKey"
                    >
                      {new Date(
                        audio.recordDate.seconds * 1000
                      ).toLocaleDateString()}
                    </td>
                    <td
                      onClick={() =>
                        toAudioId(audio?.id, audio.gibbonCallsList)
                      }
                      className="tableSingleKey"
                    >
                      5:00
                    </td>

                    <td
                      onClick={() =>
                        toAudioId(audio?.id, audio.gibbonCallsList)
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
                        key={audio.id}
                        id={audio.id}
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
                          cols="30"
                          rows="30"
                        ></textarea>
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
          loading={loading}
          handleClickOnNext={handleClickOnNext}
          handleClickOnPrev={handleClickOnPrev}
        />
      </div>
      <ModalCall
        showModal={show}
        selectedAudio={selectedAudio}
        callsperAudio={callsperAudio}
        handleClose={handleClose}
        spectrogramImage={spectrogramImage}
        showSpectrogram={showSpectrogram}
        getCalls={getCalls}
      />
    </>
  );
}

import { Container, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import logoFF from "../images/logo-reduced.png";
import { useSelector } from "react-redux";
import React from "react";
import NewCallSpectrogram from "./NewCallSpectrogram.js";

export default function TableNewCalls(props) {
  const {
    labelNewCall,
    saveCommentNewCall,
    saveRegionsDataBase,
    selectedAudio,
    clearRegions,
  } = props;

  const imageToShow = useSelector((state) => state.spectrogram.showImage);
  console.log("imageToShow :>> ", imageToShow);

  const selections = useSelector((state) => state.spectrogram.selections);

  const saveBtnTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Save regions
    </Tooltip>
  );
  const deleteBtnTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Remove
    </Tooltip>
  );

  const secondsToTime = (seconds) => {
    var date = new Date(null);
    date.setSeconds(seconds);

    return date.toISOString().substr(11, 8);
  };

  return (
    <Container fluid className=" MediaPlayerContainer">
      <div className="subTableNewCall">
        <div className="ButtonsRegionsContainer">
          <h4>Create a Call</h4>
          <div>
            <OverlayTrigger
              placement="top"
              delay={{ show: 100, hide: 100 }}
              overlay={saveBtnTooltip}
            >
              <button
                className="saveBtn btn-success"
                onClick={() =>
                  saveRegionsDataBase(selections, selectedAudio.id)
                }
              >
                <FontAwesomeIcon icon="save" />
              </button>
            </OverlayTrigger>
          </div>
        </div>
        <Table responsive>
          <thead className="text-center tableSaveRegionHeader">
            <tr>
              <th>Time Start</th>
              <th>Time End</th>
              <th>Spectrogram</th>
              <th>Call Id</th>
              <th>Label</th>
              <th>Comments</th>
              <th>Remove</th>
            </tr>
          </thead>
          <>
            {selections?.map((call, index) => (
              <tbody key={index}>
                {call.dataBase === undefined ? (
                  <tr
                    key={call.id + index}
                    className={`${
                      index % 2 === 0
                        ? "cardDark text-center  tableInner tableKey-newcalls "
                        : "cardWhite text-center tableInner tableKey-newcalls"
                    }`}
                  >
                    {/* <td className="indexandcolor indexCell tableSingleKeyEditCalls">
                    <FontAwesomeIcon
                      className="labelColorSquare m-2"
                      icon={["fas", "square"]}
                      color={call?.color}
                    ></FontAwesomeIcon>
                  </td> */}

                    <td className="tableSingleKeyEditCalls">
                      {secondsToTime(call.start)}
                    </td>
                    <td className="tableSingleKeyEditCalls">
                      {secondsToTime(call.end)}
                    </td>
                    <td className="tableSingleKeyEditCalls">
                      <NewCallSpectrogram call={call} />
                      {/* <img
                      onMouseEnter={() => {
                        setTimeout(() => {
                          setImageToShow(call.spectrogram);
                        }, 300);
                      }}
                      onMouseOut={() => {
                        setImageToShow(logoFF);
                      }}
                      width="100px"
                      src={call?.spectrogram}
                      alt="spectrogram from region"
                    /> */}
                    </td>

                    <td className="tableSingleKeyEditCalls commentKey">
                      {call.id}
                    </td>
                    <td key={call.id} className=" tableSingleKeyEditCalls ">
                      <select
                        className="dropdownKey "
                        onChange={(event) =>
                          labelNewCall(event.target.value, call.id)
                        }
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                      </select>
                    </td>

                    <td className="lastCell tableSingleKeyEditCalls">
                      <textarea
                        className="textareacommentsInput"
                        // onSelect={() => saveCommentNewCall(call?.id)}
                        key={call.id}
                        type="textarea"
                        name="comment"
                        onChange={(event) =>
                          saveCommentNewCall(event, call?.id)
                        }
                        id={index + call.id}
                        defaultValue={call.comments}
                        placeholder="Add comment..."
                        cols="30"
                        rows="30"
                      ></textarea>
                      {/* </form> */}
                    </td>
                    <td className="buttons-actions">
                      {" "}
                      <OverlayTrigger
                        placement="top"
                        delay={{ show: 100, hide: 100 }}
                        overlay={deleteBtnTooltip}
                      >
                        <button
                          className="remove-btn btn-warning"
                          onClick={() => clearRegions(call.id)}
                        >
                          <FontAwesomeIcon icon="trash-alt" />
                        </button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            ))}
          </>
        </Table>
      </div>

      {/* {imageToShow ? (
        <div className="spectrogramImageContainer">
          <NewCallSpectrogram call={imageToShow} />
        </div>
      ) : (
        <div className="spectrogramImageContainer">
          <img
            className="spectrogramImage fade-in"
            src={logoFF}
            alt="Spectrogram "
          />
        </div>
      )} */}
    </Container>
  );
}

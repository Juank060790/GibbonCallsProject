import {
  Container,
  OverlayTrigger,
  Table,
  Tooltip,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logoFF from "../images/logo-reduced.png";
import { useSelector } from "react-redux";
import React from "react";
import NewCallSpectrogram from "./NewCallSpectrogram.js";
import HighlightedSpectrogram from "./HighlightedSpectrogram.js";
import toTimeString from "../helpers/utils";

export default function TableNewCalls(props) {
  const {
    labelNewCall,
    saveCommentNewCall,
    saveRegionsDataBase,
    selectedAudio,
    clearRegions,
  } = props;

<<<<<<< HEAD
  // const imageToShow = useSelector((state) => state.spectrogram.showImage);
  // console.log("imageToShow :>> ", imageToShow);

=======
>>>>>>> 83750d152dfebc633416b97cc69f7d80e19879a3
  const selections = useSelector((state) => state.spectrogram.selections);
  const highlightedSelection = useSelector((state) =>
    state.spectrogram.selections.find((selection) => selection.highlighted)
  );

  const saveBtnTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Add calls to database
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
      <Row>
        <Col>
          <div className="subTableNewCall">
            <div className="ButtonsRegionsContainer">
              <h4>Add New Call(s)</h4>
            </div>
            <Table responsive>
              <thead className="text-center tableSaveRegionHeader">
                <tr>
                  <th>Start</th>
                  <th>End</th>
                  <th>Spectrogram</th>

                  <th>Label</th>
                  <th>Comments</th>
                  <th></th>
                </tr>
              </thead>
              <>
                {selections?.map((call, index) => (
                  <tbody key={index}>
                    {call.dataBase === undefined ? (
                      <tr
                        key={call.id + index}
                        className={`text-center tableInner tableKey-newcalls ${
                          call.highlighted || "highlighted"
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
                          {toTimeString(call.start)}
                        </td>
                        <td className="tableSingleKeyEditCalls">
                          {toTimeString(call.end)}
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

                        <td key={call.id} className=" tableSingleKeyEditCalls ">
                          <select
                            className="dropdownKey "
                            onChange={(event) =>
                              labelNewCall(event.target.value, call.id)
                            }
                          >
                            <option value="staccato">Staccato</option>
                            <option value="multi-modulated">
                              Multi-modulated
                            </option>
                            <option value="great-call">Great Call</option>
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
                  Add
                </button>
              </OverlayTrigger>
            </div>
          </div>
        </Col>
        <Col>
          <div className="ButtonsRegionsContainer">
            <h4>Preview</h4>
          </div>
          {highlightedSelection ? (
            <div className="spectrogramImageContainer">
              <HighlightedSpectrogram call={highlightedSelection} />
            </div>
          ) : (
            <div className="spectrogramImageContainer">
              <img
                className="spectrogramImage"
                src={logoFF}
                alt="Spectrogram "
              />
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import notFoundImage from "../images/No_image_available.svg";
import logoFF from "../images/logo-reduced.png";
import { Container, Table } from "react-bootstrap";
import React, { useEffect, useState } from "react";
export default function TableNewCalls(props) {
  const {
    regionsArray,
    labelNewCall,
    saveCommentNewCall,
    saveRegionsDataBase,
    selectedAudio,
  } = props;
  const [imageToShow, setImageToShow] = useState(logoFF);

  useEffect(() => {
    if (imageToShow === notFoundImage) {
      return;
    } else {
      console.log("imageTrans");
      const imageTranstition = () => {};
    }
  }, [imageToShow]);

  return (
    <Container fluid className=" MediaPlayerContainer">
      <div className="subTableNewCall">
        <div className="ButtonsRegionsContainer">
          <h4>Create or Edit Call</h4>
          <div>
            <button
              className="saveBtn btn-success"
              onClick={() => saveRegionsDataBase(regionsArray, selectedAudio)}
            >
              <FontAwesomeIcon icon="save" />
            </button>
          </div>
        </div>
        <Table responsive>
          <thead className="text-center tableSaveRegionHeader">
            <tr>
              <th className="indexCell idNumberModal">Call</th>

              <th>Time Start</th>
              <th>Time End</th>
              <th>Spectrogram</th>
              <th>Call Id</th>
              <th>Label</th>
              <th>Comments</th>
            </tr>
          </thead>
          <>
            {regionsArray?.map((call, index) => (
              <tbody key={index}>
                <tr
                  key={call.callId}
                  className={`${
                    index % 2 === 0
                      ? "cardDark text-center  tableInner tableKey "
                      : "cardWhite text-center tableInner tableKey"
                  }`}
                >
                  <td className="indexandcolor indexCell tableSingleKeyEditCalls">
                    <FontAwesomeIcon
                      className="labelColorSquare m-2"
                      icon={["fas", "square"]}
                      color={call?.color}
                    ></FontAwesomeIcon>
                  </td>

                  <td className="tableSingleKeyEditCalls">
                    {call.start?.toFixed(3)}
                  </td>
                  <td className="tableSingleKeyEditCalls">
                    {call.end?.toFixed(3)}
                  </td>
                  <td className="tableSingleKeyEditCalls">
                    <img
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
                      alt="spectrogramfrom region"
                    />
                  </td>

                  <td className="tableSingleKeyEditCalls commentKey">
                    {call.callId}
                  </td>
                  <td
                    key={call.callId}
                    className=" tableSingleKeyEditCalls dropdownKey"
                  >
                    <select
                      className="dropdownKey"
                      onChange={(event) =>
                        labelNewCall(event.target.value, call.callId)
                      }
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                  </td>

                  <td className="lastCell tableSingleKeyEditCalls">
                    <textarea
                      className="textareacommentsInput"
                      // onSelect={() => saveCommentNewCall(call?.callId)}
                      key={call.callId}
                      type="textarea"
                      name="comment"
                      onChange={(event) =>
                        saveCommentNewCall(event, call?.callId)
                      }
                      id={index + call.callId}
                      defaultValue={call.comments}
                      placeholder="Add comment..."
                      cols="30"
                      rows="30"
                    ></textarea>
                    {/* </form> */}
                  </td>
                </tr>
              </tbody>
            ))}
          </>
        </Table>
      </div>

      {imageToShow === logoFF ? (
        <div className="spectrogramImageContainer">
          <img
            className="spectrogramImage fade-in"
            src={logoFF}
            alt="Spectrogram "
          />
        </div>
      ) : (
        <div className="spectrogramImageContainer">
          <img
            className={`${
              imageToShow === logoFF
                ? "spectrogramImageFull fade-out"
                : "spectrogramImageFull fade-in"
            }`}
            src={imageToShow}
            alt="Spectrogram "
          />
        </div>
      )}
    </Container>
  );
}

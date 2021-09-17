import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logoFF from "../images/logo-reduced.png";
import { Container, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { spectrogramActions } from "../redux/actions";
import RowNewCalls from "./RowNewCalls";
// export default function TableNewCalls(props) {
//   const {
//     regionsArray,
//     labelNewCall,
//     saveCommentNewCall,
//     saveRegionsDataBase,
//     selectedAudio,
//     clearRegions,
//   } = props;

//   const [imageToShow, setImageToShow] = useState(logoFF);

//   const saveBtnTooltip = (props) => (
//     <Tooltip id="button-tooltip" {...props}>
//       Save regions
//     </Tooltip>
//   );
//   const deleteBtnTooltip = (props) => (
//     <Tooltip id="button-tooltip" {...props}>
//       Delete regions
//     </Tooltip>
//   );

//   return (
//     <Container fluid className=" MediaPlayerContainer">
//       <div className="subTableNewCall">
//         <div className="ButtonsRegionsContainer">
//           <h4>Create a Call</h4>
//           <div>
//             <OverlayTrigger
//               placement="top"
//               delay={{ show: 100, hide: 100 }}
//               overlay={saveBtnTooltip}
//             >
//               <button
//                 className="saveBtn btn-success"
//                 onClick={() =>
//                   saveRegionsDataBase(regionsArray, selectedAudio.id)
//                 }
//               >
//                 <FontAwesomeIcon icon="save" />
//               </button>
//             </OverlayTrigger>
//             <OverlayTrigger
//               placement="top"
//               delay={{ show: 100, hide: 100 }}
//               overlay={deleteBtnTooltip}
//             >
//               <button
//                 className="saveBtn btn-success"
//                 onClick={() => clearRegions()}
//               >
//                 <FontAwesomeIcon icon="trash-alt" />
//               </button>
//             </OverlayTrigger>
//           </div>
//         </div>
// <Table responsive>
//   <thead className="text-center tableSaveRegionHeader">
//     <tr>
//       <th className="indexCell idNumberModal">Call</th>

//       <th>Time Start</th>
//       <th>Time End</th>
//       <th>Spectrogram</th>
//       <th>Call Id</th>
//       <th>Label</th>
//       <th>Comments</th>
//     </tr>
//   </thead>
//   <>
//     {regionsArray?.map((call, index) => (
//       <tbody key={index}>
//         <tr
//           key={call.id}
//           className={`${
//             index % 2 === 0
//               ? "cardDark text-center  tableInner tableKey "
//               : "cardWhite text-center tableInner tableKey"
//           }`}
//         >
//           <td className="indexandcolor indexCell tableSingleKeyEditCalls">
//             <FontAwesomeIcon
//               className="labelColorSquare m-2"
//               icon={["fas", "square"]}
//               color={call?.color}
//             ></FontAwesomeIcon>
//           </td>

//           <td className="tableSingleKeyEditCalls">
//             {call.start?.toFixed(3)}
//           </td>
//           <td className="tableSingleKeyEditCalls">
//             {call.end?.toFixed(3)}
//           </td>
//           <td className="tableSingleKeyEditCalls">
//             <img
//               onMouseEnter={() => {
//                 setTimeout(() => {
//                   setImageToShow(call.spectrogram);
//                 }, 300);
//               }}
//               onMouseOut={() => {
//                 setImageToShow(logoFF);
//               }}
//               width="100px"
//               src={call?.spectrogram}
//               alt="spectrogramfrom region"
//             />
//           </td>

//           <td className="tableSingleKeyEditCalls commentKey">
//             {call.id}
//           </td>
//           <td
//             key={call.id}
//             className=" tableSingleKeyEditCalls dropdownKey"
//           >
//             <select
//               className="dropdownKey"
//               onChange={(event) =>
//                 labelNewCall(event.target.value, call.id)
//               }
//             >
//               <option value="Female">Female</option>
//               <option value="Male">Male</option>
//             </select>
//           </td>

//           <td className="lastCell tableSingleKeyEditCalls">
//             <textarea
//               className="textareacommentsInput"
//               // onSelect={() => saveCommentNewCall(call?.id)}
//               key={call.id}
//               type="textarea"
//               name="comment"
//               onChange={(event) =>
//                 saveCommentNewCall(event, call?.id)
//               }
//               id={index + call.id}
//               defaultValue={call.comments}
//               placeholder="Add comment..."
//               cols="30"
//               rows="30"
//             ></textarea>
//             {/* </form> */}
//           </td>
//         </tr>
//       </tbody>
//     ))}
//   </>
// </Table>
//       </div>

//       {imageToShow === logoFF ? (
//         <div className="spectrogramImageContainer">
//           <img
//             className="spectrogramImage fade-in"
//             src={logoFF}
//             alt="Spectrogram "
//           />
//         </div>
//       ) : (
//         <div className="spectrogramImageContainer">
//           <img
//             className=" spectrogramImageFull fade-in"
//             src={imageToShow}
//             alt="Spectrogram"
//           />
//         </div>
//       )}
//     </Container>
//   );
// }
export default function TableNewCalls() {
  const selections = useSelector((state) => state.spectrogram.selections);
  const dispatch = useDispatch();

  return (
    <div>
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
          {selections?.map((call, index) => (
            // RowNewCalls(call, index)
            <tbody key={index}>
              <tr
                key={call.id}
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
                    alt="spectrogramfrom region"
                  /> */}
                </td>

                <td className="tableSingleKeyEditCalls commentKey">
                  {call.id}
                </td>
                <td
                  key={call.id}
                  className=" tableSingleKeyEditCalls dropdownKey"
                >
                  <select
                    className="dropdownKey"
                    // onChange={(event) =>
                    //   labelNewCall(event.target.value, call.id)
                    // }
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
                    // onChange={(event) => saveCommentNewCall(event, call?.id)}
                    id={index + call.id}
                    defaultValue={call.comments}
                    placeholder="Add comment..."
                    cols="30"
                    rows="30"
                  ></textarea>
                </td>
              </tr>
            </tbody>
          ))}
        </>
      </Table>
    </div>
  );
}

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logoFF from "../images/logo-reduced.png";
import { Container, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { spectrogramActions } from "../redux/actions";

export default function RowNewCalls(props) {
  const { index, call } = props;
  console.log(call);

  return (
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

        <td className="tableSingleKeyEditCalls">{call.start?.toFixed(3)}</td>
        <td className="tableSingleKeyEditCalls">{call.end?.toFixed(3)}</td>
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

        <td className="tableSingleKeyEditCalls commentKey">{call.id}</td>
        <td key={call.id} className=" tableSingleKeyEditCalls dropdownKey">
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
  );
}

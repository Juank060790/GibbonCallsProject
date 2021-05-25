import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table } from "react-bootstrap";

export default function TableNewCalls(regionsArray) {
  const arrayForRegions = regionsArray?.regionsArray;

  return (
    <div className="tableNewCall">
      {" "}
      <h4>Create a new Call</h4>
      {arrayForRegions ? (
        <Table responsive>
          <thead className="text-center tableSaveRegionHeader">
            <tr>
              <th className="idNumberModal">Id N&deg;</th>
              <th>Time Start</th>
              <th>Time End</th>
              <th>Spectogram</th>
              <th>Action</th>
              <th>Gender</th>
              <th>Delete</th>

              <th className="text-center"></th>
            </tr>
          </thead>
          <>
            {arrayForRegions?.map((call, index) => (
              <tbody key={index}>
                <tr className="text-center tableKey">
                  <td className="tableSingleKey">
                    {call.singleRegion?.callId}
                  </td>
                  <td className="tableSingleKey">
                    {call.singleRegion.timeStart}
                  </td>
                  <td className="tableSingleKey">
                    {call.singleRegion.timeEnd}
                  </td>
                  <td className="tableSingleKey">
                    <img
                      width="100px"
                      src={call.singleRegion?.spectogram}
                      alt="spectogramfrom region"
                    />
                  </td>

                  <td className="tableSingleKey commentKey">Save</td>
                  <td className="tableSingleKey ">
                    {" "}
                    {call.singleRegion?.label}
                  </td>

                  <td className="lastCell tableSingleKey">
                    {" "}
                    <FontAwesomeIcon
                      className="btndeleteAudio"
                      icon={["fas", "times"]}
                      // size="1x"
                      color="#b94242"
                      //   onClick={() => deleteCall(call?.callId)}
                    ></FontAwesomeIcon>{" "}
                  </td>
                </tr>
              </tbody>
            ))}
          </>
        </Table>
      ) : (
        <div> There is no selected region</div>
      )}
    </div>
  );
}

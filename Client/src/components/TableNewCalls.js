import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown, Table } from "react-bootstrap";

export default function TableNewCalls(regionsArray) {
  const arrayForRegions = regionsArray?.regionsArray;
  console.log(`arrayForRegions`, arrayForRegions);
  // const [arrayNewRegions, setArrayNewRegions] = useState();

  // useEffect(() => {
  //   console.log(`arrayNewRegions`, arrayNewRegions);
  // }, [arrayNewRegions]);
  // // Delete call from the new list //

  // const deleteCall = (index) => {
  //   arrayNewRegions.splice(index, 1);
  //   setArrayNewRegions(arrayNewRegions);
  // };

  return (
    <div className="tableNewCall">
      <h4>Create a new Call</h4>
      {arrayForRegions ? (
        <Table responsive>
          <thead className="text-center tableSaveRegionHeader">
            <tr>
              <th className="idNumberModal">N&deg;</th>
              <th>Time Start</th>
              <th>Time End</th>
              {/* <th>Spectogram</th> */}
              <th>Action</th>
              <th>Label</th>
              <th>Delete</th>

              <th className="text-center"></th>
            </tr>
          </thead>
          <>
            {arrayForRegions?.map((call, index) => (
              <tbody key={index}>
                <tr className="text-center tableKey">
                  <td className="tableSingleKey">{index + 1}</td>
                  <td className="tableSingleKey">
                    {call.singleRegion.start?.toFixed(3)}
                  </td>
                  <td className="tableSingleKey">
                    {call.singleRegion.end?.toFixed(3)}
                  </td>
                  {/* <td className="tableSingleKey">
                    <img
                      width="100px"
                      src={call.singleRegion?.spectogram}
                      alt="spectogramfrom region"
                    />
                  </td> */}

                  <td className="tableSingleKey commentKey">
                    (To be added){call.singleRegion.callId}
                  </td>
                  <td className="tableSingleKey ">
                    <Dropdown>
                      <Dropdown.Toggle
                        className="dropdownBtn"
                        variant="success"
                        id="dropdown-basic"
                      >
                        <FontAwesomeIcon
                          icon={["fas", "venus-mars"]}
                        ></FontAwesomeIcon>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-2">Female</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">Male</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>

                  <td className="lastCell tableSingleKey">
                    {" "}
                    <FontAwesomeIcon
                      className="btndeleteAudio"
                      icon={["fas", "times"]}
                      // size="1x"
                      color="#b94242"
                      // onClick={() => deleteCall(index)}
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

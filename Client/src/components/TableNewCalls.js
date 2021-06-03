import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown, Table } from "react-bootstrap";

export default function TableNewCalls({
  regionsArray,
  labelNewCall,
  labelColor,
}) {
  const arrayForRegions = regionsArray;

  return (
    <div className="tableNewCall">
      <h4>Create or Edit Call</h4>
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
              <th>(To be checked)</th>

              <th className="text-center"></th>
            </tr>
          </thead>
          <>
            {arrayForRegions?.map((call, index) => (
              <tbody key={index}>
                <tr
                  style={{ backgroundColor: call.singleRegion.color }}
                  className="text-center tableKey"
                >
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
                    (ID){call.singleRegion.callId}
                  </td>
                  <td
                    style={{ backgroundColor: labelColor }}
                    className="tableSingleKey"
                  >
                    <Dropdown
                      className="dropdownUp"
                      drop="left"
                      id="dropdown-button-drop-left"
                    >
                      <Dropdown.Toggle
                        className="dropdownBtn"
                        variant="success"
                      >
                        <FontAwesomeIcon
                          icon={["fas", "venus-mars"]}
                        ></FontAwesomeIcon>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onSelect={() => labelNewCall("Female")}>
                          Female
                        </Dropdown.Item>
                        <Dropdown.Item onSelect={() => labelNewCall("Male")}>
                          Male
                        </Dropdown.Item>
                        <Dropdown.Item onSelect={() => labelNewCall("Other")}>
                          Other
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>

                  <td className="lastCell tableSingleKey">Not sure yet </td>
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

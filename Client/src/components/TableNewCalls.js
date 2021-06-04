import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown, Table } from "react-bootstrap";

export default function TableNewCalls({
  regionsArray,
  labelNewCall,
  labelColor,
  labelForNewCall,
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
                  <td className="tableSingleKeyEditCalls">{index + 1}</td>
                  <td className="tableSingleKeyEditCalls">
                    {call.singleRegion.start?.toFixed(3)}
                  </td>
                  <td className="tableSingleKeyEditCalls">
                    {call.singleRegion.end?.toFixed(3)}
                  </td>
                  {/* <td className="tableSingleKeyEditCalls">
                    <img
                      width="100px"
                      src={call.singleRegion?.spectogram}
                      alt="spectogramfrom region"
                    />
                  </td> */}

                  <td className="tableSingleKeyEditCalls commentKey">
                    (ID){call.singleRegion.callId}
                  </td>
                  <td
                    style={{ backgroundColor: labelColor }}
                    className="tableSingleKeyEditCalls dropdownKey"
                  >
                    <p className="text-align-center m-2 labelText">
                      {" "}
                      {labelForNewCall}
                    </p>
                    <div>
                      <Dropdown
                        className="dropdownUp"
                        drop="right"
                        id="dropdown-button-drop-right"
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
                          <Dropdown.Item
                            onSelect={() => labelNewCall("Female")}
                          >
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
                    </div>
                  </td>

                  <td className="lastCell tableSingleKeyEditCalls">
                    Not sure yet{" "}
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

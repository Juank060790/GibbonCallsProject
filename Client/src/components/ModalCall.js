import React from "react";
import { Modal, Table } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function ModalCall({ selectedAudio, handleClose, showModal }) {
  const calls = useSelector((state) => state.call.call);

  // const showModal = show;

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      size={"xl"}
      dialogClassName="modal-100w"
      centered={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>{selectedAudio?.audioId}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {" "}
        <Table responsive>
          <thead className="text-center tableHeader">
            <tr>
              <th>Id N&deg;</th>
              <th>Time Start</th>
              <th>Time End</th>
              <th>Spectogram</th>
              <th>Action</th>
              <th>Tags</th>
              <th>Comments</th>
            </tr>
          </thead>
          <>
            <tbody>
              {calls?.map((call, index) => (
                <tr className="text-center tableKey" key={index}>
                  <td className="tableSingleKey">{call.callId}</td>
                  <td className="tableSingleKey">{call.timeStart}</td>
                  <td className="tableSingleKey">{call.timeStart}</td>
                  <td className="tableSingleKey">Img</td>
                  <td className="tableSingleKey">Action</td>
                  <td className="tableSingleKey">{call.label}</td>
                  <td className="tableSingleKey commentKey">
                    <form>
                      <textarea className="textareacomments"></textarea>
                      <input className="submitcommentbtn " type="submit" />
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </>
        </Table>
      </Modal.Body>
    </Modal>
  );
}

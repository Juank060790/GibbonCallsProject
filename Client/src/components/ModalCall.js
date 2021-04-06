import React from "react";
import { Modal, Table } from "react-bootstrap";

export default function ModalCall({
  selectedAudio,
  callsperAudio,
  handleClose,
  showModal,
}) {
  // const showModal = show;
  console.log("SELECTEDMODAL", callsperAudio);

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
              <th>Time Stamp</th>
              <th>Spectogram</th>
              <th>Action</th>
              <th>Tags</th>
              <th>Comments</th>
            </tr>
          </thead>
          <>
            <tbody>
              <tr className="text-center tableKey">
                <td className="tableSingleKey"></td>
                <td className="tableSingleKey"></td>
                <td className="tableSingleKey">IMG</td>
                <td className="tableSingleKey">Action</td>
                <td className="tableSingleKey"></td>
                <td className="tableSingleKey commentKey">
                  <form>
                    <textarea className="textareacomments"></textarea>
                    <input className="submitcommentbtn " type="submit" />
                  </form>
                </td>
              </tr>
            </tbody>

            <tbody></tbody>
          </>
        </Table>
      </Modal.Body>
    </Modal>
  );
}

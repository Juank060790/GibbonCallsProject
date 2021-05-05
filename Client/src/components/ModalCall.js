import React, { useEffect } from "react";
import { Modal, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import MediaPlayer from "./MediaPlayer";

export default function ModalCall({
  selectedAudio,
  handleClose,
  showModal,
  spectogramImage,
  spectogramAudio,
  showSpectrogram,
}) {
  const calls = useSelector((state) => state.call.call);

  useEffect(() => {}, []);

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      size={"xl"}
      dialogClassName="modal-100w"
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        {" "}
        <MediaPlayer
          spectogramAudio={spectogramAudio}
          spectogramImage={spectogramImage}
        />
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
                  <td className="tableSingleKey">{call.timeEnd}</td>
                  <td
                    onClick={() =>
                      showSpectrogram(call.spectogram, call.spectogramAudio)
                    }
                    className="tableSingleKey"
                  >
                    <img
                      src={call.spectogram}
                      alt="spectogram of a single call"
                      width="150px"
                      height="100px"
                    />
                  </td>
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

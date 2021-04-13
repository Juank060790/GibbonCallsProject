import React, { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import MediaPlayer from "./MediaPlayer";

export default function ModalCall({
  selectedAudio,
  handleClose,
  showModal,
  spectogramImage,
  showSpectrogram,
}) {
  const calls = useSelector((state) => state.call.call);
  // const [spectogramImage, setSpectogramImage] = useState("");

  // const showSpectrogram = (spectogram, showModal) => {
  //   if (spectogram) {
  //     setSpectogramImage(spectogram);
  //     console.log("NOTFOUND IMAGE", spectogramImage);
  //   }
  // };

  // const clearSpectogram = () => {
  //   if (showModal == false) {
  //     console.log("HIDEEEE");
  //     setSpectogramImage("");
  //   }
  // };
  useEffect(() => {
    console.log("Middle rendered", spectogramImage);
  }, [spectogramImage]);

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
        <MediaPlayer
          selectedAudio={selectedAudio}
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
                    onClick={() => showSpectrogram(call.spectogram)}
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

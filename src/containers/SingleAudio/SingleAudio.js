import React, { useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { audioActions, callActions } from "../../redux/actions";
import { useParams } from "react-router-dom";

export default function SingleAudio() {
  const loading = useSelector((state) => state.audio.loading);
  const audio = useSelector((state) => state.audio.selectedAudio);
  const call = useSelector((state) => state.call);
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();
  const callsIds = audio?.gibbonCallsIds;
  const handleGoBackClick = (e) => {
    history.goBack();
  };

  console.log("CALLS LIST", call);

  const getCalls = (callsIds) => {
    callsIds?.forEach((call) => {
      console.log("CALLS MAP", call);
      dispatch(callActions.getSingleCall(call));
    });
  };

  useEffect(() => {
    getCalls(callsIds);
  }, [dispatch]);

  useEffect(() => {
    if (params?.id) {
      dispatch(audioActions.getSingleAudio(params.id));
    }
  }, [dispatch, params]);

  return (
    <>
      <div>
        <Button onClick={handleGoBackClick}>Back</Button>
      </div>
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
          {call.length ? (
            <tbody>
              {call.map((call, index) => (
                <tr className="text-center tableKey">
                  <td className="tableSingleKey">{audio.audioId}</td>
                  <td className="tableSingleKey">{call?.timeStart}</td>
                  <td className="tableSingleKey">IMG</td>
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
          ) : (
            <tbody>
              <p>No AudioS </p>
            </tbody>
          )}
        </>
      </Table>
    </>
  );
}

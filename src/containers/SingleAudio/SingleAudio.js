import React, { useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { audioActions } from "../../redux/actions";
import { useParams } from "react-router-dom";

export default function SingleAudio() {
  const loading = useSelector((state) => state.audio.loading);
  const audio = useSelector((state) => state.audio.selectedAudio);
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();

  console.log("SINGLE AUDIO PAGE", audio);
  const handleGoBackClick = (e) => {
    history.goBack();
  };

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
          <tbody>
            <tr className="text-center tableKey">
              <td className="tableSingleKey">#</td>
              <td className="tableSingleKey">#</td>
              <td className="tableSingleKey">#</td>
              <td className="tableSingleKey">#</td>
              <td className="tableSingleKey">#</td>
              <td className="tableSingleKey commentKey">
                <form>
                  <textarea className="textareacomments"></textarea>
                  <input className="submitcommentbtn " type="submit" />
                </form>
              </td>
            </tr>
          </tbody>
        </>
      </Table>
    </>
  );
}

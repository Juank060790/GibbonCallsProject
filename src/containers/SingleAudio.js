import React from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

export default function SingleAudio() {
  const loading = useSelector((state) => state.audio.loading);
  const audio = useSelector((state) => state.audio.selectedAudio);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleGoBackClick = (e) => {
    history.goBack();
  };
  return (
    <div>
      <Button onClick={handleGoBackClick}>Back</Button>
    </div>
  );
}

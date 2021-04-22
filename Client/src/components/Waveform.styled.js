import styled from "styled-components";

export const WaveformContianer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: transparent;
`;

export const Wave = styled.div`
  width: 100%;
  height: 100%;
`;

export const PlayButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  background: #d7ebd6;
  border-radius: 10%;
  border: none;
  outline: none;
  cursor: pointer;
  padding-bottom: 3px;
  &:hover {
    background: #ddd;
  }
`;
export const wavespectrogram = styled.div`
  width: 100%;
`;

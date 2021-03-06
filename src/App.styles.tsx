import { Button, Paper } from "@material-ui/core";
import styled from "styled-components";

interface GenericProps {
  $isVisible: boolean;
}

interface AnswerProps {
  $isVisible: boolean;
  isCorrect: boolean;
  disabled: boolean;
}

export const AppContainer = styled.div`
  width: 100%;
  height: 90vh;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  background-color: #afb0b1;
`;

export const AppTitle = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const ControlsCard = styled(Paper)`
  padding: 1em;
  margin-top: 3em;
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

export const TopButtonsContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-evenly;
  margin-bottom: 1em;
`;

export const SliderContainer = styled.div`
  margin: 0 0 1em 0;
`;

export const RowContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1em;
`;

export const RangeInput = styled.input`
  width: 2.5em;
  margin: 0.5em;
  font-size: large;
`;

export const Sequence = styled.h2<GenericProps>`
  visibility: ${({ $isVisible: visible }) => getVisibility(visible)};
`;

export const SequenceContainer = styled.div`
  display: flex;
  flex: 3;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
`;

export const AnswerContainer = styled.input<AnswerProps>`
  height: 2em;
  width: 2em;
  margin: 1em;
  visibility: ${({ $isVisible: visible }) => getVisibility(visible)};
  border: ${({ isCorrect, disabled }) => getBorder(isCorrect, disabled)};
  box-sizing: border-box;
  font-size: large;

  &:disabled {
    color: white;
  }

  &::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const TimeLeft = styled.h2<GenericProps>`
  visibility: ${({ $isVisible: visible }) => getVisibility(visible)};
`;

export const RevealButton = styled(Button)<GenericProps>`
  visibility: ${({ $isVisible: visible }) => getVisibility(visible)};
`;

export const StatsCard = styled(Paper)`
  padding: 1em;
  margin: 1em;
`;

const getVisibility = (isVisible: boolean): string =>
  isVisible ? "visible" : "hidden";

const getBorder = (isCorrect: boolean, isRevealed: boolean): string => {
  if (!isRevealed) return "none";
  return isCorrect ? "2px solid green" : "2px solid red";
};

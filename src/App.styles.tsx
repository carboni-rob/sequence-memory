import { Button, Slider } from "@material-ui/core";
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
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #001529;
`;

export const ControlsContainer = styled.div`
  margin: 1em 0;
  width: 100%;
  max-width: 22em;
  display: flex;
  flex-direction: column;
  justify-content: center;
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

export const RangeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const RangeInput = styled.input`
  width: 2.5em;
  margin: 0.5em;
  font-size: large;
`;

export const Sequence = styled.h2<GenericProps>`
  visibility: ${({ $isVisible: visible }) => getVisibility(visible)};
`;

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 2em;
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

const getVisibility = (isVisible: boolean): string =>
  isVisible ? "visible" : "hidden";

const getBorder = (isCorrect: boolean, isRevealed: boolean): string => {
  if (!isRevealed) return "none";
  return isCorrect ? "2px solid green" : "2px solid red";
};

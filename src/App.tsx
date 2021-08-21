import { Button, Slider, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import {
  AnswerContainer,
  AppContainer,
  ControlsContainer,
  InnerContainer,
  MainTitle,
  RangeContainer,
  RangeInput,
  RevealButton,
  Sequence,
  SliderContainer,
} from "./App.styles";

function App() {
  const [memoryTime, setMemoryTime] = useState(5);
  const [sequence, setSequence] = useState<number[]>([0]);
  const [sequenceLength, setSequenceLength] = useState(6);
  const [range, setRange] = useState("9");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSequenceVisible, setSequenceVisible] = useState(false);
  const [isAnswerVisible, setAnswerVisible] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [answer, setAnswer] = useState<(string | null)[]>([]);

  useEffect(() => {
    if (!timeLeft) {
      if (gameStarted) {
        setSequenceVisible(false);
        setAnswerVisible(true);
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, sequence]);

  const generateSequence = () => {
    const newSequence: number[] = [];
    for (let i = 1; i <= sequenceLength; i++) {
      newSequence.push(Math.floor(Math.random() * parseInt(range)));
    }

    setAnswer(new Array(sequenceLength).fill(""));
    setSequence(newSequence);
    setTimeLeft(memoryTime);
    setSequenceVisible(true);
    setAnswerVisible(false);
    setGameStarted(true);
  };

  const handleAnswer = (index: number, value: string) => {
    const newAnswer = [...answer];
    newAnswer[index] = value;
    setAnswer(newAnswer);
  };

  const checkCorrectedness = (index: number): boolean =>
    sequence[index]?.toString() === answer[index];

  const renderAnswerInputs = () => {
    return (
      <div>
        {answer.map((_, index) => (
          <AnswerContainer
            key={index}
            value={answer[index] as string}
            disabled={isSequenceVisible}
            $isVisible={isAnswerVisible}
            type="number"
            onChange={(event) => handleAnswer(index, event.target.value)}
            isCorrect={checkCorrectedness(index)}
            isRevealed={isSequenceVisible}
          />
        ))}
      </div>
    );
  };

  const revealAnswer = () => {
    setSequenceVisible(true);
  };

  return (
    <AppContainer>
      <InnerContainer>
        <MainTitle>SEQUENCE MEMORY v.2</MainTitle>

        <ControlsContainer>
          <SliderContainer>
            <Slider
              value={sequenceLength}
              aria-labelledby="length-selector"
              step={1}
              min={1}
              max={14}
              valueLabelDisplay="auto"
              onChange={(_, value) => setSequenceLength(value as number)}
            />
            <Typography id="length-selector" gutterBottom>
              Sequence Length: {sequenceLength} numbers
            </Typography>
          </SliderContainer>

          <SliderContainer>
            <Slider
              value={memoryTime}
              aria-labelledby="time-selector"
              step={5}
              min={5}
              max={60}
              valueLabelDisplay="auto"
              onChange={(_, value) => setMemoryTime(value as number)}
            />
            <Typography id="time-selector" gutterBottom>
              Memorisation Time: {memoryTime} secs
            </Typography>
          </SliderContainer>

          <RangeContainer>
            <span>Numbers range: 0 to </span>
            <RangeInput
              type="number"
              value={range}
              onChange={(event) => setRange(event.target.value)}
            />
          </RangeContainer>
        </ControlsContainer>

        <Button variant="contained" onClick={generateSequence}>
          Generate Sequence
        </Button>

        <Sequence $isVisible={isSequenceVisible}>
          {sequence.join(" - ")}
        </Sequence>

        {renderAnswerInputs()}

        <h2>Time remaining: {timeLeft}</h2>

        <RevealButton
          variant="contained"
          onClick={revealAnswer}
          $isVisible={!isSequenceVisible && gameStarted}
        >
          Reveal Answer
        </RevealButton>
      </InnerContainer>
    </AppContainer>
  );
}

export default App;

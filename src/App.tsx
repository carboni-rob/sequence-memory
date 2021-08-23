import { Button, Slider, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import {
  AnswerContainer,
  AppContainer,
  ControlsContainer,
  InnerContainer,
  RangeContainer,
  RangeInput,
  RevealButton,
  Sequence,
  SliderContainer,
  TimeLeft,
  TopButtonsContainer,
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
  const [isAnswerDisabled, setAnswerDisabled] = useState(false);
  const [speakSequence, setSpeakSequence] = useState(false);
  const [displaySequence, setDisplaySequence] = useState(true);
  const [utteranceSpeed, setUtteranceSpeed] = useState(1);

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
  }, [timeLeft, sequence, gameStarted]);

  const generateSequence = () => {
    const newSequence: number[] = [];
    for (let i = 1; i <= sequenceLength; i++) {
      newSequence.push(Math.floor(Math.random() * parseInt(range)));
    }

    setAnswer(new Array(sequenceLength).fill(""));
    setSequence(newSequence);
    setTimeLeft(memoryTime);
    setSequenceVisible(displaySequence ? true : false);
    setAnswerVisible(false);
    setGameStarted(true);
    setAnswerDisabled(false);

    if (speakSequence) {
      const voices = window.speechSynthesis.getVoices();
      const utterance = new SpeechSynthesisUtterance(newSequence.join(", "));
      utterance.rate = utteranceSpeed;
      utterance.voice =
        voices.find((voice) => voice.lang === "en-US") || voices[0];
      utterance.onend = () => {
        if (!displaySequence) {
          setAnswerVisible(true);
        }
      };
      speechSynthesis.speak(utterance);
    }
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
            disabled={isAnswerDisabled}
            $isVisible={isAnswerVisible}
            type="number"
            onChange={(event) => handleAnswer(index, event.target.value)}
            isCorrect={checkCorrectedness(index)}
          />
        ))}
      </div>
    );
  };

  const revealAnswer = () => {
    setSequenceVisible(true);
    setAnswerDisabled(true);
  };

  return (
    <AppContainer>
      <InnerContainer>
        <h1>SEQUENCE MEMORY v.2</h1>

        <ControlsContainer>
          <TopButtonsContainer>
            <Button
              variant={displaySequence ? "contained" : "outlined"}
              color="primary"
              onClick={() => setDisplaySequence(!displaySequence)}
            >
              Display
            </Button>
            <Button
              variant={speakSequence ? "contained" : "outlined"}
              color="secondary"
              onClick={() => setSpeakSequence(!speakSequence)}
            >
              Speak
            </Button>
          </TopButtonsContainer>

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

          <SliderContainer>
            <Slider
              value={utteranceSpeed}
              aria-labelledby="speed-selector"
              step={0.1}
              min={0.1}
              max={3}
              valueLabelDisplay="auto"
              onChange={(_, value) => setUtteranceSpeed(value as number)}
            />
            <Typography id="speed-selector" gutterBottom>
              Voice speed: {utteranceSpeed}
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

        <Button
          variant="contained"
          onClick={generateSequence}
          disabled={!speakSequence && !displaySequence}
        >
          Generate Sequence
        </Button>

        <Sequence $isVisible={isSequenceVisible}>
          {sequence.join(" - ")}
        </Sequence>

        {renderAnswerInputs()}

        <TimeLeft $isVisible={displaySequence}>
          Time remaining: {timeLeft}
        </TimeLeft>

        <RevealButton
          variant="contained"
          onClick={revealAnswer}
          $isVisible={true}
        >
          Reveal Answer
        </RevealButton>
      </InnerContainer>
    </AppContainer>
  );
}

export default App;

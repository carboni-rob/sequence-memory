import {
  AppBar,
  Button,
  FormControlLabel,
  Slider,
  Switch,
  Typography,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import {
  AnswerContainer,
  AppContainer,
  ControlsContainer,
  InnerContainer,
  RowContainer,
  RangeInput,
  RevealButton,
  Sequence,
  SliderContainer,
  TimeLeft,
  TopButtonsContainer,
  AppToolbar,
} from "./App.styles";

interface Run {
  total: number;
  correct: number;
}

function App() {
  const [memoryTime, setMemoryTime] = useState(5);
  const [sequence, setSequence] = useState<number[]>([0]);
  const [sequenceLength, setSequenceLength] = useState(6);
  const [range, setRange] = useState("9");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSequenceVisible, setSequenceVisible] = useState(false);
  const [isAnswerVisible, setAnswerVisible] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [isAnswerDisabled, setAnswerDisabled] = useState(false);
  const [speakSequence, setSpeakSequence] = useState(false);
  const [displaySequence, setDisplaySequence] = useState(true);
  const [utteranceSpeed, setUtteranceSpeed] = useState(1);
  const [backwards, setBackwards] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isRevealDisabled, setRevealDisabled] = useState(true);
  const [stats, setStats] = useState<Run[]>([]);

  useEffect(() => {
    const savedStats = localStorage.getItem("stats");
    const usageStats: Run[] = savedStats ? JSON.parse(savedStats) : [];
    setStats(usageStats);
  }, []);

  useEffect(() => {
    if (!timeLeft) {
      if (gameStarted) {
        setSequenceVisible(false);
        setAnswerVisible(true);
        setRevealDisabled(false);
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

    setAnswers(new Array(sequenceLength).fill(""));
    setSequence(newSequence);
    setTimeLeft(memoryTime);
    setSequenceVisible(displaySequence ? true : false);
    setAnswerVisible(false);
    setGameStarted(true);
    setAnswerDisabled(false);
    setCorrectAnswers(0);

    if (speakSequence) {
      const voices = window.speechSynthesis.getVoices();
      const utterance = new SpeechSynthesisUtterance(newSequence.join(", "));
      utterance.rate = utteranceSpeed;
      utterance.voice =
        voices.find((voice) => voice.lang === "en-US") || voices[0];
      utterance.onend = () => {
        if (!displaySequence) {
          setAnswerVisible(true);
          setRevealDisabled(false);
        }
      };
      speechSynthesis.speak(utterance);
    }
  };

  const handleAnswer = (index: number, value: string) => {
    const newAnswer = [...answers];
    newAnswer[index] = value;
    setAnswers(newAnswer);
  };

  const countCorrectAnswers = () => {
    const correctArray = backwards ? [...sequence].reverse() : sequence;
    const answerArray = answers.map((answer) => parseInt(answer as string));
    const correctAnswersArray = answerArray.length
      ? answerArray.filter((answer, index) => correctArray[index] === answer)
      : [];

    return correctAnswersArray.length;
  };

  const checkCorrectedness = (index: number): boolean => {
    const correctArray = backwards ? [...sequence].reverse() : sequence;

    return correctArray[index]?.toString() === answers[index];
  };

  const renderAnswerInputs = () => {
    return (
      <div>
        {answers.map((_, index) => (
          <AnswerContainer
            key={index}
            value={answers[index] as string}
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

  const saveStats = (value: Run[]) => {
    localStorage.setItem("stats", JSON.stringify(value));
  };

  const revealAnswer = () => {
    setRevealDisabled(true);
    setSequenceVisible(true);
    setAnswerDisabled(true);
    const correctAnswers = countCorrectAnswers();
    setCorrectAnswers(correctAnswers);

    stats.push({
      total: sequence.length,
      correct: correctAnswers,
    });

    saveStats(stats);
  };

  const resetStats = () => {
    const conf = window.confirm(
      "Do you really want to reset your usage statistics?"
    );
    if (conf) {
      setStats([]);
      saveStats([]);
    }
  };

  const isBackwardsSwitchDisabled = (): boolean => {
    if (!gameStarted) return false;
    return timeLeft !== 0 || !isAnswerDisabled;
  };

  const correctCount = stats.length
    ? stats
        .map((run) => run.correct)
        .reduce((acc: number, correctAnswers: number) => acc + correctAnswers)
    : 0;

  const totalCount = stats.length
    ? stats
        .map((run) => run.total)
        .reduce((acc: number, totalAnswers: number) => acc + totalAnswers)
    : 0;

  const percentage = totalCount
    ? ((correctCount * 100) / totalCount).toFixed(2)
    : 0;

  return (
    <AppContainer>
      <AppBar position="fixed">
        <AppToolbar>
          <Typography variant="h4">SEQUENCE MEMORY v.2</Typography>
          <Typography variant="h6">
            You have answered correctly {correctCount} times out of {totalCount}{" "}
            in {stats.length} runs ({percentage}%)
          </Typography>
          <Button variant="contained" onClick={resetStats}>
            Reset
          </Button>
        </AppToolbar>
      </AppBar>

      <InnerContainer>
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

          <RowContainer>
            <span>Numbers range: 0 to </span>
            <RangeInput
              type="number"
              value={range}
              onChange={(event) => setRange(event.target.value)}
            />
          </RowContainer>

          <RowContainer>
            <FormControlLabel
              value={backwards}
              onChange={(_, checked) => setBackwards(checked)}
              disabled={isBackwardsSwitchDisabled()}
              control={<Switch color="secondary" />}
              label="Answer backwards"
              labelPlacement="start"
            />
          </RowContainer>
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
          disabled={isRevealDisabled}
        >
          Reveal Answer
        </RevealButton>
        <h2>
          ({correctAnswers} out of {sequence.length})
        </h2>
      </InnerContainer>
    </AppContainer>
  );
}

export default App;

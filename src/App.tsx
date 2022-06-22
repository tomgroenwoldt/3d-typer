import { useState, useEffect } from 'react';
import { TextField } from "@mui/material";
import "./App.css";

type Message = {
  room: string,
  username: string,
  position: number,
};

const message: Message = {
  room: "lobby",
  username: "username",
  position: 0,
};

async function send() {
  await fetch("http://tomgroenwoldt.de:8000/message", {
    method: "POST",
    body: JSON.stringify(message),
  });
}

function App() {

  const [sampleText, setSampleText] = useState(
    "You clearly don't know who you're talking to, so let me clue you in."); // I am not in danger, Skyler. I am the danger. A guy opens his door and gets shot and you think that of me? No. I am the one who knocks!";
  const [currentWord, setCurrentWord] = useState("");
  const [spaceAsNextWord, setSpaceAsNextWord] = useState(true);

  useEffect(() => {
    init();
  }, []);

  function init() {
    setCurrentWord(sampleText.split(" ")[0]);
    setSampleText(sampleText.split(" ").slice(1).join(" "));
  }

  function setWord() {
    if (spaceAsNextWord) {
      setCurrentWord(" ");
      setSpaceAsNextWord(false);
      if (sampleText.length === 0) {
        setCurrentWord("THE_END");
      }
    } else {
      setCurrentWord(sampleText.split(" ")[0]);
      setSampleText(sampleText.split(" ").slice(1).join(" "));
      setSpaceAsNextWord(true);
    }
  }

  function validate(e: { target: { value: string } }) {
    if (currentWord !== "THE_END") {
      validateWord(e);
    }
  }

  function validateWord(e: { target: { value: string } }) {
    if (e.target.value === currentWord) {
      message.position += currentWord.length;
      send();
      setWord();
      e.target.value = "";
    }
  }


  return (
    <div className="App">
      <header className="App-header">
        <div className="text">{currentWord + " " + sampleText}</div>
        <TextField onChange={validate} label="type here" />
      </header>
    </div>
  );
}

export default App;

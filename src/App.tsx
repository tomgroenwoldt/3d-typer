import React from "react";
import { TextField } from "@mui/material";
import "./App.css";

let sampleText =
  "You clearly don't know who you're talking to, so let me clue you in."; // I am not in danger, Skyler. I am the danger. A guy opens his door and gets shot and you think that of me? No. I am the one who knocks!";

// initialization phase
let currentWord = sampleText.split(" ")[0];
let spaceAsNextWord = true;
sampleText = sampleText.split(" ").slice(1).join(" ");

const message = {
  lobby: "lobby",
  username: "guest",
  position: 0,
};

// TODO: add case for end of text
function setCurrectWord() {
  if (spaceAsNextWord) {
    currentWord = " ";
    spaceAsNextWord = false;
    if (sampleText.length === 0) {
      currentWord = "THE_END";
    }
  } else {
    currentWord = sampleText.split(" ")[0];
    sampleText = sampleText.split(" ").slice(1).join(" ");
    spaceAsNextWord = true;
  }
}

function validate(e: { target: { value: string } }) {
  if (currentWord !== "THE_END") {
    validateWord(e);
    console.log(currentWord);
    send();
  }
}

function validateWord(e: { target: { value: string } }) {
  if (e.target.value === currentWord) {
    message.position += currentWord.length;
    setCurrectWord();
    e.target.value = "";
  }
}

function send() {
  fetch("http://localhost:8000/message", {
    method: "POST",
    body: new URLSearchParams({
      room: message.lobby,
      username: message.username,
      position: message.position.toString(),
    }),
  });
}

function App() {
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

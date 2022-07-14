import { useState, useEffect } from "react";
import {
	Container,
	createTheme,
	CssBaseline,
	TextField,
	ThemeProvider,
} from "@mui/material";
import { authenticate } from "../auth";
import Login from "./login";
import Logout from "./logout";
import { Box } from "@mui/system";

const theme = createTheme();

type Message = {
	room: string;
	username: string;
	position: number;
};

const message: Message = {
	room: "lobby",
	username: "username",
	position: 0,
};

async function send() {
	await fetch("https://" + process.env.REACT_APP_HOST + ":8000/message", {
		method: "POST",
		body: JSON.stringify(message),
	});
}

export default function Play(): JSX.Element {
	const [isAuthenticated, setAuthentication] = useState(false);
	const [sampleText, setSampleText] = useState(
		"You clearly don't know who you're talking to, so let me clue you in."
	); // I am not in danger, Skyler. I am the danger. A guy opens his door and gets shot and you think that of me? No. I am the one who knocks!";
	const [currentWord, setCurrentWord] = useState("");
	const [spaceAsNextWord, setSpaceAsNextWord] = useState(true);

	useEffect(() => {
		init_playground();
		authenticate(setAuthentication);
	}, []);

	async function init_playground(): Promise<void> {
		setCurrentWord(sampleText.split(" ")[0]);
		setSampleText(sampleText.split(" ").slice(1).join(" "));
	}

	function setWord(): void {
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

	function validate(e: { target: { value: string } }): void {
		if (currentWord !== "THE_END") {
			validateWord(e);
		}
	}

	function validateWord(e: { target: { value: string } }): void {
		if (e.target.value === currentWord) {
			message.position += currentWord.length;
			send();
			setWord();
			e.target.value = "";
		}
	}

	if (window.location.href.includes("www.")) {
		window.location.href = window.location.href.replace("www.", "");
	}
	if (!isAuthenticated) {
		return <Login setAuthentication={setAuthentication} />;
	}
	return (
		<ThemeProvider theme={theme}>
			<Container
				component="main"
				maxWidth="sm"
				sx={{
					marginTop: 8,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}>
				<CssBaseline />
				<Box
					sx={{
						fontSize: 35,
					}}>
					{currentWord + " " + sampleText}
				</Box>
				<TextField fullWidth onChange={validate} label="type here" />
				<Logout setAuthentication={setAuthentication} />
			</Container>
		</ThemeProvider>
	);
}

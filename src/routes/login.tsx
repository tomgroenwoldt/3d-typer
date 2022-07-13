import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { authenticate, AuthenticationProps } from "../auth";

function Copyright() {
	return (
		<Typography variant="body2" color="text.secondary" align="center">
			{"Copyright © "}
			<Link color="inherit" href="https://tomgroenwoldt.de/">
				tomgroenwoldt.de
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

const theme = createTheme();

export default function Login(props: AuthenticationProps): JSX.Element {
	const navigate = useNavigate();

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		await fetch("http://" + process.env.REACT_APP_HOST + ":8000/login", {
			method: "POST",
			mode: "cors",
			credentials: "include",
			body: new FormData(event.currentTarget),
			headers: {
				Accept: "application/json",
			},
		}).catch(err => {
			console.log("Error logging in: " + err);
		});
		if (props.setAuthentication !== undefined) {
			await authenticate(props.setAuthentication);
		}
		navigate("/");
	}

	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}>
					<Avatar
						sx={{
							m: 1,
							bgcolor: "secondary.main",
						}}>
						<RemoveCircleOutlineIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign in
					</Typography>
					<Box
						component="form"
						onSubmit={handleSubmit}
						noValidate
						sx={{ mt: 1 }}>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}>
							Sign In
						</Button>
						<Grid container>
							<Grid item>
								<Link href="/signup" variant="body2">
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
				<Copyright />
			</Container>
		</ThemeProvider>
	);
}

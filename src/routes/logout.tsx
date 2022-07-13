import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthenticationProps } from "../auth";

const theme = createTheme();

export default function Logout(props: AuthenticationProps): JSX.Element {
	async function logout() {
		await fetch("http://" + process.env.REACT_APP_HOST + ":8000/logout", {
			method: "GET",
			mode: "cors",
			credentials: "include",
			headers: {
				Accept: "application/json",
			},
		}).catch(err => {
			console.log("Error logging out: " + err);
		});
		if (props.setAuthentication !== undefined) {
			props.setAuthentication(false);
		}
	}
	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Button
					fullWidth
					variant="contained"
					sx={{ mt: 3, mb: 2 }}
					onClick={logout}>
					Logout
				</Button>
			</Container>
		</ThemeProvider>
	);
}

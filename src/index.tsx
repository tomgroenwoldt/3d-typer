import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Play from "./routes/play";
import Login from "./routes/login";
import SignUp from "./routes/signup";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<BrowserRouter>
		<Routes>
			<Route path="signup" element={<SignUp />} />
			<Route path="/" element={<Play />} />
			<Route path="login" element={<Login />} />
		</Routes>
	</BrowserRouter>
);

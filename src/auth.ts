export interface AuthenticationProps {
	setAuthentication?: (authenticated: boolean) => void;
}

export async function authenticate(
	setAuthentication: (data: boolean) => void
): Promise<void> {
	await fetch("http://localhost:8000/authenticate", {
		method: "GET",
		mode: "cors",
		credentials: "include",
		headers: {
			Accept: "application/json",
		},
	})
		.then(res => res.json())
		.then((data: boolean) => {
			setAuthentication(data);
		})
		.catch(err => {
			console.log("Error authenticating: " + err);
		});
}

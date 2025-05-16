import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { TodoMachineContext } from './machines/todo';

export default function App() {
	return (
		<html>
			<head>
				<link rel="icon" href="data:image/x-icon;base64,AA" />
				<link href="/app/tailwind.css" rel="stylesheet" />
				<Meta />
				<Links />
			</head>
			<body>
				<TodoMachineContext.Provider>
					<Outlet />
				</TodoMachineContext.Provider>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

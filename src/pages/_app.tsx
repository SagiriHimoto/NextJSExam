import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
	const [userToken, setUserToken] = useState<string | null>(null);
	const [username, setUsername] = useState<string | null>(null);

	useEffect(() => {
		const token = localStorage.getItem('userToken');
		const storedUsername = localStorage.getItem('username');
		if (token && storedUsername) {
			setUserToken(token);
			setUsername(storedUsername);
		} else {
			setUserToken(null);
			setUsername(null);
		}
		import('bootstrap/dist/js/bootstrap.bundle.min.js');
	}, []);

	const handleLogin = (token: string, username: string) => {
		setUserToken(token);
		setUsername(username);
		localStorage.setItem('userToken', token);
		localStorage.setItem('username', username);
	};

	const handleLogout = () => {
		setUserToken(null);
		setUsername(null);
		localStorage.removeItem('userToken');
		localStorage.removeItem('username');
	};

	return (
		<Component 
			{...pageProps} 
			userToken={userToken} 
			username={username} 
			setUserToken={setUserToken} 
			setUsername={setUsername} 
			handleLogin={handleLogin} 
			handleLogout={handleLogout}
		/>
	);
};

export default MyApp;
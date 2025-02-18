import React, { useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from './NavBar';
import { login, fetchData } from '../utils/api';

interface LoginProps {
	onLogin: (token: string, username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const router = useRouter();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userImage, setUserImage] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		try {
			const result = await login(email, password);
			if (result.error) {
				setError(result.error);
			} else {
				onLogin(result.token ?? '', result.username ?? '');
				const data = await fetchData('users', result.token ?? '');
				const currentUser = data.users.find((user: any) => user.username === result.username);
				setUserImage(currentUser?.image || null);
				setIsLoggedIn(true);
				router.push('/data');
			}
		} catch (error) {
			setError('An unknown error occurred');
		}
	};

	return (
		<div>
			<NavBar isLoggedIn={isLoggedIn} username={email || ''} handleLogout={() => router.push('/login')} userImage={userImage} />
			<div className='d-flex justify-content-center mt-5'>
				<div className={"card"} style={{ width: "18rem" }}>
					<div className={"card-body"}>
						<form onSubmit={handleSubmit}>
							<div>
								<label>
									Email:<br/>
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
									/>
								</label>
							</div>
							<div>
								<label>
									Password:<br/>
									<input
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
									/>
								</label>
							</div><br/>
							{error && <p style={{ color: 'red' }}>{error}</p>}
							<button className={"btn btn-outline-success"} type="submit">Login</button>
						</form>
			</div></div></div>
		</div>
	);
};

export default Login;
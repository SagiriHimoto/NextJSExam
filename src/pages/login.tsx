import { useRouter } from 'next/router';
import Login from '../components/Login';

const LoginPage = ({ handleLogin }: { handleLogin: (token: string, username: string) => void }) => {
	const router = useRouter();

	const onLogin = (token: string, username: string) => {
		handleLogin(token, username);
		router.push('/userdata');
	};

	return <Login onLogin={onLogin} />;
};

export default LoginPage;
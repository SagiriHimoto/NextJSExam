import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Data from '../components/Data';

const DataPage = ({ userToken, username, handleLogout }: { userToken: string | null; username: string | null; handleLogout: () => void }) => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const token = localStorage.getItem('userToken');
		const storedUsername = localStorage.getItem('username');
		if (token && storedUsername) {
			setIsLoggedIn(true);
		} else {
			router.push('/login'); // send you to the shadow realm (login page)
		}
	}, [router]);

	if (!isLoggedIn) {
		return null; // tfw logging out doesn't work without this
	}

	return <Data userToken={userToken} username={username} handleLogout={handleLogout} />;
};

export default DataPage;
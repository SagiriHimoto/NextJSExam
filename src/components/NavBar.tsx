import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const NavBar = ({ isLoggedIn, username, handleLogout, userImage }: { isLoggedIn: boolean; username: string | null; handleLogout: () => void; userImage: string | null }) => {
	const router = useRouter();
	const [userImageState, setUserImageState] = useState<string | null>(userImage);

	useEffect(() => {
		if (isLoggedIn && username && !userImageState) {
			const fetchUserData = async () => {
				try {
					const response = await axios.get(`https://dummyjson.com/users/search?q=${username}`);
					if (response.status === 200 && response.data.users.length > 0) {
						setUserImageState(response.data.users[0].image);
					}
				} catch (error) {
					console.error('Error fetching user data:', error);
				}
			};
			fetchUserData();
		}
	}, [isLoggedIn, username, userImageState]);

	const currentPage = router.pathname;

	if (!isLoggedIn && ["/recipedata", "/userdata", "/recipe", "/profile"].includes(currentPage)) {
		router.push('/login');
	}

	return (
		<nav className='navbar sticky-top flex-wrap align-items-center'>
			<div className='container-fluid align-items-center'>
				<a className="navbar-brand" ><img src={"https://placehold.co/400"} width={"60px"} onClick={() => router.push('/')} alt="Logo" /> (Not) DummyJson</a>
				<div className="containerforbuttonsanstuff align-self-center mb-4 justify-content-end flex-grow-1">
					{isLoggedIn && (<span className="nav-item">
						<button className={"btn align-self-center btn-outline-success"} onClick={() => router.push('/userdata')}>users</button>
					</span>)}
					{isLoggedIn && (<span className="nav-item">
						<button className={"btn align-self-center btn-outline-success"} onClick={() => router.push('/recipedata')}>recipes</button>
					</span>)}
					{isLoggedIn && (
						<span className="nav-item">
							{!(["/recipe", "/profile"].includes(currentPage)) && <button className={"btn align-self-center btn-outline-success"} onClick={handleLogout}>
								<span>Logout</span>
							</button>}
							<button className={"btn align-self-center btn-outline-success"} onClick={() => router.push('/profile')}>
								<span>
									<img src={userImageState || 'https://placehold.co/50'} alt={username || 'User'} width={"30px"} style={{ borderRadius: '50%' }} /> {username}
								</span>
							</button>
						</span>
					)}
					{!isLoggedIn && (<span className="nav-item">
					<button className={"btn align-self-center btn-outline-success"} onClick={() => router.push('/login')}>Login</button>
					</span>)}
				</div>
			</div>
		</nav>
	);
};

export default NavBar;
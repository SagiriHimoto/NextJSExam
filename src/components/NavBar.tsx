import { useRouter } from 'next/router';

const NavBar = ({ isLoggedIn, username, handleLogout, userImage }: { isLoggedIn: boolean; username: string | null; handleLogout: () => void; userImage: string | null }) => {
	const router = useRouter();

	return (
		<nav className='navbar sticky-top flex-wrap align-items-center'>
			<div className='container-fluid align-items-center'>
				<a className="navbar-brand" ><img src={"https://placehold.co/400"} width={"60px"} onClick={() => router.push('/')} alt="Logo" /> (Not) DummyJson</a>
				<div className="containerforbuttonsanstuff align-self-center mb-4 justify-content-end flex-grow-1">
					{isLoggedIn && (<span className="nav-item">
						<button className={"btn align-self-center btn-outline-success"} onClick={() => router.push('/data')}>Data</button>
					</span>)}
					{isLoggedIn && (
						<span className="nav-item">
							<button className={"btn align-self-center btn-outline-success"} onClick={handleLogout}>
								<span>
									<img src={userImage || 'https://placehold.co/50'} alt={username || 'User'} width={"30px"} style={{ borderRadius: '50%' }} /> {username}
								</span> | Logout
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
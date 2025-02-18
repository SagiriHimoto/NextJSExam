import { useEffect, useState } from 'react';
import { fetchData } from '../utils/api';
import { useRouter } from 'next/router';
import NavBar from './NavBar';

interface DataProps {
	userToken: string | null;
	username: string | null;
	handleLogout: () => void;
}

const Data = ({ userToken, username, handleLogout }: DataProps) => {
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchField, setSearchField] = useState('firstName');
	const [searchQuery, setSearchQuery] = useState('');
	const router = useRouter();
	const isLoggedIn = !!userToken;
	const [userImage, setUserImage] = useState<string | null>(null);
	// ^^ I know it's a lot but bear with me (it gets worse from here)
	useEffect(() => {
		if (userToken) {
			fetchData('users', userToken)
				.then(data => {
					setData(data.users);
					setFilteredData(data.users);
					const currentUser = data.users.find((user: any) => user.username === username);
					setUserImage(currentUser?.image || null);
					setLoading(false);
				})
				.catch(error => {
					setError(error.message);
					setLoading(false);
				});
		} else {
			setLoading(false);
			setError('Not authenticated');
			router.push('/login');
		}
	}, [userToken, username]);

	useEffect(() => {
		const filtered = data.filter((user: any) => {
			const value = user[searchField]?.toString().toLowerCase() || '';
			return value.includes(searchQuery.toLowerCase());
		});
		setFilteredData(filtered);
	}, [searchField, searchQuery, data]);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className="container mt-4">
			<NavBar isLoggedIn={isLoggedIn} username={username} handleLogout={handleLogout} userImage={userImage} />
			<h1>Data</h1>
			<div className="mb-3">
				<div className="input-group">
					<select
						className="form-select"
						value={searchField}
						onChange={(e) => setSearchField(e.target.value)}
					>
						<option value="firstName">First Name</option>
						<option value="lastName">Last Name</option>
						<option value="email">Email</option>
						<option value="username">Username</option>
					</select>
					<input
						type="text"
						className="form-control"
						placeholder="Search"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>
			<div className="accordion" id="dataAccordion">
				{filteredData.map((user: any, index: number) => (
					<div className="accordion-item" key={user.id}>
						<h2 className="accordion-header" id={`heading${index}`}>
							<button
								className="collapsed accordion-button"
								type="button"
								data-bs-toggle="collapse"
								data-bs-target={`#collapse${index}`}
								aria-expanded="true"
								aria-controls={`collapse${index}`}
							>
								<img src={user.image} alt={user.firstName} className="me-2" style={{ width: '50px', height: '50px' }} />
								{user.firstName} {user.lastName} - {user.role}
							</button>
						</h2>
						<div
							id={`collapse${index}`}
							className="accordion-collapse collapse"
							aria-labelledby={`heading${index}`}
							data-bs-parent="#dataAccordion"
						>
							<div className="accordion-body">
								<span>Username:</span>
								<input type="text" className="form-control disabled" value={user.username} readOnly />
								<span>Email:</span>
								<input type="text" className="form-control disabled" value={user.email} readOnly />
								<span>Password:</span>
								<input type="text" className="form-control disabled" value={user.password} readOnly />
								<pre>{JSON.stringify(user, null, 2)}</pre>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Data;
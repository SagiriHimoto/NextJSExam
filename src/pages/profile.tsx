import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../components/NavBar';
import axios from 'axios';

const Profile = () => {
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const { id } = router.query;
	const [userImage, setUserImage] = useState<string | null>(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [username, setUsername] = useState<string | null>(null);

	useEffect(() => {
		const token = localStorage.getItem('userToken');
		const storedUsername = localStorage.getItem('username');
		if (token && storedUsername) {
			setIsLoggedIn(true);
			setUsername(storedUsername);
		}
	}, []);

	useEffect(() => {
		if (id) {
			axios.get(`https://dummyjson.com/users/${id}`)
				.then(response => {
					setUser(response.data);
					setLoading(false);
				})
				.catch(error => {
					setError(error.message);
					setLoading(false);
				});
		}
	}, [id]);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<div className="container mt-4">
			<NavBar isLoggedIn={isLoggedIn} username={username} handleLogout={() => {}} userImage={userImage} />
			<h1>Profile</h1>
			{user && (
				<div>
					<div className="row mb-4">
						<div className="col-md-4">
							<img src={user.image} alt={user.firstName} className="img-fluid" />
						</div>
						<div className="col-md-8">
							<h2>{user.firstName} {user.lastName}</h2>
							<p><strong>Username:</strong> {user.username}</p>
							<p><strong>Email:</strong> {user.email}</p>
							<p><strong>Role:</strong> {user.role}</p>
							<p><strong>Gender:</strong> {user.gender}</p>
							<p><strong>Age:</strong> {user.age}</p>
							<p><strong>Phone:</strong> {user.phone}</p>
							<p><strong>Birth Date:</strong> {user.birthDate}</p>
							<p><strong>Blood Group:</strong> {user.bloodGroup}</p>
							<p><strong>Height:</strong> {user.height} cm</p>
							<p><strong>Weight:</strong> {user.weight} kg</p>
							<p><strong>Eye Color:</strong> {user.eyeColor}</p>
							<p><strong>Hair:</strong> {user.hair.color}, {user.hair.type}</p>
						</div>
					</div>
					<div className="row mb-4">
						<div className="col-md-12">
							<h3>Address</h3>
							<p><strong>Address:</strong> {user.address.address}</p>
							<p><strong>City:</strong> {user.address.city}</p>
							<p><strong>State:</strong> {user.address.state}</p>
							<p><strong>Postal Code:</strong> {user.address.postalCode}</p>
							<p><strong>Country:</strong> {user.address.country}</p>
						</div>
					</div>
					<div className="row mb-4">
						<div className="col-md-12">
							<h3>Company</h3>
							<p><strong>Company Name:</strong> {user.company.name}</p>
							<p><strong>Department:</strong> {user.company.department}</p>
							<p><strong>Title:</strong> {user.company.title}</p>
							<p><strong>Company Address:</strong> {user.company.address.address}</p>
							<p><strong>City:</strong> {user.company.address.city}</p>
							<p><strong>State:</strong> {user.company.address.state}</p>
							<p><strong>Postal Code:</strong> {user.company.address.postalCode}</p>
							<p><strong>Country:</strong> {user.company.address.country}</p>
						</div>
					</div>
					<div className="row mb-4">
						<div className="col-md-12">
							<h3>Bank</h3>
							<p><strong>Card Number:</strong> {user.bank.cardNumber}</p>
							<p><strong>Card Type:</strong> {user.bank.cardType}</p>
							<p><strong>Card Expiry:</strong> {user.bank.cardExpire}</p>
							<p><strong>Currency:</strong> {user.bank.currency}</p>
							<p><strong>IBAN:</strong> {user.bank.iban}</p>
						</div>
					</div>
					<div className="row mb-4">
						<div className="col-md-12">
							<h3>Crypto</h3>
							<p><strong>Coin:</strong> {user.crypto.coin}</p>
							<p><strong>Wallet:</strong> {user.crypto.wallet}</p>
							<p><strong>Network:</strong> {user.crypto.network}</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Profile;
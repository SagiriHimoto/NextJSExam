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
	const [searchQuery, setSearchQuery] = useState('');
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalItems, setTotalItems] = useState(0);
	const router = useRouter();
	const isLoggedIn = !!userToken;
	const [userImage, setUserImage] = useState<string | null>(null);

	useEffect(() => {
		if (userToken) {
			fetchData('users', userToken, '', '', itemsPerPage, (currentPage - 1) * itemsPerPage)
				.then(data => {
					setData(data.users);
					setFilteredData(data.users);
					setTotalItems(data.total);
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
	}, [userToken, username, itemsPerPage, currentPage]);

	useEffect(() => {
		if (searchQuery) {
			fetchData('users', userToken, searchQuery, '', itemsPerPage, (currentPage - 1) * itemsPerPage)
				.then(data => {
					setFilteredData(data.users);
					setTotalItems(data.total);
				})
				.catch(error => {
					setError(error.message);
				});
		} else {
			setFilteredData(data);
		}
	}, [searchQuery, userToken, itemsPerPage, currentPage]);

	const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setItemsPerPage(Number(e.target.value));
		setCurrentPage(1);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	const totalPages = Math.ceil(totalItems / itemsPerPage);

	const renderPageNumbers = () => {
		const pageNumbers = [];
		const startPage = Math.max(1, currentPage - 2);
		const endPage = Math.min(totalPages, currentPage + 2);

		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(
				<li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
					<button className="page-link" onClick={() => handlePageChange(i)}>{i}</button>
				</li>
			);
		}

		return pageNumbers;
	};

	return (
		<div className="container mt-4">
			<NavBar isLoggedIn={isLoggedIn} username={username} handleLogout={handleLogout} userImage={userImage} />
			<h1>Data</h1>
			<div className="mb-3">
				<div className="input-group">
					<input
						type="text"
						className="form-control"
						placeholder="Search"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>
			<div className="mb-3">
				<label htmlFor="itemsPerPage" className="form-label">Items per page:</label>
				<select id="itemsPerPage" className="form-select" value={itemsPerPage} onChange={handleItemsPerPageChange}>
					<option value={5}>5</option>
					<option value={10}>10</option>
					<option value={15}>15</option>
					<option value={30}>30</option>
				</select>
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
								<span>ID: {user.id}<br/></span>
								<button
									className="btn btn-primary mt-2"
									onClick={() => router.push(`/profile?id=${user.id}`)}
								>
									View Profile
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
			<nav aria-label="Page navigation">
				<ul className="pagination">
					<li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
						<button className="page-link" onClick={() => handlePageChange(1)}>&laquo;</button>
					</li>
					<li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
						<button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>&lsaquo;</button>
					</li>
					{renderPageNumbers()}
					<li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
						<button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>&rsaquo;</button>
					</li>
					<li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
						<button className="page-link" onClick={() => handlePageChange(totalPages)}>&raquo;</button>
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default Data;
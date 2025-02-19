import { useEffect, useState } from 'react';
import { fetchData } from '../utils/api';
import { useRouter } from 'next/router';
import NavBar from './NavBar';

interface DataProps {
	userToken: string | null;
	username: string | null;
	handleLogout: () => void;
}

const DataRecipe = ({ userToken, username, handleLogout }: DataProps) => {
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedTag, setSelectedTag] = useState<string | null>(null);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalItems, setTotalItems] = useState(0);
	const router = useRouter();
	const isLoggedIn = !!userToken;
	const [userImage, setUserImage] = useState<string | null>(null);

	useEffect(() => {
		if (userToken) {
			fetchData('recipes', userToken, '', '', itemsPerPage, (currentPage - 1) * itemsPerPage)
				.then(data => {
					setData(data.recipes);
					setFilteredData(data.recipes);
					setTotalItems(data.total);
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
	}, [userToken, itemsPerPage, currentPage]);

	useEffect(() => {
		if (searchQuery) {
			fetchData('recipes', userToken, searchQuery, '', itemsPerPage, (currentPage - 1) * itemsPerPage)
				.then(data => {
					setFilteredData(data.recipes);
					setTotalItems(data.total);
				})
				.catch(error => {
					setError(error.message);
				});
		} else if (selectedTag) {
			fetchData('recipes', userToken, '', selectedTag, itemsPerPage, (currentPage - 1) * itemsPerPage)
				.then(data => {
					setFilteredData(data.recipes);
					setTotalItems(data.total);
				})
				.catch(error => {
					setError(error.message);
				});
		} else {
			fetchData('recipes', userToken, '', '', itemsPerPage, (currentPage - 1) * itemsPerPage)
				.then(data => {
					setFilteredData(data.recipes);
					setTotalItems(data.total);
				})
				.catch(error => {
					setError(error.message);
				});
		}
	}, [searchQuery, selectedTag, userToken, itemsPerPage, currentPage]);

	const handleTagClick = (tag: string) => {
		setSelectedTag(tag);
		setSearchQuery('');
		setCurrentPage(1);
	};

	const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setItemsPerPage(Number(e.target.value));
		setCurrentPage(1);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleClearTag = () => {
		setSelectedTag(null);
		setCurrentPage(1);
		fetchData('recipes', userToken, '', '', itemsPerPage, 0)
			.then(data => {
				setFilteredData(data.recipes);
				setTotalItems(data.total);
			})
			.catch(error => {
				setError(error.message);
			});
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	const totalPages = Math.ceil(totalItems / itemsPerPage);

	return (
		<div className="container mt-4">
			<NavBar isLoggedIn={isLoggedIn} username={username} handleLogout={handleLogout} userImage={userImage} />
			<h1>Recipes</h1>
			{selectedTag ? (
				<div className="mb-3">
					<span className="badge bg-primary me-2" style={{ cursor: 'pointer' }} onClick={handleClearTag}>
						{selectedTag} <span className="badge bg-secondary">x</span>
					</span>
				</div>
			) : (
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
			)}
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
				{filteredData.map((recipe: any, index: number) => (
					<div className="accordion-item" key={recipe.id}>
						<h2 className="accordion-header" id={`heading${index}`}>
							<button
								className="collapsed accordion-button"
								type="button"
								data-bs-toggle="collapse"
								data-bs-target={`#collapse${index}`}
								aria-expanded="true"
								aria-controls={`collapse${index}`}
							>
								<img className="me-2" style={{ width: '50px', height: '50px' }} src={recipe.image}/> {recipe.name}
							</button>
						</h2>
						<div
							id={`collapse${index}`}
							className="accordion-collapse collapse"
							aria-labelledby={`heading${index}`}
							data-bs-parent="#dataAccordion"
						>
							<div className="accordion-body">
								<pre>{recipe.rating}<svg style={{verticalAlign: "text-top"}} fill='#ffcc00' width="15px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
								<path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
								</svg> ({recipe.reviewCount} Reviews)</pre>
								<div className="mb-2">
									{recipe.tags.map((tag: string) => (
										<span
											key={tag}
											className="badge bg-primary me-2"
											style={{ cursor: 'pointer' }}
											onClick={() => handleTagClick(tag)}
										>
											{tag}
										</span>
									))}
								</div>
								<button
									className="btn btn-primary mt-2"
									onClick={() => router.push(`/recipe?id=${recipe.id}`)}
								>
									View Recipe
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
			<nav aria-label="Page navigation">
				<ul className="pagination justify-content-center">
					<li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
						<button className="page-link" onClick={() => handlePageChange(1)}>&laquo;</button>
					</li>
					<li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
						<button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>&lsaquo;</button>
					</li>
					{[...Array(totalPages)].map((_, index) => (
						<li key={index} className={`page-item ${index + 1 === currentPage ? 'active' : ''}`}>
							<button className="page-link" onClick={() => handlePageChange(index + 1)}>
								{index + 1}
							</button>
						</li>
					))}
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

export default DataRecipe;
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import NavBar from '../components/NavBar';

const Recipe = () => {
	const [recipe, setRecipe] = useState<any>(null);
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
			axios.get(`https://dummyjson.com/recipes/${id}`)
				.then(response => {
					setRecipe(response.data);
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
			<h1>Recipe</h1>
			{recipe && (
				<div>
					<div className="row mb-4">
						<div className="col-md-4">
							<img src={recipe.image} alt={recipe.name} className="img-fluid" />
						</div>
						<div className="col-md-8">
							<h2>{recipe.name}</h2>
							<p><strong>Author:</strong> <button className="btn btn-primary mt-2" onClick={() => router.push(`/profile?id=${recipe.userId}`)}>View Profile</button></p>
							<p><strong>Cuisine:</strong> {recipe.cuisine}</p>
							<p><strong>Difficulty:</strong> {recipe.difficulty}</p>
							<p><strong>Prep Time:</strong> {recipe.prepTimeMinutes} minutes</p>
							<p><strong>Cook Time:</strong> {recipe.cookTimeMinutes} minutes</p>
							<p><strong>Servings:</strong> {recipe.servings}</p>
							<p><strong>Calories per Serving:</strong> {recipe.caloriesPerServing}</p>
							<p><strong>Rating:</strong> {recipe.rating} ({recipe.reviewCount} reviews)</p>
							<div className="mb-2">
								{recipe.tags.map((tag: string) => (
									<span key={tag} onClick={()=> router.push("/recipedata")} style={{ cursor: "pointer" }} className="badge bg-primary me-2">{tag}</span>
								))}
							</div>
						</div>
					</div>
					<div className="row mb-4">
						<div className="col-md-12">
							<h3>Ingredients</h3>
							<ul>
								{recipe.ingredients.map((ingredient: string, index: number) => (
									<li key={index}>{ingredient}</li>
								))}
							</ul>
						</div>
					</div>
					<div className="row mb-4">
						<div className="col-md-12">
							<h3>Instructions</h3>
							<ol>
								{recipe.instructions.map((instruction: string, index: number) => (
									<li key={index}>{instruction}</li>
								))}
							</ol>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Recipe;
import axios from 'axios';

const API_URL = 'https://dummyjson.com/users';

export const fetchData = async (endpoint: string, token: string | null) => {
	try {
		const response = await axios.get(`${API_URL}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		if (response.status !== 200) {
			throw new Error(`Network response was not ok: ${response.statusText}`);
		}
		return response.data;
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

export const login = async (email: string, password: string) => {
	try {
		const response = await axios.get(API_URL);
		if (response.status !== 200) {
			throw new Error(`Network response was not ok: ${response.statusText}`);
		}
		const users = response.data.users;
		const user = users.find((user: any) => user.email === email);
		if (!user || user.password !== password) {
			return { error: 'Invalid email or password' };
		}
		return { token: 'dummy-token', username: user.username };
	} catch (error) {
		console.error('Error logging in:', error);
		return { error: 'An unknown error occurred' };
	}
};
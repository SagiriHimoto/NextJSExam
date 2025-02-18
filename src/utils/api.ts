import axios from 'axios';

const API_URL = 'https://dummyjson.com/';

export const fetchData = async (type: 'users' | 'recipes', token: string | null, query: string = '', tag: string = '', limit: number = 10, skip: number = 0) => {
    try {
        let url = `${API_URL}${type}?limit=${limit}&skip=${skip}`;
        if (query) {
            url = `${API_URL}${type}/search?q=${query}&limit=${limit}&skip=${skip}`;
        } else if (tag) {
            url = `${API_URL}${type}/tag/${tag}?limit=${limit}&skip=${skip}`;
        }
        const response = await axios.get(url, {
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
        const response = await axios.get(`${API_URL}users`);
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
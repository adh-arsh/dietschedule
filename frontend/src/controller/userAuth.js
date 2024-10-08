import axios from 'axios';
const backendURL = process.env.REACT_APP_BACKEND_URL;

export const SignupDB = async (email, password) => {
    try {

        console.log('backendURL:', process.env.REACT_APP_BACKEND_URL);

        const response = await axios.post(`${backendURL}/api/auth/register`, { email, password });
        console.log('Signup response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during signup:', error);
        throw error;
    }
};


export const SigninDB = async (email, password) => {
    try {

        const response = await axios.post(`${backendURL}/api/auth/login`, { email, password });
        console.log('Signin response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during signin:', error);
        throw error;
    }
};
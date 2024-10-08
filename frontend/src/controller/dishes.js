import axios from 'axios';
const backendURL = process.env.REACT_APP_BACKEND_URL;  // Load backend URL from environment variable

export const GetDishesDB = async (userId) => {
    try {
        console.log('backendURL:', backendURL);
        const response = await axios.get(`${backendURL}/api/dishes/${userId}`);

        console.log('Get Dishes response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during fetching dishes:', error.response ? error.response.data : error.message);

    }
};


export const PostDishDB = async (formData) => {
    try {

        const response = await axios.post(`${backendURL}/api/dishes`, formData);
        console.log('Post Dish response:', response.data);
        return response.data;
    } catch (error) {

        if (error.response) {

            if (error.response.status === 400 && error.response.data.message === 'Dish with this name already exists') {
                console.warn('Item already exists:', error.response.data.message);

                return { success: false, message: 'This dish name is already taken. Please choose a different name.' };
            } else {
                console.error('Error during adding dish:', error.response.data);
                return { success: false, message: 'An unexpected error occurred. Please try again.' };
            }
        } else {
            console.error('Error during adding dish:', error.message);
            return { success: false, message: 'Network error. Please check your connection.' };
        }
    }
}


export const DeleteDishDB = async (dishId) => {
    try {

        const response = await axios.delete(`${backendURL}/api/dishes/${dishId}`);
        console.log('Delete Dish response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error during deleting dish:', error.response ? error.response.data : error.message);
        throw error;
    }
}

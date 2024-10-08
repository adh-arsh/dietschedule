import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GetDishesDB, PostDishDB } from '../controller/dishes';
import '../css/weekplanner.css';
import DishFormPopup from '../components/DishFormPopup';
import DishCard from '../components/DishCard';
import io from 'socket.io-client';
import debounce from 'lodash.debounce';
import ErrorPopup from '../components/ErrorPopup';

const socket = io(process.env.REACT_APP_BACKEND_URL);

const WeekPlanner = () => {
    const [dishes, setDishes] = useState({});
    const [loading, setLoading] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDishes, setFilteredDishes] = useState({});

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; // List of days

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const userid = localStorage.getItem('userId');
                const response = await GetDishesDB(userid);
                const categorizedDishes = response.reduce((acc, dish) => {
                    const day = dish.day;
                    if (!acc[day]) {
                        acc[day] = [];
                    }
                    acc[day].push(dish);
                    return acc;
                }, {});
                setDishes(categorizedDishes);
                setFilteredDishes(categorizedDishes);
            } catch (err) {
                setError('Failed to fetch dishes. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchDishes();
    }, []);

    useEffect(() => {
        const filterDishes = () => {
            const lowercasedTerm = searchTerm.toLowerCase();
            const newFilteredDishes = {};

            for (const day in dishes) {
                newFilteredDishes[day] = dishes[day].filter(dish =>
                    dish.name.toLowerCase().includes(lowercasedTerm)
                );
            }

            setFilteredDishes(newFilteredDishes);
        };

        filterDishes();
    }, [searchTerm, dishes]);

    const [error, setError] = useState(null);
    const [showErrorPopup, setShowErrorPopup] = useState(false);


    const handleAddDish = async (formData) => {

        setLoading(true);


        const response = await PostDishDB(formData);


        if (response.success) {
            console.log('Added dish:', response);
            const { day } = formData;


            setDishes(prev => ({
                ...prev,
                [day]: [...(prev[day] || []), response]
            }));
            setFilteredDishes(prev => ({
                ...prev,
                [day]: [...(prev[day] || []), response]
            }));

        } else {

            setError(response.message);
            setShowErrorPopup(true);
        }


        setLoading(false);
    };


    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setShowErrorPopup(false);
        setError(null); // Reset error message if needed
    };

    const handleDeleteDish = (id) => {
        socket.emit('deleteDish', id);
        setDishes((prev) => {
            const updatedDishes = { ...prev };
            for (const day in updatedDishes) {
                updatedDishes[day] = updatedDishes[day].filter((dish) => dish._id !== id);
            }
            return updatedDishes;
        });
        setFilteredDishes((prev) => {
            const updatedDishes = { ...prev };
            for (const day in updatedDishes) {
                updatedDishes[day] = updatedDishes[day].filter((dish) => dish._id !== id);
            }
            return updatedDishes;
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };



    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const userid = localStorage.getItem('userId'); // Get user ID from local storage
                const response = await GetDishesDB(userid); // Fetch dishes from backend
                const categorizedDishes = response.reduce((acc, dish) => {
                    const day = dish.day;
                    if (!acc[day]) {
                        acc[day] = [];
                    }
                    acc[day].push(dish);
                    return acc;
                }, {});
                setDishes(categorizedDishes);
                setFilteredDishes(categorizedDishes);
            } catch (err) {
                setError('Failed to fetch dishes. Please try again.'); // Handle error
            } finally {
                setLoading(false); // Set loading to false once the request is complete
            }
        };

        fetchDishes();
    }, []);

    // Update filteredDishes whenever dishes or searchTerm changes
    useEffect(() => {
        const filterDishes = () => {
            const lowercasedTerm = searchTerm.toLowerCase();
            const newFilteredDishes = {};

            for (const day in dishes) {
                newFilteredDishes[day] = dishes[day].filter(dish =>
                    dish.name.toLowerCase().includes(lowercasedTerm)
                );
            }

            setFilteredDishes(newFilteredDishes); // Set filtered dishes based on search term
        };

        filterDishes(); // Call the filter function when search term changes
    }, [searchTerm, dishes]);


    const handleDragStart = (e, id) => {
        e.dataTransfer.setData('dishId', id); // Store the dish ID in the drag event
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const dishId = e.dataTransfer.getData('dishId');
        const newDay = e.target.id;
        console.log(newDay);
        console.log(`Dropped dish ID: ${dishId} on ${newDay}`);

        // Check the previous day of the dish and remove it from there
        setFilteredDishes((prev) => {
            const updatedDishes = { ...prev };
            let dishToMove = null;

            // Find the dish and its current day
            for (const day in updatedDishes) {
                const foundDish = updatedDishes[day].find(dish => dish._id === dishId);
                if (foundDish) {
                    dishToMove = foundDish; // Keep a reference to the dish being moved
                    updatedDishes[day] = updatedDishes[day].filter(dish => dish._id !== dishId); // Remove from current day
                    break;
                }
            }

            // If dish is found, add it to the new day
            if (dishToMove) {
                // Update the dish's day and add to the new day
                updatedDishes[newDay] = [...(updatedDishes[newDay] || []), { ...dishToMove, day: newDay }];

                // Emit the move to the server
                socket.emit('moveDish', { dishId, newDay });
            }

            return updatedDishes; // Return the updated state
        });
    };
    const handleSignOut = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('authToken');
        localStorage.removeItem('email');

        window.location.href = '/login';
    };


    return (
        <div className="week-planner">
            <div className="header">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search dishes..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <button className="sign-out-button" onClick={handleSignOut}>
                    Sign Out
                </button>
            </div>
            {loading ? (
                <p>Loading dishes...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div className="week-planner-grid">
                    <div className="header-row">
                        {daysOfWeek.map(day => (
                            <div key={day} className="header-cell">{day}</div>
                        ))}
                    </div>
                    <div className="day-row">
                        {daysOfWeek.map(day => (
                            <div key={day} className="day-cell">
                                <div className='dish-column' id={day} onDragOver={handleDragOver} onDrop={handleDrop}>
                                    {filteredDishes[day] && filteredDishes[day].length > 0 ? (
                                        filteredDishes[day].map(dish => (
                                            <DishCard
                                                key={dish._id}
                                                id={dish._id}
                                                name={dish.name}
                                                image={dish.image}
                                                onDelete={handleDeleteDish}
                                                onDragStart={handleDragStart}
                                            />
                                        ))
                                    ) : (
                                        <div className='dish-column' id={day} onDragOver={handleDragOver} onDrop={handleDrop}>
                                            <div className="empty-cell">No dishes</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <button className="fab" onClick={handleOpenPopup}>+</button>
            {isPopupOpen && (
                <DishFormPopup onClose={handleClosePopup} onSubmit={handleAddDish} />
            )}

            {showErrorPopup && <ErrorPopup message={error} onClose={handleClosePopup} />}


        </div>
    );
};

export default WeekPlanner;
